import assert from "node:assert/strict";
import test from "node:test";

import { deriveExerciseFocus } from "../lib/exerciseFocus.js";

test("a clinician-assigned shoulder program displays Shoulder Focus for a neck assessment", () => {
  assert.deepEqual(
    deriveExerciseFocus("Neck", [
      { region: "Shoulder" },
      { region: "Shoulder" },
      { region: "Shoulder" },
    ]),
    {
      focusRegion: "Shoulder",
      differsFromAssessment: true,
    },
  );
});

test("an automatic same-region program keeps the assessment focus", () => {
  assert.deepEqual(
    deriveExerciseFocus("Neck", [{ region: "Neck" }, { region: "Neck" }]),
    {
      focusRegion: "Neck",
      differsFromAssessment: false,
    },
  );
});

test("mixed clinician assignments are labelled Mixed Focus", () => {
  assert.deepEqual(
    deriveExerciseFocus("Neck", [
      { region: "Shoulder" },
      { region: "Thoracic" },
    ]),
    {
      focusRegion: "Mixed",
      differsFromAssessment: false,
    },
  );
});
