require('ts-node/register/transpile-only')

const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const { requirePractitionerAuth } = require('../src/middleware/requirePractitionerAuth.ts')

const invoke = (authorization, secret = 'test-practitioner-secret') => {
  const previousSecret = process.env.JWT_SECRET
  if (secret === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = secret

  const result = { statusCode: null, body: null, nextCalled: false, practitioner: null }
  const req = { headers: { authorization } }
  const res = {
    status(code) { result.statusCode = code; return this },
    json(body) { result.body = body; return this },
  }

  requirePractitionerAuth(req, res, () => { result.nextCalled = true })
  result.practitioner = req.practitioner

  if (previousSecret === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = previousSecret
  return result
}

test('requires a bearer token for practitioner endpoints', () => {
  assert.equal(invoke(undefined).statusCode, 401)
})

test('accepts current practitioner login tokens', () => {
  const token = jwt.sign({ userId: 7 }, 'test-practitioner-secret', { expiresIn: '1h' })
  const result = invoke(`Bearer ${token}`)
  assert.equal(result.nextCalled, true)
  assert.deepEqual(result.practitioner, { userId: 7 })
})

test('rejects patient and expired tokens', () => {
  const patient = jwt.sign({ patientId: 9, role: 'patient' }, 'test-practitioner-secret', { expiresIn: '1h' })
  const expired = jwt.sign({ userId: 7 }, 'test-practitioner-secret', { expiresIn: -1 })
  assert.equal(invoke(`Bearer ${patient}`).statusCode, 403)
  assert.equal(invoke(`Bearer ${expired}`).statusCode, 401)
})
