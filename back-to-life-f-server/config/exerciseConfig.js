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
    id: "BACK_REBUILD_SINGLE_LEG_HINGE",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Single‑Leg Hinge",
    focus: "single‑leg balance and hinge control",
    description: "Hinge on one leg with long spine; opposite leg extends behind.",
    duration: "6-8 reps/side",
    difficulty: "Advanced",
    instructions: [
      "Stand tall, ribs over hips; shift weight to one leg and hinge hips back.",
      "Keep spine long; extend opposite leg; inhale ribs wide, exhale return tall.",
      "Perform 6–8 controlled reps per side."
    ],
    videoId: "single-leg-hinge",
    points: 4
  },
  {
    id: "BACK_REBUILD_WIDE_LEG_FOUNDER",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Wide‑Leg Founder",
    focus: "hip stability in wide stance",
    description: "Wide‑stance founder emphasizing long spine and rib control.",
    duration: "20-30 seconds (holds)",
    difficulty: "Advanced",
    instructions: [
      "Feet wide, toes forward; hinge hips back and reach arms long.",
      "Keep ribs down, spine long; breathe into ribs and hold 20–30s; 2–3 sets."
    ],
    videoId: "wide-leg-founder",
    points: 3
  },
  {
    id: "BACK_REBUILD_GORILLA_LIFT",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Gorilla Lift",
    focus: "hip hinge power with rib stacking",
    description: "Controlled hinge with hands on thighs or weights; lift tall with breath.",
    duration: "6-10 reps",
    difficulty: "Advanced",
    instructions: [
      "Feet hip‑width; hinge hips back with hands on thighs or weights.",
      "Inhale ribs wide; exhale to lift tall; move with breath; controlled tempo."
    ],
    videoId: "gorilla-lift",
    points: 3
  },
  {
    id: "BACK_REBUILD_FARMERS_CARRY_GRIP",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Farmer’s Carry (Grip Focus)",
    focus: "posture + grip endurance",
    description: "Walk tall with weights at sides; focus on grip and posture.",
    duration: "20-30 seconds x 3-4 rounds",
    difficulty: "Advanced",
    instructions: [
      "Hold weights at sides; stand tall, ribs over hips; walk slow and steady.",
      "Focus on grip and posture; maintain stacked position."
    ],
    videoId: "farmers-carry-grip",
    points: 3
  },

  // ---------- SI JOINT FOCUSED EXERCISES (within Low Back / SI Joint region) ----------
  // RESET (awareness + integrated adduction)
  {
    id: "SIJ_RESET_SUPINE_DECOMP_INNER_LINE",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Supine Decompression w/ Inner‑Line Cue",
    focus: "breathing + adductor synergy",
    description: "Supine decompression with gentle inner‑thigh draw to engage deep core.",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on back, knees bent, feet flat; inhale to expand ribs.",
      "Exhale while softly drawing thighs toward each other to feel adductors/core.",
      "Maintain neutral spine and calm breath."
    ],
    videoId: "sij-supine-decomp-inner-line",
    points: 3
  },
  {
    id: "SIJ_RESET_STANDING_DECOMP_FLOOR_TENSION",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Standing Decompression w/ Floor‑Tension Cue",
    focus: "breathing + ground tension",
    description: "Create light floor tension to co‑activate adductors and glutes while stacked.",
    duration: "3-5 minutes",
    difficulty: "Beginner",
    instructions: [
      "Stand tall, feet hip‑width, knees soft; inhale ribs wide.",
      "Exhale and gently \"pull the floor together\" with feet; stay tall through crown.",
      "Keep ribs stacked over pelvis."
    ],
    videoId: "sij-standing-decomp-floor-tension",
    points: 3
  },
  {
    id: "SIJ_RESET_SINGLE_LEG_WALL_LEAN",
    region: "Low Back / SI Joint",
    phase: "Reset",
    name: "Single‑Leg Wall Lean",
    focus: "glute med + adductor co‑activation",
    description: "Light wall press to co‑activate lateral hip and inner line.",
    duration: "10-15 seconds x 2-3/side",
    difficulty: "Beginner",
    instructions: [
      "Stand beside wall; press outer knee/foot gently into wall.",
      "Ribs stacked, pelvis level, steady breath; hold 10–15s, 2–3 rounds/side."
    ],
    videoId: "sij-single-leg-wall-lean",
    points: 4
  },

  // EDUCATE (skill + single‑limb control)
  {
    id: "SIJ_EDUCATE_FOUNDER",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Founder",
    focus: "hip hinge endurance with inner‑line tension",
    description: "Static hinge with light adductor engagement and ribs down.",
    duration: "20-30 seconds (holds)",
    difficulty: "Beginner+",
    instructions: [
      "Hinge hips back, reach arms forward, ribs down; maintain inner‑thigh tension.",
      "Inhale to expand ribs, exhale to stay long; 20–30s, 2–3 sets."
    ],
    videoId: "sij-founder",
    points: 3
  },
  {
    id: "SIJ_EDUCATE_SINGLE_LEG_HINGE",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Single‑Leg Hinge",
    focus: "single‑limb hinge skill",
    description: "Balance on one leg; hinge hips back with long spine and level pelvis.",
    duration: "6-8 reps/side",
    difficulty: "Beginner+",
    instructions: [
      "Keep pelvis level, ribs stacked, light bend in stance knee.",
      "Feel stance glute + adductor; 6–8 reps/side."
    ],
    videoId: "sij-single-leg-hinge-educate",
    points: 4
  },
  {
    id: "SIJ_EDUCATE_ANCHORED_BRIDGE",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Anchored Bridge",
    focus: "glute + adductor integration",
    description: "Bridge while keeping ribs down, feeling glutes and adductors.",
    duration: "10-15 seconds (holds)",
    difficulty: "Beginner",
    instructions: [
      "Feet hip‑width; lift hips with ribs down; breathe to maintain height.",
      "Feel glutes + adductors, not low back; 3 sets."
    ],
    videoId: "sij-anchored-bridge",
    points: 3
  },

  // REBUILD (resilience + rotation tolerance)
  {
    id: "SIJ_REBUILD_LOADED_FOUNDATION_SQUAT",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Loaded Foundation Squat",
    focus: "squat strength with stack",
    description: "Hold weight close; inhale down stacked; exhale drive tall.",
    duration: "6-8 reps x 2-3 sets",
    difficulty: "Advanced",
    instructions: [
      "Feet grounded; knees track over feet; maintain decompression throughout."
    ],
    videoId: "sij-loaded-foundation-squat",
    points: 3
  },
  {
    id: "SIJ_REBUILD_FOUNDATION_WINDMILL",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Foundation Windmill",
    focus: "hinge with rotation control",
    description: "Wide stance; one arm overhead; hinge toward opposite foot with long spine.",
    duration: "6-8 reps/side",
    difficulty: "Advanced",
    instructions: [
      "Inhale into side ribs; exhale to rise; control rotation tolerance."
    ],
    videoId: "sij-foundation-windmill",
    points: 4
  },
  {
    id: "SIJ_REBUILD_SINGLE_LEG_HINGE_ROTATION",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Single‑Leg Hinge with Rotation",
    focus: "single‑leg hinge + controlled rotation",
    description: "Hinge on one leg; rotate torso slightly toward stance side; return tall.",
    duration: "6 reps/side",
    difficulty: "Advanced",
    instructions: [
      "Maintain pelvis control and stacked ribs; move with controlled breath."
    ],
    videoId: "sij-single-leg-hinge-rotation",
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
  ,

  // ---------- FOOT / ANKLE EXERCISES ----------
  // RESET (awareness + mobility)
  {
    id: "ANKLE_RESET_ANKLE_CIRCLES",
    region: "Foot/Ankle",
    phase: "Reset",
    name: "Ankle Circles",
    focus: "gentle ROM",
    description: "Slow circular motion through comfortable range.",
    duration: "5-8 reps each direction",
    difficulty: "Beginner",
    instructions: [
      "Move ankle slowly through a full circle; pain‑free; 5–8 each direction."
    ],
    videoId: "ankle-circles",
    points: 2
  },
  {
    id: "ANKLE_RESET_ANKLE_PUMPS",
    region: "Foot/Ankle",
    phase: "Reset",
    name: "Ankle Pumps (DF/PF)",
    focus: "mobility",
    description: "Point and flex with steady breath.",
    duration: "10-12 reps",
    difficulty: "Beginner",
    instructions: [
      "Point and flex slowly, breathing evenly; 10–12 reps."
    ],
    videoId: "ankle-pumps",
    points: 2
  },
  {
    id: "ANKLE_RESET_TOE_SPLAY_DOMING",
    region: "Foot/Ankle",
    phase: "Reset",
    name: "Toe Splay + Doming",
    focus: "arch control",
    description: "Spread toes and gently lift arch while tripod stays grounded.",
    duration: "10 reps, 3s holds",
    difficulty: "Beginner",
    instructions: [
      "Spread toes wide; gently lift arch (doming) keeping heel/ball grounded."
    ],
    videoId: "toe-splay-doming",
    points: 2
  },
  {
    id: "ANKLE_RESET_INVERSION_EVERSION_AM",
    region: "Foot/Ankle",
    phase: "Reset",
    name: "Inversion / Eversion Active Motion",
    focus: "frontal-plane control",
    description: "Gentle tilt in and out without forcing range.",
    duration: "8-10 reps",
    difficulty: "Beginner",
    instructions: [
      "Tilt foot in (inversion) and out (eversion) with smooth control; 8–10 reps."
    ],
    videoId: "inversion-eversion-am",
    points: 2
  },

  // EDUCATE (skill + control)
  {
    id: "ANKLE_EDUCATE_SHORT_FOOT_BALANCE",
    region: "Foot/Ankle",
    phase: "Educate",
    name: "Short Foot with Balance",
    focus: "arch set + balance",
    description: "Create tripod and slight arch lift during balance hold.",
    duration: "10-15 seconds x 2-3",
    difficulty: "Beginner+",
    instructions: [
      "Stand tall; create tripod; lift arch slightly, toes relaxed; hold 10–15s."
    ],
    videoId: "short-foot-balance",
    points: 3
  },
  {
    id: "ANKLE_EDUCATE_BANDED_DF_PF",
    region: "Foot/Ankle",
    phase: "Educate",
    name: "Banded Dorsiflexion / Plantarflexion",
    focus: "strength through range",
    description: "Controlled DF/PF against band resistance.",
    duration: "10 reps each way",
    difficulty: "Beginner+",
    instructions: [
      "Anchor band; move ankle through range with control; 10 reps each."
    ],
    videoId: "banded-df-pf",
    points: 3
  },
  {
    id: "ANKLE_EDUCATE_SINGLE_LEG_BALANCE",
    region: "Foot/Ankle",
    phase: "Educate",
    name: "Single‑Leg Balance",
    focus: "balance + tripod",
    description: "Maintain tripod contact while stacked breathing.",
    duration: "20-30 seconds x 2-3",
    difficulty: "Beginner+",
    instructions: [
      "Stand on one leg; ribs stacked; maintain tripod contact; steady breath."
    ],
    videoId: "single-leg-balance-ankle",
    points: 3
  },
  {
    id: "ANKLE_EDUCATE_DOUBLE_LEG_HEEL_RAISE",
    region: "Foot/Ankle",
    phase: "Educate",
    name: "Double‑Leg Heel Raise",
    focus: "calf control",
    description: "Rise tall; control descent; keep weight across tripod.",
    duration: "10-12 reps",
    difficulty: "Beginner+",
    instructions: [
      "Rise onto balls of feet; control down; keep weight even across tripod."
    ],
    videoId: "double-leg-heel-raise",
    points: 3
  },

  // REBUILD (resilience + load)
  {
    id: "ANKLE_REBUILD_SINGLE_LEG_CALF_RAISE",
    region: "Foot/Ankle",
    phase: "Rebuild",
    name: "Single‑Leg Calf Raises",
    focus: "calf strength + control",
    description: "Rise tall and lower slow on one foot; maintain tripod.",
    duration: "8-10 reps/side",
    difficulty: "Advanced",
    instructions: [
      "Balance on one foot; rise tall; lower slow; keep tripod contact."
    ],
    videoId: "single-leg-calf-raise",
    points: 3
  },
  {
    id: "ANKLE_REBUILD_LOADED_CARRIES",
    region: "Foot/Ankle",
    phase: "Rebuild",
    name: "Loaded Carries (Farmer / Suitcase)",
    focus: "postural endurance + foot stability",
    description: "Walk tall with weights; ribs over hips; stable feet.",
    duration: "20-30 seconds x 2-3",
    difficulty: "Advanced",
    instructions: [
      "Hold weights; walk tall with stacked ribs; focus on grip + foot stability."
    ],
    videoId: "ankle-loaded-carries",
    points: 3
  },
  {
    id: "ANKLE_REBUILD_STEP_UP_HEEL_CONTROL",
    region: "Foot/Ankle",
    phase: "Rebuild",
    name: "Step‑Up with Heel Control",
    focus: "closed‑chain control",
    description: "Drive through heel up; control descent; knee tracks over foot.",
    duration: "6-8 reps/side",
    difficulty: "Advanced",
    instructions: [
      "Step to box; drive through heel; control down; maintain alignment."
    ],
    videoId: "step-up-heel-control",
    points: 3
  },
  {
    id: "ANKLE_REBUILD_TOE_OFF_DRILLS",
    region: "Foot/Ankle",
    phase: "Rebuild",
    name: "Toe‑Off Drills",
    focus: "gait push‑off mechanics",
    description: "March or walk emphasizing push‑off through big toe.",
    duration: "30-60 seconds",
    difficulty: "Advanced",
    instructions: [
      "March/walk slowly emphasizing big‑toe push‑off; stay tall; control contact."
    ],
    videoId: "toe-off-drills",
    points: 2
  }
];