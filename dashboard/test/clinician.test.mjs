import test from "node:test"
import assert from "node:assert/strict"
import { CLINICIAN } from "../src/config/clinician.js"

test("clinician-authored records use the configured Back to Life provider", () => {
  assert.deepEqual(CLINICIAN, {
    id: "dr-spencer-barber",
    name: "Dr. Spencer Barber",
    email: "spencerbarberchiro@gmail.com",
  })
  assert.equal(Object.isFrozen(CLINICIAN), true)
})
