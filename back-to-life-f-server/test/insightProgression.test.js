const test = require('node:test');
const assert = require('node:assert/strict');
const { insightSequence } = require('../src/config/insightSequence');
const {
  calculateInsightStatus,
  getSequentialCompletedIds
} = require('../src/services/insightProgression');

const atNoon = value => new Date(`${value}T12:00:00`);
const record = (id, date) => ({ action: `INSIGHT:${id}`, date: atNoon(date) });

test('the curriculum contains six weeks of unique daily lessons', () => {
  assert.equal(insightSequence.length, 42);
  assert.equal(new Set(insightSequence).size, 42);
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
