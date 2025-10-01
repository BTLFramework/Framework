// Exercise Configuration for Backend
// This ensures exercises are properly assigned with correct point values

exports.exercises = [
  // ---------- NECK EXERCISES ----------
  
  // RESET Phase (SRS 0-3) - Total 10 points for 3 exercises
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
    id: "NECK_RESET_PRONE_ANCHORED_BACK_EXTENSION_LIFT",
    region: "Neck",
    phase: "Reset",
    name: "Prone anchored back-extension lift",
    focus: "cervical extension",
    description: "Gentle cervical extension with thoracic support",
    duration: "5-8 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Lie face down with forehead on towel",
      "Place hands under shoulders",
      "Lift head and chest slightly",
      "Hold for 3-5 seconds, repeat 8-10 times"
    ],
    videoId: "prone-anchored-back-extension",
    points: 4
  },
  {
    id: "NECK_RESET_8_POINT_PLANK_CHIN_NOD",
    region: "Neck",
    phase: "Reset",
    name: "8-point plank + chin nod",
    focus: "cervical stability",
    description: "Plank with gentle chin tuck movement",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Hold plank position on forearms",
      "Keep body in straight line",
      "Gently nod chin toward chest",
      "Hold for 2-3 seconds, repeat 10 times"
    ],
    videoId: "8-point-plank-chin-nod",
    points: 5
  },

  // EDUCATE Phase (SRS 4-7) - Total 19 points for 3 exercises (will be optimized to 10)
  {
    id: "NECK_EDUCATE_ISO_WALL_LEAN_MARCH",
    region: "Neck",
    phase: "Educate",
    name: "Iso Wall Lean with Marching",
    focus: "upright stack, anti-rotation, cervical control",
    description: "Train stack and anti-rotation while maintaining long neck.",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand facing wall, palms light at shoulder height; step back 6–8 inches and lean slightly.",
      "Ribs stacked over pelvis, neck long; inhale wide, exhale tall.",
      "Lift one knee slowly without twisting; press hands gently into wall.",
      "Avoid rib flare, shrugging, or shifting toward lifted leg."
    ],
    videoId: "neck-iso-wall-lean-march",
    points: 3
  },
  {
    id: "NECK_EDUCATE_8_POINT_PLANK_CHIN_NOD",
    region: "Neck",
    phase: "Educate",
    name: "8-Point Plank + Chin Nod",
    focus: "closed-chain cervical control under light load",
    description: "Build cervical control with stacked breathing in an 8-point plank.",
    duration: "4-6 minutes",
    difficulty: "Beginner+",
    instructions: [
      "On hands, knees, forearms, and toes; spine long, ribs over pelvis.",
      "Push floor away to widen mid-back; inhale wide, exhale keep stack.",
      "Gentle chin nods while keeping neck long (not crunching).",
      "Avoid sagging through ribs, over‑tucking chin, or breath holding."
    ],
    videoId: "8-point-plank-chin-nod-educate",
    points: 4
  },
  {
    id: "NECK_EDUCATE_SCAP_CARS_LATERAL_FLEXION",
    region: "Neck",
    phase: "Educate",
    name: "Single‑Sided Scapular CARs with Lateral Flexion",
    focus: "scapula/neck dissociation, segmental control",
    description: "Improve scapular control while maintaining tall neck and gentle lateral flexion.",
    duration: "4-6 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Sit or stand tall; one arm relaxed at side; chin gently tucked.",
      "Move shoulder in a slow circle — up, forward, down, back.",
      "Keep neck tall; gently tilt away from moving side; smooth motion.",
      "Avoid jerky movements, trunk side‑bending, or rib lift."
    ],
    videoId: "scapular-cars-lateral-flexion",
    points: 3
  },

  // REBUILD Phase (SRS 8-11) - Total 27 points for 3 exercises (will be optimized to 10)
  {
    id: "NECK_REBUILD_KB_FRONT_RACK_MARCH",
    region: "Neck",
    phase: "Rebuild",
    name: "KB front-rack march",
    focus: "cervical stability under load",
    description: "Kettlebell front rack position with marching",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold kettlebell in front rack position",
      "Keep head and neck in neutral position",
      "March in place or walk forward",
      "Maintain upright posture throughout"
    ],
    videoId: "kb-front-rack-march",
    points: 3
  },
  {
    id: "NECK_REBUILD_ANCHORED_IR_WALL_PRESS",
    region: "Neck",
    phase: "Rebuild",
    name: "Anchored IR wall press",
    focus: "internal rotation strength",
    description: "Internal rotation press against wall",
    duration: "10-15 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand sideways to wall",
      "Elbow bent at 90 degrees",
      "Press forearm into wall with internal rotation",
      "Hold for 5 seconds, repeat 12-15 times"
    ],
    videoId: "anchored-ir-wall-press",
    points: 4
  },
  {
    id: "NECK_REBUILD_CROSS_BODY_LOADED_CARRY",
    region: "Neck",
    phase: "Rebuild",
    name: "Cross-body loaded carry",
    focus: "anti-rotation stability",
    description: "Loaded carry with anti-rotation challenge",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight in one hand",
      "Walk forward while maintaining posture",
      "Resist rotation to the weighted side",
      "Keep head and neck stable"
    ],
    videoId: "cross-body-loaded-carry",
    points: 3
  },

  // ---------- BACK EXERCISES ----------
  
  // RESET Phase
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
    points: 3
  },

  // EDUCATE Phase
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
    points: 3
  },
  {
    id: "BACK_EDUCATE_SINGLE_LEG_ANCHORED_BREATH",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Single-leg anchored breath",
    focus: "single leg stability",
    description: "Breathing exercise with single leg stance",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand on one leg",
      "Place hands on lower ribs",
      "Breathe deeply while maintaining balance",
      "Switch legs and repeat"
    ],
    videoId: "single-leg-anchored-breath",
    points: 4
  },
  {
    id: "BACK_EDUCATE_WEIGHTED_BRIDGE_DECOMPRESSION",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Weighted bridge + decompression",
    focus: "glute strength with breathing",
    description: "Bridge exercise with weight and decompression breathing",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Lie on back with weight on hips",
      "Breathe out and lift hips",
      "Hold bridge position",
      "Breathe in and lower with control"
    ],
    videoId: "weighted-bridge-decompression",
    points: 3
  },

  // REBUILD Phase
  {
    id: "BACK_REBUILD_LOADED_FOUNDATION_SQUAT",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Loaded Foundation squat",
    focus: "squat technique",
    description: "Squat with light load and proper form",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Hold weight at chest level",
      "Squat down, keeping chest up",
      "Return to standing with control"
    ],
    videoId: "loaded-foundation-squat",
    points: 3
  },
  {
    id: "BACK_REBUILD_SINGLE_LEG_DEADLIFT",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Single-leg deadlift",
    focus: "single leg stability",
    description: "Single leg deadlift with proper form",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand on one leg",
      "Hinge at hips, reach forward",
      "Keep back straight throughout",
      "Return to standing with control"
    ],
    videoId: "single-leg-deadlift",
    points: 4
  },
  {
    id: "BACK_REBUILD_LOADED_CARRY",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Loaded carry",
    focus: "core stability",
    description: "Carry weight while maintaining posture",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight in both hands",
      "Walk forward with good posture",
      "Keep core engaged throughout",
      "Maintain neutral spine position"
    ],
    videoId: "loaded-carry",
    points: 3
  },

  // ---------- THORACIC / MID-BACK EXERCISES ----------
  
  // RESET Phase (Thoracic)
  {
    id: "THORACIC_RESET_SUPINE_DECOMPRESSION_BREATHING",
    region: "Mid-Back / Thoracic",
    phase: "Reset",
    name: "Supine Decompression Breathing",
    focus: "posterior rib expansion",
    description: "Foundational breath control with posterior rib expansion",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on your back with knees bent and feet flat",
      "Bring toes together and heels apart",
      "Place hands lightly on your lower ribs",
      "Inhale through the nose 'into your jacket pockets'",
      "Exhale gently through pursed lips"
    ],
    videoId: "supine-decompression-breathing",
    points: 3
  },
  {
    id: "THORACIC_RESET_PRONE_DECOMPRESSION_BREATHING",
    region: "Mid-Back / Thoracic",
    phase: "Reset",
    name: "Prone Decompression Breathing",
    focus: "tactile posterior rib opening",
    description: "Tactile posterior rib opening with scapular depression reset",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie facedown with forehead supported",
      "Arms extended overhead, palms together",
      "Inhale into your mid-back, feeling space under shoulder blades",
      "Exhale fully, letting ribs settle into the mat"
    ],
    videoId: "prone-decompression-breathing",
    points: 3
  },
  {
    id: "THORACIC_RESET_WALL_ANGEL_DECOMPRESSION",
    region: "Mid-Back / Thoracic",
    phase: "Reset",
    name: "Wall Angel + Decompression Breathing",
    focus: "scapular mobility",
    description: "Sync breath with scapular mobility and thoracic alignment",
    duration: "8-12 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand with head, shoulder blades, and tailbone against wall",
      "Feet ~6\" away from wall",
      "Inhale as you slide arms from 'W' into 'Y'",
      "Exhale as you lower arms, keeping ribs glued to wall"
    ],
    videoId: "wall-angel-decompression",
    points: 4
  },

  // EDUCATE Phase (Thoracic)
  {
    id: "THORACIC_EDUCATE_SPINAL_CARS",
    region: "Mid-Back / Thoracic",
    phase: "Educate",
    name: "Spinal CARs",
    focus: "segmental awareness + rotation control",
    description: "Restore segmental control through slow, smooth CARs.",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Seated or kneeling, hands across chest; spine tall, ribs stacked.",
      "Move slowly — round, rotate, side bend, extend; keep pelvis stable.",
      "Breathe as you move; avoid forcing range or rushing."
    ],
    videoId: "thoracic-spinal-cars",
    points: 3
  },
  {
    id: "THORACIC_EDUCATE_HALF_KNEELING_CROSS_REACH",
    region: "Mid-Back / Thoracic",
    phase: "Educate",
    name: "Half-Kneeling Cross-Reach",
    focus: "transverse-plane thoracic rotation",
    description: "Integrate transverse-plane thoracic rotation with trunk stability",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Half-kneel (front foot flat, back knee down)",
      "Reach opposite arm across midline and then up",
      "Rotate through your ribs, not your hips",
      "Return under control, breathing throughout"
    ],
    videoId: "half-kneeling-cross-reach",
    points: 4
  },
  {
    id: "THORACIC_EDUCATE_ANCHORED_WALL_GLIDE",
    region: "Mid-Back / Thoracic",
    phase: "Educate",
    name: "Anchored Thoracic Wall Glide",
    focus: "upright extension + posterior expansion",
    description: "Teach upright extension with posterior expansion.",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand with hands at wall, elbows slightly bent; ribs over pelvis.",
      "Inhale into mid-back; exhale tall as shoulder blades glide down.",
      "Stay long; avoid arching and rib flare."
    ],
    videoId: "anchored-thoracic-wall-glide",
    points: 4
  },
  {
    id: "THORACIC_EDUCATE_SINGLE_ARM_YTWS",
    region: "Mid-Back / Thoracic",
    phase: "Educate",
    name: "Single-Arm YTWs",
    focus: "scapular control + postural awareness",
    description: "Pattern Y, T, W with controlled scapular motion.",
    duration: "4-6 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Chest supported on bench or in prone; one arm moves through Y, T, W.",
      "Reach long, then draw shoulder blade down; smooth movement.",
      "Keep ribs heavy; avoid shrugging or over-arching."
    ],
    videoId: "thoracic-single-arm-ytw",
    points: 3
  },

  // REBUILD Phase (Thoracic)
  {
    id: "THORACIC_REBUILD_PRONE_T_ISOMETRIC",
    region: "Mid-Back / Thoracic",
    phase: "Rebuild",
    name: "Prone T Isometric Hold",
    focus: "thoracic extensor endurance",
    description: "Build thoracic extensor endurance and scapular stability",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Lie prone in a 'T' with arms at shoulder height",
      "Gently squeeze shoulder blades down and back",
      "Don't lift chest off ground",
      "Hold and breathe normally"
    ],
    videoId: "prone-t-isometric",
    points: 3
  },
  {
    id: "THORACIC_REBUILD_WEIGHTED_CARRIES_TALL_SPINE",
    region: "Mid-Back / Thoracic",
    phase: "Rebuild",
    name: "Weighted Carries with Tall Spine",
    focus: "thoracic control under load",
    description: "Challenge thoracic control under load and reinforce upright posture",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold dumbbells by your sides (farmer's or suitcase style)",
      "Walk tall: head over hips, ribs down, shoulders back",
      "Imagine a string pulling your head up",
      "Brace low belly—don't flare ribs"
    ],
    videoId: "weighted-carries-tall-spine",
    points: 4
  },
  {
    id: "THORACIC_REBUILD_SINGLE_ARM_ROW_REACH",
    region: "Mid-Back / Thoracic",
    phase: "Rebuild",
    name: "Single-Arm Row with Controlled Reach",
    focus: "eccentric scapular control",
    description: "Develop eccentric scapular control and thoracic stability under dynamic load",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Anchor a band or cable at waist height",
      "Row back with one arm",
      "Slowly reach forward on the eccentric",
      "Let scapula glide, maintain core and rib stacking"
    ],
    videoId: "single-arm-row-reach",
    points: 4
  }
]; 