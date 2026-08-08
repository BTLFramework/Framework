const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const {
  getExistingPatientIntakeConflict,
} = require('../src/services/onboardingIdentity');

const patient = {
  name: 'Wyatt Test',
  dob: new Date('1990-01-01T00:00:00.000Z'),
};

test('a duplicate initial intake fails closed before patient data can be reused', () => {
  const conflict = getExistingPatientIntakeConflict(
    patient,
    'Intake',
    'Different Patient',
    '1992-02-02'
  );

  assert.equal(conflict.code, 'PATIENT_EMAIL_EXISTS');
});

test('a follow-up requires the stored name and date of birth', () => {
  const conflict = getExistingPatientIntakeConflict(
    patient,
    'Follow-Up',
    'Different Patient',
    '1990-01-01'
  );

  assert.equal(conflict.code, 'PATIENT_IDENTITY_MISMATCH');
});

test('a matching follow-up can continue on the existing patient record', () => {
  const conflict = getExistingPatientIntakeConflict(
    patient,
    'Follow-Up',
    'wyatt test',
    '1990-01-01'
  );

  assert.equal(conflict, null);
});
