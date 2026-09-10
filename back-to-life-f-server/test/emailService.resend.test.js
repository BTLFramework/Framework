const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register/transpile-only');

const { sendWelcomeEmail, sendPractitionerPasswordResetEmail } = require('../src/services/emailService');

const originalEnv = { ...process.env };
const originalFetch = global.fetch;

test.afterEach(() => {
  process.env = { ...originalEnv };
  global.fetch = originalFetch;
});

test('sends the rendered welcome email through the Resend HTTPS API', async () => {
  process.env.EMAIL_PROVIDER = 'resend';
  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'Back to Life <welcome@example.com>';

  global.fetch = async (url, options) => {
    assert.equal(url, 'https://api.resend.com/emails');
    assert.equal(options.method, 'POST');
    assert.equal(options.headers.Authorization, 'Bearer test-key');

    const payload = JSON.parse(options.body);
    assert.deepEqual(payload.to, ['patient@example.com']);
    assert.match(payload.subject, /RESET/);
    assert.match(payload.text, /Beta/);
    assert.match(payload.text, /https:\/\/framework-six-umber\.vercel\.app\/setup\?token=test/);

    return { ok: true, status: 200, text: async () => '' };
  };

  const sent = await sendWelcomeEmail({
    firstName: 'Beta',
    email: 'patient@example.com',
    phase: 'RESET',
    setupLink: 'https://framework-six-umber.vercel.app/setup?token=test',
  });

  assert.equal(sent, true);
});

test('fails fast when Resend credentials are absent', async () => {
  process.env.EMAIL_PROVIDER = 'resend';
  delete process.env.RESEND_API_KEY;
  delete process.env.EMAIL_FROM;

  let fetchCalled = false;
  global.fetch = async () => {
    fetchCalled = true;
    throw new Error('fetch should not be called');
  };

  const sent = await sendWelcomeEmail({
    firstName: 'Beta',
    email: 'patient@example.com',
    phase: 'RESET',
    setupLink: 'https://framework-six-umber.vercel.app/setup?token=test',
  });

  assert.equal(sent, false);
  assert.equal(fetchCalled, false);
});

test('sends a clinician password reset link without exposing it in the subject', async () => {
  process.env.EMAIL_PROVIDER = 'resend';
  process.env.RESEND_API_KEY = 'test-key';
  process.env.EMAIL_FROM = 'Back to Life <welcome@example.com>';
  const resetLink = 'https://dashboard-three-taupe-47.vercel.app/reset-password?token=signed-token';

  global.fetch = async (_url, options) => {
    const payload = JSON.parse(options.body);
    assert.deepEqual(payload.to, ['clinician@example.com']);
    assert.equal(payload.subject, 'Reset your Back to Life clinician password');
    assert.doesNotMatch(payload.subject, /signed-token/);
    assert.match(payload.text, /signed-token/);
    return { ok: true, status: 200, text: async () => '' };
  };

  assert.equal(
    await sendPractitionerPasswordResetEmail('clinician@example.com', resetLink),
    true
  );
});
