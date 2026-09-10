const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

process.env.JWT_SECRET = 'practitioner-reset-test-secret';
const {
  generatePractitionerPasswordResetToken,
  readPractitionerPasswordResetSubject,
  verifyPractitionerPasswordResetToken,
} = require('../src/services/practitionerPasswordReset');

const user = { id: 7, email: 'Clinician@Example.com', password: 'stored-bcrypt-hash' };
const now = Date.parse('2026-09-10T12:00:00Z');

test('creates a reset token bound to the clinician and current password hash', () => {
  const token = generatePractitionerPasswordResetToken(user, now);
  assert.deepEqual(readPractitionerPasswordResetSubject(token), {
    id: 7,
    email: 'clinician@example.com',
  });
  assert.ok(verifyPractitionerPasswordResetToken(token, user, now + 10_000));
  assert.equal(
    verifyPractitionerPasswordResetToken(token, { ...user, password: 'new-hash' }, now + 10_000),
    null
  );
});

test('rejects tampered and expired reset tokens', () => {
  const token = generatePractitionerPasswordResetToken(user, now);
  assert.equal(verifyPractitionerPasswordResetToken(`${token}x`, user, now), null);
  assert.equal(verifyPractitionerPasswordResetToken(token, user, now + 31 * 60_000), null);
});

