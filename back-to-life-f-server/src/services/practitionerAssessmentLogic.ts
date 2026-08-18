export const SECTION_1_KEYS = ['neurological', 'mechanical', 'orthopedic', 'provocative'] as const;
export const SECTION_2_KEYS = ['rom', 'functional', 'movement', 'strength', 'balance', 'stability', 'treatment'] as const;

type AssessmentItem = { selected: boolean; score: number; notes: string };

export function normalizeAssessmentItem(value: unknown, label: string): AssessmentItem {
  if (!value || typeof value !== 'object') throw new Error(`${label} assessment is required`);
  const item = value as Record<string, unknown>;
  const selected = item.selected === true;
  const score = selected ? Number(item.score) : 0;
  if (!Number.isFinite(score) || ![0, 0.5, 1].includes(score)) {
    throw new Error(`${label} score must be 0, 0.5, or 1`);
  }
  return {
    selected,
    score,
    notes: typeof item.notes === 'string' ? item.notes.trim() : '',
  };
}

export function calculateAssessmentSection(items: AssessmentItem[]): number {
  const selected = items.filter((item) => item.selected);
  if (selected.length === 0) return 0;
  return Math.min(1, selected.reduce((sum, item) => sum + item.score, 0) / selected.length);
}

export function normalizePractitionerAssessment(body: Record<string, unknown>) {
  const items = Object.fromEntries(
    [...SECTION_1_KEYS, ...SECTION_2_KEYS].map((key) => [key, normalizeAssessmentItem(body[key], key)]),
  ) as Record<string, AssessmentItem>;
  const section1Score = calculateAssessmentSection(SECTION_1_KEYS.map((key) => items[key]));
  const section2Score = calculateAssessmentSection(SECTION_2_KEYS.map((key) => items[key]));
  return {
    items,
    section1Score,
    section2Score,
    totalPractitionerScore: Math.round((section1Score + section2Score) * 10) / 10,
  };
}

export function reconcilePractitionerScore(currentScore: number, previousScore: number, nextScore: number) {
  const previousPoints = Math.round(previousScore);
  const nextPoints = Math.round(nextScore);
  return Math.max(0, Math.min(11, currentScore - previousPoints + nextPoints));
}
