export const exercises = [
  // ---------- RESET (SRS 0-3) ----------
  {
    id: "NECK_RESET_SUPINE_DECOMPRESSION_BREATHING",
    region: "Neck",
    phase: "Reset",
    name: "Supine decompression breathing",
    focus: "breathing",
    description: "Gentle breathing exercise to reduce cervical tension",
    duration: "5-10 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent",
      "Place one hand on chest, one on belly",
      "Breathe slowly, expanding your ribcage",
      "Focus on relaxing neck and shoulders"
    ],
    videoId: "neck-decomp-breathing",
    points: 3
  },
  {
    id: "NECK_RESET_WALL_PRESS_CHIN_TUCK",
    region: "Neck",
    phase: "Reset",
    name: "Wall-press chin tuck",
    focus: "deep neck flexor",
    description: "Improve cervical posture and reduce forward head position",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand with back against wall",
      "Press back of head gently into wall",
      "Hold for 5 seconds, repeat 10 times",
      "Keep shoulders relaxed"
    ],
    videoId: "wall-chin-tuck",
    points: 3
  },
  {
    id: "NECK_RESET_PRONE_T_ISOMETRIC",
    region: "Neck",
    phase: "Reset",
    name: "Prone T isometric",
    focus: "upper back activation",
    description: "Strengthen upper back and improve thoracic extension",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie face down with arms in T position",
      "Lift arms and chest slightly off ground",
      "Hold for 5 seconds, repeat 8-10 times",
      "Keep neck in neutral position"
    ],
    videoId: "prone-t-isometric",
    points: 4
  },
  {
    id: "BACK_RESET_STANDING_DECOMPRESSION_BREATH",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Standing decompression breath",
    focus: "breathing",
    description: "Reduce spinal compression through mindful breathing",
    duration: "5-10 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand with feet hip-width apart",
      "Place hands on lower ribs",
      "Breathe deeply, expanding ribs outward",
      "Feel gentle lengthening through spine"
    ],
    videoId: "standing-decomp-breath",
    points: 3
  },
  {
    id: "BACK_RESET_SUPINE_ANCHORED_BREATHING",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Supine anchored breathing",
    focus: "core activation",
    description: "Activate deep core muscles with breathing pattern",
    duration: "8-12 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on back, knees bent, feet flat",
      "Place hands on lower ribs",
      "Breathe in, ribs expand outward",
      "Breathe out, gently draw ribs together"
    ],
    videoId: "supine-anchored-breathing",
    points: 4
  },
  {
    id: "BACK_RESET_ANCHORED_BRIDGE_HOLD",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Anchored bridge hold",
    focus: "glute activation",
    description: "Gentle glute activation with core stability",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on back, knees bent",
      "Breathe out, lift hips gently",
      "Hold for 5-10 seconds",
      "Lower slowly with control"
    ],
    videoId: "anchored-bridge-hold",
    points: 4
  },
  {
    id: "BACK_RESET_ANCHORED_BRIDGE_MARCH",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Anchored bridge march",
    focus: "glute/core stability",
    description: "Progress bridge exercise with alternating leg movement",
    duration: "8-12 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Start in bridge position",
      "Maintain hip height while lifting one knee",
      "Hold for 3 seconds, alternate legs",
      "Keep core engaged throughout"
    ],
    videoId: "anchored-bridge-march",
    points: 5
  },
  {
    id: "BACK_RESET_ANCHORED_BACK_EXTENSION_HOLD",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Anchored back-extension hold",
    focus: "back extension",
    description: "Gentle back extension with core control",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Lie face down, hands under forehead",
      "Breathe out, lift chest slightly",
      "Hold for 5-8 seconds",
      "Focus on upper back extension"
    ],
    videoId: "anchored-back-extension",
    points: 5
  },
  {
    id: "SHOULDER_RESET_BAND_TENSION_WALL_SLIDE",
    region: "Shoulder",
    phase: "Reset",
    name: "Band-tension wall slide",
    focus: "shoulder mobility",
    description: "Improve shoulder mobility and scapular control",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Stand with back to wall, arms in W position",
      "Hold light resistance band",
      "Slide arms up and down wall",
      "Maintain shoulder blade position"
    ],
    videoId: "band-tension-wall-slide",
    points: 4
  },
  {
    id: "HIP_RESET_TWO_FOOT_GLUTE_MED_WALL_LEAN",
    region: "Hip / Groin",
    phase: "Reset",
    name: "Two-foot glute-med wall lean",
    focus: "hip stability",
    description: "Activate hip stabilizers with wall support",
    duration: "5-8 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Stand sideways to wall, both feet planted",
      "Lean into wall with hip/shoulder",
      "Feel activation on outside of hip",
      "Hold for 10-15 seconds each side"
    ],
    videoId: "two-foot-glute-med-lean",
    points: 4
  },
  // ---------- EDUCATE (SRS 4-7) ----------
  {
    id: "BACK_EDUCATE_LOADED_FOUNDATION_HINGE",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Loaded Foundation hinge",
    focus: "hip hinge",
    description: "Practice hip hinge with light load",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet hip-width apart",
      "Hold light weight (5-10 lbs)",
      "Hinge at hips, keep back straight",
      "Return to standing with control"
    ],
    videoId: "loaded-foundation-hinge",
    points: 7
  },
  {
    id: "SHOULDER_EDUCATE_D2_BANDED_REACH_IR_CUE",
    region: "Shoulder",
    phase: "Educate",
    name: "D2 banded reach + IR cue",
    focus: "shoulder function",
    description: "Reach diagonally with band, focus on internal rotation",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with band anchored low",
      "Reach diagonally across body",
      "Focus on internal rotation cue",
      "Control return movement"
    ],
    videoId: "d2-banded-reach-ir",
    points: 6
  },
  {
    id: "HIP_EDUCATE_SINGLE_LEG_GLUTE_MED_WALL_LEAN",
    region: "Hip / Groin",
    phase: "Educate",
    name: "Single-leg glute-med wall lean",
    focus: "hip stability",
    description: "Stand on one leg, lean into wall for hip activation",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand on one leg, sideways to wall",
      "Lean into wall with hip/shoulder",
      "Maintain balance and control",
      "Switch sides and repeat"
    ],
    videoId: "single-leg-glute-med-lean",
    points: 7
  },
  // ---------- REBUILD (SRS 8-11) ----------
  {
    id: "BACK_REBUILD_GORILLA_LIFT_BREATH_CADENCE",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Gorilla lift + breath cadence",
    focus: "lifting pattern",
    description: "Advanced lifting pattern with breathing coordination",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Use moderate weight (15-25 lbs)",
      "Perform deadlift with breathing pattern",
      "Inhale at top, exhale during lift",
      "Focus on power and control"
    ],
    videoId: "gorilla-lift-breath",
    points: 12
  },
  {
    id: "SHOULDER_REBUILD_KB_RACK_MARCH_BAND_IR_PULL",
    region: "Shoulder",
    phase: "Rebuild",
    name: "KB rack march + band IR pull",
    focus: "shoulder/core integration",
    description: "Complex movement combining stability and strength",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold kettlebell in rack position",
      "March in place while pulling band",
      "Maintain upright posture",
      "Focus on anti-rotation core work"
    ],
    videoId: "kb-rack-march-band",
    points: 12
  },
  {
    id: "HIP_REBUILD_WEIGHTED_FOUNDATION_SQUAT_IR",
    region: "Hip / Groin",
    phase: "Rebuild",
    name: "Weighted Foundation squat (IR)",
    focus: "squat technique",
    description: "Functional squatting with internal rotation emphasis",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight at chest level",
      "Squat with internal rotation cue",
      "Focus on knee alignment",
      "Power through heels to stand"
    ],
    videoId: "weighted-foundation-squat",
    points: 10
  }
]; 