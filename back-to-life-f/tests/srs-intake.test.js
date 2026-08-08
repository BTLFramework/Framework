import test from 'node:test';
import assert from 'node:assert/strict';
import { computeBaselineSRS, getPhaseByScore } from '../src/helpers/scoreLogic.js';
import { normalizeIntakeSubmissionResult } from '../src/helpers/intakeResult.js';

const highReadinessIntake = {
  vas: 2,
  disabilityPercentage: 10,
  psfs: [{ score: 8 }, { score: 7 }, { score: 8 }],
  confidence: 8,
  pcs4: { 1: 1, 2: 1, 3: 1, 4: 1 },
  tsk7: { 1: 1, 2: 4, 3: 1, 4: 1, 5: 1, 6: 4, 7: 4 },
  formType: 'Intake'
};

test('baseline SRS includes the PCS-4 domain used by the backend', () => {
  const result = computeBaselineSRS(highReadinessIntake);
  assert.equal(result.score, 8);
  assert.equal(result.maxScore, 11);
  assert.equal(result.phase, 'REBUILD');
});

test('an incomplete PCS-4 cannot silently earn its point', () => {
  const result = computeBaselineSRS({ ...highReadinessIntake, pcs4: { 1: 1 } });
  assert.equal(result.score, 7);
  assert.equal(result.phase, 'EDUCATE');
});

test('zero remains a valid clinical value rather than missing data', () => {
  const result = computeBaselineSRS({
    ...highReadinessIntake,
    vas: 0,
    disabilityPercentage: 0,
    confidence: 0,
    psfs: [{ score: 0 }, { score: 0 }, { score: 0 }]
  });

  assert.ok(result.breakdown.some(line => line.includes('Pain (VAS ≤2) (0)')));
  assert.ok(result.breakdown.some(line => line.includes('Disability (≤20%) (0%)')));
  assert.equal(Number.isFinite(result.score), true);
});

test('score 7 remains EDUCATE across phase helpers', () => {
  assert.equal(getPhaseByScore(7).label, 'EDUCATE');
});

test('the real backend response shape becomes portal-ready patient data', () => {
  const normalized = normalizeIntakeSubmissionResult({
    success: true,
    patient: { name: 'Beta Patient', email: 'beta@example.com' },
    srsScore: { srsScore: 5 },
    phase: 'EDUCATE',
    setupToken: 'signed-token',
    portalAccountExists: false
  });

  assert.equal(normalized.score, 5);
  assert.equal(normalized.portalPatientData.score, '5/11');
  assert.equal(normalized.portalPatientData.phase, 'EDUCATE');
  assert.equal(normalized.portalPatientData.setupToken, 'signed-token');
  assert.equal(normalized.portalPatientData.portalAccountExists, false);
});

test('an incomplete backend response fails closed', () => {
  assert.throws(
    () => normalizeIntakeSubmissionResult({ success: true }),
    /incomplete SRS result/
  );
});
