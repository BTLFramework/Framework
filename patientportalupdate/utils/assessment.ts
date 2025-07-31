// utils/assessment.ts

export type Mood = 'positive' | 'neutral' | 'negative' | 'distressed';

// Now supports 0-6 pain scale for emoji row
export interface AssessmentInput {
  pain: 0 | 1 | 2 | 3 | 4 | 5 | 6;    // 0-6 scale
  stress: 0 | 1 | 2 | 3;
  mood: Mood;
}

// Adjusted logic: pain (0-6) + stress (0-3) + mood weight (0-3) = 0-12
export function classifyTier({ pain, stress, mood }: AssessmentInput): 1 | 2 | 3 | 4 {
  const score = pain + stress; // 0-9
  const moodWeight = { positive: 0, neutral: 1, negative: 2, distressed: 3 }[mood];
  const total = score + moodWeight; // 0-12
  if (total <= 2) return 1;
  if (total <= 5) return 2;
  if (total <= 8) return 3;
  return 4;
} 