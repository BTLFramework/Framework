const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = (file) => fs.readFileSync(path.join(root, file), 'utf8');

test('patient setup tokens are opaque, hashed, expiring, and single-use', () => {
  const service = read('src/services/patientSetupToken.ts');
  assert.match(service, /randomBytes\(32\)\.toString\("base64url"\)/);
  assert.match(service, /createHash\("sha256"\)/);
  assert.match(service, /SETUP_TOKEN_LIFETIME_MS = 24 \* 60 \* 60 \* 1000/);
  assert.match(service, /usedAt:\s*null/);
  assert.match(service, /expiresAt:\s*\{\s*gt:\s*now\s*\}/);
  assert.match(service, /consumed\.count !== 1/);
});

test('intake links use the stored opaque token and the portal consumes it', () => {
  const intake = read('src/controllers/patientController.ts');
  const routes = read('src/routes/patientPortalRoutes2.ts');
  assert.match(intake, /await issuePatientSetupToken\(patient\.id\)/);
  assert.match(intake, /\/create-account\?token=/);
  assert.match(routes, /await verifyPatientSetupToken\(token\)/);
  assert.match(routes, /await consumePatientSetupToken\(/);
  assert.doesNotMatch(routes, /verifySetupToken/);
});
