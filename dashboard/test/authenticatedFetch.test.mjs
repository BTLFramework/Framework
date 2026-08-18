import test from "node:test"
import assert from "node:assert/strict"
import { isPractitionerTokenValid } from "../src/api/authenticatedFetch.js"

const tokenFor = (payload) => {
  const encode = (value) => Buffer.from(JSON.stringify(value)).toString("base64url")
  return `${encode({ alg: "none", typ: "JWT" })}.${encode(payload)}.test-signature`
}

test("practitioner route guard accepts a current clinician login token", () => {
  assert.equal(isPractitionerTokenValid(tokenFor({ userId: 1, exp: 2_000 }), 1_000), true)
})

test("practitioner route guard rejects expired, patient and malformed tokens", () => {
  assert.equal(isPractitionerTokenValid(tokenFor({ userId: 1, exp: 999 }), 1_000), false)
  assert.equal(isPractitionerTokenValid(tokenFor({ patientId: 1, role: "patient", exp: 2_000 }), 1_000), false)
  assert.equal(isPractitionerTokenValid("not-a-token", 1_000), false)
  assert.equal(isPractitionerTokenValid(null, 1_000), false)
})
