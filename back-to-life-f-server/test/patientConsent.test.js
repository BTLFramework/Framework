const test = require('node:test')
const assert = require('node:assert/strict')
require('ts-node/register/transpile-only')

const {
  CURRENT_PATIENT_CONSENT_VERSION,
  getIntakeConsentValidationError,
} = require('../src/services/patientConsent.ts')

const validConsent = {
  version: CURRENT_PATIENT_CONSENT_VERSION,
  healthInformationConsentAccepted: true,
  electronicCommunicationsAccepted: true,
}

test('current explicit consent is accepted for intake', () => {
  assert.equal(getIntakeConsentValidationError('Intake', validConsent), null)
})

test('intake consent fails closed when missing, stale, or incomplete', () => {
  assert.match(getIntakeConsentValidationError('Intake'), /review and accept/)
  assert.match(getIntakeConsentValidationError('Intake', { ...validConsent, version: 'old' }), /review and accept/)
  assert.match(getIntakeConsentValidationError('Intake', { ...validConsent, healthInformationConsentAccepted: false }), /health information/)
  assert.match(getIntakeConsentValidationError('Intake', { ...validConsent, electronicCommunicationsAccepted: false }), /portal and email/)
})

test('follow-up assessments do not manufacture a new intake consent requirement', () => {
  assert.equal(getIntakeConsentValidationError('Follow-Up'), null)
})
