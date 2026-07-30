export function deriveExerciseFocus(assessmentRegion, exercises = []) {
  const assignedRegions = [
    ...new Set(
      exercises
        .map((exercise) => exercise?.region?.trim())
        .filter(Boolean),
    ),
  ];

  const focusRegion =
    assignedRegions.length === 1
      ? assignedRegions[0]
      : assignedRegions.length > 1
        ? "Mixed"
        : assessmentRegion || "General";

  return {
    focusRegion,
    differsFromAssessment:
      assignedRegions.length === 1 &&
      Boolean(assessmentRegion) &&
      focusRegion.toLowerCase() !== assessmentRegion.toLowerCase(),
  };
}
