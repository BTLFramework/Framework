import type { Exercise } from "@/types/exercise";

const mindfulnessExercises: Exercise[] = [
  {
    id: "MINDFULNESS_RESET_BREATHING",
    region: "Mindfulness",
    phase: "Reset",
    name: "Mindful Breathing",
    focus: "Breath awareness",
    description: "A gentle practice to develop breath awareness and reduce stress",
    duration: "5-10 minutes",
    difficulty: "Beginner",
    instructions: [
      "Find a comfortable seated position",
      "Close your eyes or maintain a soft gaze",
      "Focus on your natural breath without changing it",
      "Notice the sensation of breathing in your body",
      "When your mind wanders, gently return to the breath"
    ],
    videoId: "mindful-breathing",
    points: 5
  },
  {
    id: "MINDFULNESS_RESET_BODY_SCAN",
    region: "Mindfulness",
    phase: "Reset",
    name: "Body Scan",
    focus: "Body awareness",
    description: "Progressive relaxation through systematic body awareness",
    duration: "10-15 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie down in a comfortable position",
      "Bring attention to your feet and toes",
      "Slowly move awareness up through your body",
      "Notice any sensations without judgment",
      "Release tension as you scan each area"
    ],
    videoId: "body-scan",
    points: 8
  },
  {
    id: "MINDFULNESS_EDUCATE_FOCUSED_ATTENTION",
    region: "Mindfulness",
    phase: "Educate",
    name: "Focused Attention",
    focus: "Concentration",
    description: "Develop concentration through single-pointed focus",
    duration: "15-20 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Choose a single object of focus (breath, sound, etc.)",
      "Maintain attention on your chosen object",
      "Notice when attention wanders",
      "Label distractions as 'thinking' or 'feeling'",
      "Gently return focus to your chosen object"
    ],
    videoId: "focused-attention",
    points: 10
  },
  {
    id: "MINDFULNESS_REBUILD_OPEN_AWARENESS",
    region: "Mindfulness",
    phase: "Rebuild",
    name: "Open Awareness",
    focus: "Present moment awareness",
    description: "Cultivate spacious awareness of present moment experience",
    duration: "20-30 minutes",
    difficulty: "Advanced",
    instructions: [
      "Start with focused breathing for stability",
      "Expand awareness to include all sensations",
      "Notice thoughts and emotions as they arise",
      "Maintain a spacious, non-judgmental awareness",
      "Rest in natural presence without manipulation"
    ],
    videoId: "open-awareness",
    points: 15
  }
];

/**
 * Returns mindfulness exercises filtered by phase.
 * @param {string} phase "Reset" | "Educate" | "Rebuild"
 */
export function useMindfulnessExercises(phase: string): Exercise[] {
  return mindfulnessExercises.filter((ex) => ex.phase === phase);
} 