export function reconcileBooleanSrsComponents(
  currentScore: number,
  previousValues: boolean[],
  nextValues: boolean[],
) {
  const previousPoints = previousValues.filter(Boolean).length;
  const nextPoints = nextValues.filter(Boolean).length;
  return Math.max(0, Math.min(11, currentScore - previousPoints + nextPoints));
}

export function createTreatmentPlanPayload(plan: unknown, exercises: unknown) {
  const summary = typeof plan === 'string' ? plan.trim() : '';
  const hasExerciseUpdate = Array.isArray(exercises);
  if (!summary && !hasExerciseUpdate) return null;
  return hasExerciseUpdate
    ? JSON.stringify({ summary, assignedExercises: exercises, updatedAt: new Date().toISOString() })
    : summary;
}
