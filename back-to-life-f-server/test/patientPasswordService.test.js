const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const {
  hashPatientPassword,
  isHashedPatientPassword,
  verifyPatientPassword,
} = require('../src/services/patientPasswordService');

test('new patient passwords are stored as bcrypt hashes', async () => {
  const password = 'Beta portal password 42!';
  const stored = await hashPatientPassword(password);

  assert.notEqual(stored, password);
  assert.equal(isHashedPatientPassword(stored), true);
  assert.deepEqual(await verifyPatientPassword(stored, password), {
    valid: true,
    needsUpgrade: false,
  });
});

test('an incorrect password does not verify against a hash', async () => {
  const stored = await hashPatientPassword('correct password');

  assert.deepEqual(await verifyPatientPassword(stored, 'incorrect password'), {
    valid: false,
    needsUpgrade: false,
  });
});

test('a matching legacy plaintext password is accepted once and marked for migration', async () => {
  assert.deepEqual(await verifyPatientPassword('legacy password', 'legacy password'), {
    valid: true,
    needsUpgrade: true,
  });
});

test('an incorrect legacy plaintext password is rejected', async () => {
  assert.deepEqual(await verifyPatientPassword('legacy password', 'wrong password'), {
    valid: false,
    needsUpgrade: false,
  });
});
