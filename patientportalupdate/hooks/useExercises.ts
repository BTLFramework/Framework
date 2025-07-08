import type { Exercise } from "@/types/exercise";

const exerciseLibrary: Exercise[] = [
  {
    id: "NECK_RESET_CHIN_TUCKS",
    region: "Neck",
    phase: "Reset",
    name: "Chin Tucks",
    focus: "Posture",
    description: "Gentle exercise to improve neck posture and reduce strain",
    duration: "2-3 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit or stand with your back straight",
      "Look straight ahead and keep your chin level",
      "Gently draw your chin back, creating a double chin",
      "Hold for 5 seconds",
      "Release and repeat 10 times"
    ],
    videoId: "chin-tucks",
    points: 5
  },
  {
    id: "NECK_RESET_ROTATION",
    region: "Neck",
    phase: "Reset",
    name: "Neck Rotation",
    focus: "Mobility",
    description: "Gentle neck rotation exercise to improve range of motion",
    duration: "2-3 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with good posture",
      "Slowly turn head to look over right shoulder",
      "Hold for 5 seconds",
      "Return to center",
      "Repeat on left side",
      "Do 10 repetitions each side"
    ],
    videoId: "neck-rotation",
    points: 5
  },
  {
    id: "NECK_RESET_SIDE_BEND",
    region: "Neck",
    phase: "Reset",
    name: "Neck Side Bend",
    focus: "Flexibility",
    description: "Gentle lateral neck stretch to reduce muscle tension",
    duration: "2-3 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with good posture",
      "Tilt head toward right shoulder",
      "Hold for 10 seconds",
      "Return to center",
      "Repeat on left side",
      "Do 5 repetitions each side"
    ],
    videoId: "neck-side-bend",
    points: 5
  },
  {
    id: "BACK_RESET_CAT_COW",
    region: "Back",
    phase: "Reset",
    name: "Cat-Cow Stretch",
    focus: "Mobility",
    description: "Gentle spinal mobility exercise to reduce stiffness",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    instructions: [
      "Start on hands and knees",
      "Inhale: Drop belly, lift chest and tailbone (Cow)",
      "Exhale: Round spine, tuck chin (Cat)",
      "Move slowly between positions",
      "Repeat 10-15 times"
    ],
    videoId: "cat-cow",
    points: 5
  },
  {
    id: "SHOULDER_EDUCATE_WALL_SLIDES",
    region: "Shoulder",
    phase: "Educate",
    name: "Wall Slides",
    focus: "Strength",
    description: "Exercise to improve shoulder blade control and posture",
    duration: "5-7 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with back against wall",
      "Bend elbows 90 degrees, touch wall",
      "Slide arms up while maintaining contact",
      "Lower slowly with control",
      "Repeat 12-15 times"
    ],
    videoId: "wall-slides",
    points: 8
  },
  {
    id: "BACK_REBUILD_BIRD_DOG",
    region: "Back",
    phase: "Rebuild",
    name: "Bird Dog Exercise",
    focus: "Stability",
    description: "Core and back stability exercise",
    duration: "8-10 minutes",
    difficulty: "Advanced",
    instructions: [
      "Start on hands and knees",
      "Extend opposite arm and leg",
      "Keep spine neutral, core engaged",
      "Hold for 5-10 seconds",
      "Repeat 10 times each side"
    ],
    videoId: "bird-dog",
    points: 10
  }
];

/**
 * Returns exercises filtered by region and phase.
 * @param {string} region Body region (e.g., "Neck", "Back", "Shoulder")
 * @param {string} phase "Reset" | "Educate" | "Rebuild"
 */
export function useExercises(region: string, phase: string): Exercise[] {
  return exerciseLibrary.filter((ex) => ex.region === region && ex.phase === phase);
} 