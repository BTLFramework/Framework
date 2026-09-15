const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const controllerSource = fs.readFileSync(
  path.join(__dirname, '../src/controllers/patientController.ts'),
  'utf8',
);

test('patient deletion removes non-cascading practitioner records first', () => {
  const practitionerDelete = controllerSource.indexOf('tx.practitionerAssessment.deleteMany');
  const scoreDelete = controllerSource.indexOf('tx.sRSScore.deleteMany', practitionerDelete);
  const portalDelete = controllerSource.indexOf('tx.patientPortal.deleteMany', scoreDelete);
  const patientDelete = controllerSource.indexOf('tx.patient.delete', portalDelete);

  assert.ok(practitionerDelete >= 0, 'practitioner assessments must be deleted explicitly');
  assert.ok(scoreDelete > practitionerDelete, 'SRS scores must be deleted after practitioner assessments');
  assert.ok(portalDelete > scoreDelete, 'portal account must be deleted before the patient');
  assert.ok(patientDelete > portalDelete, 'patient must be deleted last');
});
