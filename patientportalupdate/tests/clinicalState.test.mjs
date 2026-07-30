import test from "node:test"
import assert from "node:assert/strict"
import {
  clinicalRegionFromProfile,
  latestSrsRecord,
  normalizeClinicalProfile,
  phaseForSrs,
} from "../lib/clinicalState.js"

test("phase boundaries match the established SRS model", () => {
  assert.equal(phaseForSrs(0), "RESET")
  assert.equal(phaseForSrs(3), "RESET")
  assert.equal(phaseForSrs(4), "EDUCATE")
  assert.equal(phaseForSrs(7), "EDUCATE")
  assert.equal(phaseForSrs(8), "REBUILD")
  assert.equal(phaseForSrs(11), "REBUILD")
})

test("latest score does not depend on API sort order", () => {
  const older = { srsScore: 3, date: "2025-08-01T12:00:00.000Z" }
  const newer = { srsScore: 5, date: "2025-09-01T12:00:00.000Z" }

  assert.equal(latestSrsRecord([older, newer]), newer)
  assert.equal(latestSrsRecord([newer, older]), newer)
})

test("one verified snapshot supplies score, phase, region and timestamp", () => {
  const profile = normalizeClinicalProfile({
    name: "Test Patient",
    srsScores: [
      {
        srsScore: 5,
        region: "Neck",
        date: "2025-09-01T12:00:00.000Z",
      },
    ],
  })

  assert.equal(profile.score, 5)
  assert.equal(profile.srsScore, 5)
  assert.equal(profile.phase, "EDUCATE")
  assert.equal(profile.region, "Neck")
  assert.equal(profile.clinicalSnapshotUpdatedAt, "2025-09-01T12:00:00.000Z")
})

test("missing assessment is not converted into an SRS of zero", () => {
  const profile = normalizeClinicalProfile({ name: "New Patient", srsScores: [] })

  assert.equal(profile.score, null)
  assert.equal(profile.srsScore, null)
  assert.equal(profile.phase, null)
})

test("clinical region follows the verified assessment across response shapes", () => {
  assert.equal(clinicalRegionFromProfile({ region: "Neck" }), "Neck")
  assert.equal(clinicalRegionFromProfile({ patient: { region: "Neck" } }), "Neck")
  assert.equal(
    clinicalRegionFromProfile({
      patient: {
        srsScores: [
          { region: "Low Back", date: "2025-01-01" },
          { region: "Neck", date: "2025-02-01" },
        ],
      },
    }),
    "Neck"
  )
  assert.equal(clinicalRegionFromProfile({}), null)
})
