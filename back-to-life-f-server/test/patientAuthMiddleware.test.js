require('ts-node/register/transpile-only')

const test = require('node:test')
const assert = require('node:assert/strict')
const jwt = require('jsonwebtoken')
const { requirePatientAccess } = require('../src/middleware/requirePatientAuth.ts')

const invoke = ({ token, params, body } = {}) => {
  const previousSecret = process.env.JWT_SECRET
  process.env.JWT_SECRET = 'test-patient-secret'

  const result = { statusCode: null, body: null, nextCalled: false, patient: null }
  const req = { cookies: token ? { patientToken: token } : {}, params: params || {}, body: body || {} }
  const res = {
    status(code) { result.statusCode = code; return this },
    json(responseBody) { result.body = responseBody; return this },
  }

  requirePatientAccess(req, res, () => { result.nextCalled = true })
  result.patient = req.patient

  if (previousSecret === undefined) delete process.env.JWT_SECRET
  else process.env.JWT_SECRET = previousSecret
  return result
}

const patientToken = (patientId, options = {}) => jwt.sign(
  { patientId, role: 'patient', email: 'patient@example.com' },
  'test-patient-secret',
  { expiresIn: '1h', ...options },
)

test('patient message endpoints require a signed patient session', () => {
  assert.equal(invoke({ params: { patientId: '6' } }).statusCode, 401)
})

test('patient session can access only its matching patient ID', () => {
  const token = patientToken(6)
  const accepted = invoke({ token, params: { patientId: '6' } })
  const rejected = invoke({ token, params: { patientId: '7' } })

  assert.equal(accepted.nextCalled, true)
  assert.deepEqual(accepted.patient, { patientId: 6, email: 'patient@example.com' })
  assert.equal(rejected.statusCode, 403)
})

test('patient reply body must match the signed patient ID', () => {
  const token = patientToken(6)
  assert.equal(invoke({ token, body: { patientId: 6 } }).nextCalled, true)
  assert.equal(invoke({ token, body: { patientId: 9 } }).statusCode, 403)
})

test('expired and practitioner tokens cannot access patient messages', () => {
  const expired = patientToken(6, { expiresIn: -1 })
  const practitioner = jwt.sign({ userId: 1 }, 'test-patient-secret', { expiresIn: '1h' })

  assert.equal(invoke({ token: expired, params: { patientId: '6' } }).statusCode, 401)
  assert.equal(invoke({ token: practitioner, params: { patientId: '6' } }).statusCode, 403)
})
