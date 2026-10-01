const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('patient password recovery is rate limited, non-enumerating, and uses one-time setup tokens', () => {
  const routes = read('src/routes/patientPortalRoutes2.ts');
  assert.match(routes, /router\.post\('\/request-password-reset', passwordResetRateLimit/);
  assert.match(routes, /If that patient account exists, a password reset link has been emailed/);
  assert.match(routes, /await issuePatientSetupToken\(patientPortal\.patientId\)/);
  assert.match(routes, /await sendPatientPasswordResetEmail\(patientPortal\.email, resetLink\)/);
  assert.match(routes, /encodeURIComponent\(token\)/);
});

test('patient recovery email identifies its purpose and expiry without exposing a password', () => {
  const emailService = read('src/services/emailService.ts');
  assert.match(emailService, /Reset your Back to Life patient password/);
  assert.match(emailService, /This link expires in 24 hours and can only be used once/);
  assert.doesNotMatch(emailService, /Your temporary password is/);
});

test('the mobile login offers recovery through the unauthenticated patient endpoint', () => {
  const login = read('../framework-mobile/app/login.tsx');
  const api = read('../framework-mobile/services/patientApi.ts');
  assert.match(login, /Forgot password\?/);
  assert.match(api, /\/api\/patient-portal\/request-password-reset/);
  assert.match(api, /false,\s*\);/);
});
