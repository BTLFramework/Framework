import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const formSource = fs.readFileSync(new URL('../src/components/MultiStepForm.jsx', import.meta.url), 'utf8');
const consentSource = fs.readFileSync(new URL('../src/components/steps/Consent.jsx', import.meta.url), 'utf8');

test('intake consent starts unchecked and blocks the final step until both choices are accepted', () => {
  assert.match(formSource, /healthInformationConsentAccepted:\s*false/);
  assert.match(formSource, /electronicCommunicationsAccepted:\s*false/);
  assert.match(formSource, /healthInformationConsentAccepted === true/);
  assert.match(formSource, /electronicCommunicationsAccepted === true/);
});

test('the submitted audit payload carries the same version shown with the notice', () => {
  assert.match(consentSource, /CURRENT_PATIENT_CONSENT_VERSION = "2026-09-beta-v1"/);
  assert.match(formSource, /version:\s*CURRENT_PATIENT_CONSENT_VERSION/);
  assert.match(formSource, /consent:\s*\{/);
});
