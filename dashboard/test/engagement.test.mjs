import test from "node:test"
import assert from "node:assert/strict"
import { getEngagementStatus, isLowEngagement } from "../src/helpers/engagement.js"

const now = new Date(2026, 7, 30)
const establishedPatient = "2026-08-16T00:00:00.000Z"

test("moderate engagement is not counted as low engagement", () => {
  const points = { completionRate: 40, trend: "stable", streakDays: 0 }
  assert.equal(getEngagementStatus(points, establishedPatient, now), "moderate")
  assert.equal(isLowEngagement(points, establishedPatient, now), false)
})

test("engagement bands use the same thresholds throughout the dashboard", () => {
  assert.equal(getEngagementStatus({ completionRate: 39 }, establishedPatient, now), "low_engagement")
  assert.equal(getEngagementStatus({ completionRate: 60 }, establishedPatient, now), "engaged")
  assert.equal(getEngagementStatus({ completionRate: 80, streakDays: 5 }, establishedPatient, now), "highly_engaged")
})

test("new patients are not labelled low engagement", () => {
  const recentIntake = "2026-08-27T00:00:00.000Z"
  assert.equal(getEngagementStatus({ completionRate: 0 }, recentIntake, now), "new_patient")
  assert.equal(isLowEngagement({ completionRate: 0 }, recentIntake, now), false)
})
