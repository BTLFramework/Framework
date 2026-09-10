const test = require('node:test');
const assert = require('node:assert/strict');
const { insightSequence } = require('../src/config/insightSequence');
const {
  calculateInsightStatus,
  getSequentialCompletedIds,
  isBetaInsightPreviewPatient
} = require('../src/services/insightProgression');

const atNoon = value => new Date(`${value}T12:00:00`);
const record = (id, date) => ({ action: `INSIGHT:${id}`, date: atNoon(date) });

test('beta insight preview is restricted to the dedicated beta account', () => {
  assert.equal(isBetaInsightPreviewPatient({ email: 'spencerbarberchiro+btlbeta2@gmail.com' }), true);
  assert.equal(isBetaInsightPreviewPatient({ email: 'SPENCERBARBERCHIRO+BTLBETA2@GMAIL.COM' }), true);
  assert.equal(isBetaInsightPreviewPatient({ email: 'patient@example.com' }), false);
  assert.equal(isBetaInsightPreviewPatient(null), false);
});

test('the curriculum contains seven weeks of unique daily lessons', () => {
  assert.equal(insightSequence.length, 49);
  assert.equal(new Set(insightSequence).size, 49);
  assert.deepEqual(insightSequence.slice(-7), [65, 66, 67, 68, 69, 70, 71]);
});

test('non-sequential records cannot skip a locked lesson', () => {
  assert.deepEqual(
    getSequentialCompletedIds([record(insightSequence[1], '2026-08-01')]),
    []
  );
});

test('a new patient can open only the first lesson', () => {
  const status = calculateInsightStatus({
    records: [],
    enrollmentDate: atNoon('2026-08-08'),
    now: atNoon('2026-08-08')
  });

  assert.equal(status.availableInsightId, insightSequence[0]);
  assert.equal(status.completedToday, false);
});

test('completing today blocks another lesson until tomorrow', () => {
  const status = calculateInsightStatus({
    records: [record(insightSequence[0], '2026-08-08')],
    enrollmentDate: atNoon('2026-08-01'),
    now: atNoon('2026-08-08')
  });

  assert.equal(status.availableInsightId, null);
  assert.equal(status.nextInsightId, insightSequence[1]);
  assert.equal(status.completedToday, true);
});

test('a missed patient catches up sequentially one lesson per day', () => {
  const status = calculateInsightStatus({
    records: [record(insightSequence[0], '2026-08-02')],
    enrollmentDate: atNoon('2026-08-01'),
    now: atNoon('2026-08-08')
  });

  assert.equal(status.availableInsightId, insightSequence[1]);
  assert.deepEqual(status.completedInsightIds, [insightSequence[0]]);
});

test('the next lesson does not unlock at UTC midnight before Edmonton midnight', () => {
  const completion = new Date('2026-09-10T04:30:00.000Z'); // Sep 9 at 10:30 PM in Edmonton
  const beforeLocalMidnight = calculateInsightStatus({
    records: [{ action: `INSIGHT:${insightSequence[0]}`, date: completion }],
    enrollmentDate: new Date('2026-09-08T00:00:00.000Z'),
    now: new Date('2026-09-10T05:30:00.000Z'), // Sep 9 at 11:30 PM in Edmonton
  });
  assert.equal(beforeLocalMidnight.completedToday, true);
  assert.equal(beforeLocalMidnight.availableInsightId, null);

  const afterLocalMidnight = calculateInsightStatus({
    records: [{ action: `INSIGHT:${insightSequence[0]}`, date: completion }],
    enrollmentDate: new Date('2026-09-08T00:00:00.000Z'),
    now: new Date('2026-09-10T06:01:00.000Z'), // Sep 10 at 12:01 AM in Edmonton
  });
  assert.equal(afterLocalMidnight.completedToday, false);
  assert.equal(afterLocalMidnight.availableInsightId, insightSequence[1]);
});
