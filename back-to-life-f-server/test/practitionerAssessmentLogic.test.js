const test = require('node:test');
const assert = require('node:assert/strict');

require('ts-node/register');
const {
  normalizePractitionerAssessment,
  reconcilePractitionerScore,
} = require('../src/services/practitionerAssessmentLogic');

function blankAssessment() {
  return Object.fromEntries(
    ['neurological', 'mechanical', 'orthopedic', 'provocative', 'rom', 'functional', 'movement', 'strength', 'balance', 'stability', 'treatment']
      .map((key) => [key, { selected: false, score: '1', notes: '' }]),
  );
}

test('unchecked criteria contribute zero even if a stale UI score is present', () => {
  const result = normalizePractitionerAssessment(blankAssessment());
  assert.equal(result.totalPractitionerScore, 0);
  assert.equal(result.items.neurological.score, 0);
});

test('calculates and caps each detailed section at one point', () => {
  const body = blankAssessment();
  body.neurological = { selected: true, score: '1', notes: 'Resolved' };
  body.mechanical = { selected: true, score: '0.5', notes: '' };
  body.rom = { selected: true, score: '1', notes: '' };
  const result = normalizePractitionerAssessment(body);
  assert.equal(result.section1Score, 0.75);
  assert.equal(result.section2Score, 1);
  assert.equal(result.totalPractitionerScore, 1.8);
});

test('rejects out-of-range practitioner scores', () => {
  const body = blankAssessment();
  body.rom = { selected: true, score: '4', notes: '' };
  assert.throws(() => normalizePractitionerAssessment(body), /score must be/);
});

test('replaces the prior rounded contribution without stacking points', () => {
  assert.equal(reconcilePractitionerScore(8, 1.8, 0.5), 7);
  assert.equal(reconcilePractitionerScore(10, 0, 2), 11);
});
