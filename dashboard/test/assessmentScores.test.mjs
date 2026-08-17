import test from "node:test"
import assert from "node:assert/strict"
import { calculatePCS4Score, calculateTSK7Score, pluralizeDay } from "../src/helpers/assessmentScores.js"

test("PCS-4 uses its documented 0-16 range", () => {
  assert.equal(calculatePCS4Score({ 1: 1, 2: 0, 3: 2, 4: 1 }), 4)
})

test("TSK-7 reverse scores items 2, 6 and 7 on a 1-4 scale", () => {
  const responses = { 1: 1, 2: 4, 3: 1, 4: 1, 5: 1, 6: 4, 7: 4 }
  assert.equal(calculateTSK7Score(responses), 7)
  assert.equal(calculateTSK7Score({ tsk1: 1, tsk2: 4, tsk3: 1, tsk4: 1, tsk5: 1, tsk6: 4, tsk7: 4 }), 7)
})

test("incomplete TSK-7 data remains unavailable", () => {
  assert.equal(calculateTSK7Score({ 1: 1 }), null)
})

test("day label is grammatically correct", () => {
  assert.equal(pluralizeDay(1), "1 day")
  assert.equal(pluralizeDay(2), "2 days")
})
