require('ts-node/register/transpile-only')

const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const { requirePractitionerAuth } = require('../src/middleware/requirePractitionerAuth.ts')

const invoke = ({ token, requestedWith = 'XMLHttpRequest' } = {}, secret = 'test-practitioner-secret') => {
  const previousSecret = process.env.JWT_SECRET
  if (secret === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = secret

  const result = { statusCode: null, body: null, nextCalled: false, practitioner: null }
  const req = {
    cookies: token ? { btl_practitioner_session: token } : {},
    get(name) { return name === 'X-Requested-With' ? requestedWith : undefined },
  }
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

test('requires a secure session cookie for practitioner endpoints', () => {
  assert.equal(invoke().statusCode, 401)
})

test('accepts current practitioner login tokens', () => {
  const token = jwt.sign({ userId: 7 }, 'test-practitioner-secret', { expiresIn: '1h' })
  const result = invoke({ token })
  assert.equal(result.nextCalled, true)
  assert.deepEqual(result.practitioner, { userId: 7 })
})

test('requires the dashboard verification header', () => {
  const token = jwt.sign({ userId: 7 }, 'test-practitioner-secret', { expiresIn: '1h' })
  assert.equal(invoke({ token, requestedWith: null }).statusCode, 403)
})

test('rejects patient and expired tokens', () => {
  const patient = jwt.sign({ patientId: 9, role: 'patient' }, 'test-practitioner-secret', { expiresIn: '1h' })
  const expired = jwt.sign({ userId: 7 }, 'test-practitioner-secret', { expiresIn: -1 })
  assert.equal(invoke({ token: patient }).statusCode, 403)
  assert.equal(invoke({ token: expired }).statusCode, 401)
})
