import test from "node:test"
import assert from "node:assert/strict"
import { formatClinicalDate } from "../lib/clinicalDate.js"

test("date-only clinical values do not shift to the previous day", () => {
  assert.equal(formatClinicalDate("2026-09-08"), "September 8, 2026")
})

test("clinical date formatting is stable for equivalent UTC values", () => {
  assert.equal(
    formatClinicalDate("2026-09-08T00:00:00.000Z"),
    "September 8, 2026",
  )
})

test("invalid clinical dates fail closed", () => {
  assert.equal(formatClinicalDate("not-a-date"), "")
})
