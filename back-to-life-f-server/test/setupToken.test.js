const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

process.env.SETUP_SECRET = 'beta-test-setup-secret';
const {
  generateSetupLink,
  generateSetupToken,
  verifySetupToken,
} = require('../src/services/jwtService');

test('setup tokens bind both the email and patient id', () => {
  const token = generateSetupToken('patient@example.com', 42);
  const payload = verifySetupToken(token);

  assert.equal(payload.email, 'patient@example.com');
  assert.equal(payload.patientId, 42);
  assert.equal(payload.type, 'setup');
});

test('setup links point to the real create-account route', () => {
  const link = generateSetupLink(
    'patient@example.com',
    42,
    'https://framework-six-umber.vercel.app'
  );

  assert.match(link, /^https:\/\/framework-six-umber\.vercel\.app\/create-account\?token=/);
  const token = new URL(link).searchParams.get('token');
  const payload = verifySetupToken(token);
  assert.equal(payload.patientId, 42);
});
