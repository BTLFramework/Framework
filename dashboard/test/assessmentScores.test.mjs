import test from "node:test"
import assert from "node:assert/strict"
import { calculatePCS4Score, calculateTSK7Score, calendarDaysSince, formatClinicalDate, formatRelativeClinicalDate, parseClinicalDate, parseTreatmentPlan, pluralizeDay } from "../src/helpers/assessmentScores.js"

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

test("existing manual treatment plans retain their selected exercises", () => {
  const parsed = parseTreatmentPlan(JSON.stringify({ summary: "Shoulder plan", assignedExercises: ["a", "b"] }))
  assert.deepEqual(parsed, { summary: "Shoulder plan", assignedExercises: ["a", "b"] })
  assert.deepEqual(parseTreatmentPlan("Legacy plan"), { summary: "Legacy plan", assignedExercises: [] })
})

test("date-only clinical records do not shift to the previous day", () => {
  const parsed = parseClinicalDate("2026-08-16T00:00:00.000Z")
  assert.deepEqual(
    [parsed.getFullYear(), parsed.getMonth() + 1, parsed.getDate()],
    [2026, 8, 16],
  )
  assert.equal(calendarDaysSince("2026-08-16T00:00:00.000Z", new Date(2026, 7, 17, 23, 30)), 1)
  assert.equal(formatClinicalDate("2026-08-16T00:00:00.000Z", "en-CA"), "2026-08-16")
})

test("message dates use calendar days instead of elapsed 24-hour windows", () => {
  const now = new Date(2026, 7, 17, 0, 5)
  assert.equal(formatRelativeClinicalDate(new Date(2026, 7, 17, 0, 1), now), "Today")
  assert.equal(formatRelativeClinicalDate(new Date(2026, 7, 16, 23, 59), now), "Yesterday")
  assert.equal(formatRelativeClinicalDate(new Date(2026, 7, 14, 12), now), "3 days ago")
  assert.equal(formatRelativeClinicalDate(null, now), "Unavailable")
})
