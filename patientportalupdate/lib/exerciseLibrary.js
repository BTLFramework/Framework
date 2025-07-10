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
  },

  /* ---------- THORACIC / RIB CAGE EXERCISES ---------- */
  
  // RESET · SRS 0-2
  {
    id: "THORACIC_RESET_TALL_KNEELING_DECOMPRESSION",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Tall-kneeling decompression breath",
    focus: "breathing",
    description: "Improve thoracic mobility and breathing pattern",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Kneel tall with hips over knees",
      "Anchor hips in position",
      "Inhale 360° into ribs",
      "Exhale, grow taller"
    ],
    videoId: "tall-kneeling-decompression",
    points: 3,
    cues: ["Anchor hips.", "Inhale 360° into ribs.", "Exhale, grow taller."]
  },
  {
    id: "THORACIC_RESET_QUADRUPED_ANCHORED_REACH",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Quadruped anchored reach",
    focus: "thoracic mobility",
    description: "Improve thoracic rotation and mobility",
    duration: "6-10 minutes",
    difficulty: "Beginner",
    instructions: [
      "Start on hands and knees",
      "Press floor, round mid-back",
      "Segment one vertebra at a time",
      "Reach with control"
    ],
    videoId: "quadruped-anchored-reach",
    points: 4,
    cues: ["Press floor, round mid-back.", "Segment one vertebra at a time."]
  },
  {
    id: "THORACIC_RESET_PRONE_T_ISOMETRIC_THORACIC",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Prone T isometric (scap set, chest lift)",
    focus: "upper back activation",
    description: "Strengthen thoracic extensors and scapular stabilizers",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie face down with arms in T position",
      "Thumbs up position",
      "Lift chest without low-back hinge",
      "Hold 5 seconds, breathe"
    ],
    videoId: "prone-t-isometric-thoracic",
    points: 4,
    cues: ["Thumbs up.", "Lift chest without low-back hinge.", "Hold 5 s, breathe."]
  },

  // RESET · SRS 2-3
  {
    id: "THORACIC_RESET_ANCHORED_BACK_EXTENSION_THORACIC",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Anchored back-extension lift (thoracic focus)",
    focus: "thoracic extension",
    description: "Focus on thoracic extension with core control",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Lie face down with hands under forehead",
      "Glutes on, ribs down",
      "Lift only to mild tension",
      "Focus on mid-back extension"
    ],
    videoId: "anchored-back-extension-thoracic",
    points: 5,
    cues: ["Glutes on, ribs down.", "Lift only to mild tension."]
  },
  {
    id: "THORACIC_RESET_CROSS_REACH_ROCK_BACK",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Cross-reach rock-back with breath",
    focus: "thoracic rotation",
    description: "Improve thoracic rotation with breathing coordination",
    duration: "8-12 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Sit with legs extended",
      "Exhale, reach across body",
      "Feel ribs glide around spine",
      "Control return movement"
    ],
    videoId: "cross-reach-rock-back",
    points: 5,
    cues: ["Exhale, reach across.", "Feel ribs glide around spine."]
  },
  {
    id: "THORACIC_RESET_BAND_THORACIC_ROTATION",
    region: "Thoracic / Rib Cage",
    phase: "Reset",
    name: "Band-assisted thoracic rotation (half-kneel)",
    focus: "thoracic rotation",
    description: "Improve thoracic rotation with band assistance",
    duration: "8-12 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Half-kneeling position",
      "Stack ribs over pelvis",
      "Rotate on exhale, eyes follow hands",
      "Maintain band tension"
    ],
    videoId: "band-thorac-rotation",
    points: 5,
    cues: ["Stack ribs over pelvis.", "Rotate on exhale, eyes follow hands."]
  },

  // EDUCATE · SRS 4-7
  {
    id: "THORACIC_EDUCATE_ELEVATED_FOUNDER",
    region: "Thoracic / Rib Cage",
    phase: "Educate",
    name: "Elevated Founder with long reach",
    focus: "thoracic extension",
    description: "Improve thoracic extension and shoulder mobility",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet elevated",
      "Hips anchor back",
      "Reach long to open upper ribs",
      "Maintain neutral spine"
    ],
    videoId: "elevated-founder",
    points: 7,
    cues: ["Hips anchor back.", "Reach long to open upper ribs."]
  },
  {
    id: "THORACIC_EDUCATE_LOADED_BACK_EXTENSION",
    region: "Thoracic / Rib Cage",
    phase: "Educate",
    name: "Loaded back extension (band or DB)",
    focus: "thoracic strength",
    description: "Strengthen thoracic extensors with light load",
    duration: "12-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Use light weight or band",
      "Lift chest via mid-back, not lumbar",
      "Maintain neutral pelvis",
      "Control movement throughout"
    ],
    videoId: "loaded-back-extension",
    points: 8,
    cues: ["Light weight.", "Lift chest via mid-back, not lumbar."]
  },
  {
    id: "THORACIC_EDUCATE_FOUNDATION_ROW",
    region: "Thoracic / Rib Cage",
    phase: "Educate",
    name: "Foundation row with shoulder retraction",
    focus: "scapular control",
    description: "Improve scapular control and thoracic posture",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with band or cable",
      "Glutes squeeze",
      "Retract shoulders without rib flare",
      "Maintain neutral spine"
    ],
    videoId: "foundation-row",
    points: 7,
    cues: ["Glutes squeeze.", "Retract shoulders without rib flare."]
  },

  // REBUILD · SRS 8-11
  {
    id: "THORACIC_REBUILD_OVERHEAD_FOUNDER",
    region: "Thoracic / Rib Cage",
    phase: "Rebuild",
    name: "Loaded overhead Founder (KB or bar)",
    focus: "thoracic stability",
    description: "Advanced thoracic stability with overhead load",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight overhead",
      "Press weight up while hips anchor",
      "Maintain thoracic extension",
      "Control movement throughout"
    ],
    videoId: "overhead-founder",
    points: 12,
    cues: ["Press weight up while hips anchor."]
  },
  {
    id: "THORACIC_REBUILD_CABLE_T_SPINE_ROTATION",
    region: "Thoracic / Rib Cage",
    phase: "Rebuild",
    name: "Cable-resisted T-spine rotation",
    focus: "thoracic rotation strength",
    description: "Strengthen thoracic rotation with cable resistance",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand sideways to cable",
      "Rotate from ribs, keep pelvis still",
      "Maintain neutral spine",
      "Control return movement"
    ],
    videoId: "cable-t-spine-rotation",
    points: 11,
    cues: ["Rotate from ribs, keep pelvis still."]
  },
  {
    id: "THORACIC_REBUILD_BENT_ROW_DECOMPRESSION",
    region: "Thoracic / Rib Cage",
    phase: "Rebuild",
    name: "Bent-row with decompression breath cue",
    focus: "thoracic strength and breathing",
    description: "Advanced rowing with breathing coordination",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Bent-over position",
      "Long spine",
      "Breathe wide every rep",
      "Maintain thoracic extension"
    ],
    videoId: "bent-row-decompression",
    points: 12,
    cues: ["Long spine.", "Breathe wide every rep."]
  },

  /* ---------- ADDITIONAL NECK EXERCISES ---------- */
  
  // RESET · SRS 0-2
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

  // EDUCATE · SRS 4-7
  {
    id: "NECK_EDUCATE_ANCHORED_THORACIC_WALL_GLIDE",
    region: "Neck",
    phase: "Educate",
    name: "Anchored thoracic wall glide",
    focus: "thoracic mobility",
    description: "Improve thoracic spine mobility with wall support",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with back to wall",
      "Place hands on wall at shoulder height",
      "Slide hands up wall while arching back",
      "Hold for 5 seconds, repeat 8-10 times"
    ],
    videoId: "anchored-thoracic-wall-glide",
    points: 6
  },
  {
    id: "NECK_EDUCATE_WALL_ANGEL_DECOMPRESSION_BREATH",
    region: "Neck",
    phase: "Educate",
    name: "Wall angel + decompression breath",
    focus: "shoulder mobility",
    description: "Wall angels with decompression breathing",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with back to wall",
      "Arms in W position against wall",
      "Slide arms up and down wall",
      "Breathe out during upward movement"
    ],
    videoId: "wall-angel-decompression",
    points: 7
  },
  {
    id: "NECK_EDUCATE_HALF_KNEELING_CROSS_REACH",
    region: "Neck",
    phase: "Educate",
    name: "Half-kneeling cross-reach",
    focus: "rotational stability",
    description: "Rotational movement with cervical control",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Kneel on one knee, other foot forward",
      "Reach across body with opposite arm",
      "Rotate trunk while keeping head stable",
      "Hold for 3 seconds, repeat 10 times each side"
    ],
    videoId: "half-kneeling-cross-reach",
    points: 6
  },

  // REBUILD · SRS 8-11
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
    points: 9
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
    points: 8
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
    points: 10
  },

  /* ---------- ADDITIONAL BACK EXERCISES ---------- */
  
  // EDUCATE · SRS 4-7
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
    points: 6
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
    points: 7
  },
  {
    id: "BACK_EDUCATE_LOADED_FOUNDATION_SQUAT",
    region: "Low Back / SI Joint",
    phase: "Educate",
    name: "Loaded Foundation squat",
    focus: "squat technique",
    description: "Squat with light load and proper form",
    duration: "12-18 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold weight at chest level",
      "Feet shoulder-width apart",
      "Squat down as if sitting back",
      "Keep chest up and knees aligned"
    ],
    videoId: "loaded-foundation-squat",
    points: 8
  },

  // REBUILD · SRS 8-11
  {
    id: "BACK_REBUILD_WEIGHTED_FOUNDATION_HINGE",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Weighted Foundation hinge",
    focus: "hip hinge strength",
    description: "Hip hinge with moderate weight",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight in front of body",
      "Hinge at hips, keep back straight",
      "Lower weight toward shins",
      "Return to standing with control"
    ],
    videoId: "weighted-foundation-hinge",
    points: 9
  },
  {
    id: "BACK_REBUILD_LOADED_FOUNDATION_SQUAT",
    region: "Low Back / SI Joint",
    phase: "Rebuild",
    name: "Loaded Foundation squat",
    focus: "squat strength",
    description: "Squat with moderate weight",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight at chest or shoulder level",
      "Squat to parallel or below",
      "Keep chest up and knees out",
      "Drive through heels to stand"
    ],
    videoId: "loaded-foundation-squat-rebuild",
    points: 10
  },

  /* ---------- ADDITIONAL SHOULDER EXERCISES ---------- */
  
  // EDUCATE · SRS 4-7
  {
    id: "SHOULDER_EDUCATE_D2_BANDED_REACH_ER_CUE",
    region: "Shoulder",
    phase: "Educate",
    name: "D2 banded reach (ER cue)",
    focus: "external rotation",
    description: "Diagonal band exercise with external rotation focus",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold band with arm extended",
      "Move arm in diagonal pattern",
      "Focus on external rotation",
      "Keep shoulder blade stable"
    ],
    videoId: "d2-banded-reach-er",
    points: 6
  },
  {
    id: "SHOULDER_EDUCATE_LOADED_FOUNDATION_ROW",
    region: "Shoulder",
    phase: "Educate",
    name: "Loaded Foundation row",
    focus: "scapular retraction",
    description: "Row exercise with light load",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold weight in both hands",
      "Bend forward at hips",
      "Row weight to chest",
      "Squeeze shoulder blades together"
    ],
    videoId: "loaded-foundation-row",
    points: 7
  },

  // REBUILD · SRS 8-11
  {
    id: "SHOULDER_REBUILD_KB_RACK_MARCH_BAND_ER_PULL",
    region: "Shoulder",
    phase: "Rebuild",
    name: "KB rack march + band ER pull",
    focus: "shoulder stability",
    description: "Kettlebell rack position with band external rotation",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold kettlebell in rack position",
      "Attach band to stationary object",
      "Pull band with external rotation",
      "March in place while maintaining position"
    ],
    videoId: "kb-rack-march-band-er",
    points: 9
  },
  {
    id: "SHOULDER_REBUILD_LOADED_FOUNDATION_ROW",
    region: "Shoulder",
    phase: "Rebuild",
    name: "Loaded Foundation row",
    focus: "row strength",
    description: "Row exercise with moderate weight",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold moderate weight",
      "Bend forward at hips",
      "Row weight to chest",
      "Focus on scapular retraction"
    ],
    videoId: "loaded-foundation-row-rebuild",
    points: 10
  },

  /* ---------- ADDITIONAL HIP EXERCISES ---------- */
  
  // EDUCATE · SRS 4-7
  {
    id: "HIP_EDUCATE_SINGLE_LEG_GLUTE_MED_WALL_LEAN_LOADED",
    region: "Hip / Groin",
    phase: "Educate",
    name: "Single-leg glute-med wall lean (loaded)",
    focus: "hip stability with load",
    description: "Single leg wall lean with added resistance",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand sideways to wall on one leg",
      "Hold light weight in opposite hand",
      "Lean into wall with hip",
      "Maintain balance and hip position"
    ],
    videoId: "single-leg-glute-med-loaded",
    points: 6
  },
  {
    id: "HIP_EDUCATE_LOADED_FOUNDATION_SQUAT",
    region: "Hip / Groin",
    phase: "Educate",
    name: "Loaded Foundation squat",
    focus: "squat technique",
    description: "Squat with light load and proper form",
    duration: "12-18 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold light weight at chest level",
      "Squat to parallel or below",
      "Keep knees aligned with toes",
      "Drive through heels to stand"
    ],
    videoId: "loaded-foundation-squat-hip",
    points: 7
  },

  // REBUILD · SRS 8-11
  {
    id: "HIP_REBUILD_WEIGHTED_FOUNDATION_SQUAT_ER",
    region: "Hip / Groin",
    phase: "Rebuild",
    name: "Weighted Foundation squat (ER)",
    focus: "squat with external rotation",
    description: "Squat with weight and external rotation cue",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight at chest level",
      "Squat with external rotation cue",
      "Focus on knee alignment",
      "Power through heels to stand"
    ],
    videoId: "weighted-foundation-squat-er",
    points: 9
  },
  {
    id: "HIP_REBUILD_LOADED_FOUNDATION_HINGE",
    region: "Hip / Groin",
    phase: "Rebuild",
    name: "Loaded Foundation hinge",
    focus: "hip hinge strength",
    description: "Hip hinge with moderate weight",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight in front of body",
      "Hinge at hips, keep back straight",
      "Lower weight toward shins",
      "Return to standing with control"
    ],
    videoId: "loaded-foundation-hinge-hip",
    points: 10
  },

  /* ---------- ELBOW EXERCISES ---------- */
  
  // RESET · SRS 0-2
  {
    id: "ELBOW_RESET_SUPINE_ELBOW_FLEXION_EXTENSION",
    region: "Elbow",
    phase: "Reset",
    name: "Supine elbow flexion/extension",
    focus: "elbow mobility",
    description: "Gentle elbow range of motion exercise",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on back with arms at sides",
      "Slowly bend and straighten elbows",
      "Keep shoulders relaxed",
      "Move through pain-free range"
    ],
    videoId: "supine-elbow-flexion-extension",
    points: 3
  },
  {
    id: "ELBOW_RESET_SEATED_FOREARM_PRONATION_SUPINATION",
    region: "Elbow",
    phase: "Reset",
    name: "Seated forearm pronation/supination",
    focus: "forearm rotation",
    description: "Gentle forearm rotation exercise",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with elbows bent at 90 degrees",
      "Rotate forearms palm up and down",
      "Keep elbows close to body",
      "Move slowly and controlled"
    ],
    videoId: "seated-forearm-pronation-supination",
    points: 3
  },
  {
    id: "ELBOW_RESET_WALL_PUSH_UP_HOLDS",
    region: "Elbow",
    phase: "Reset",
    name: "Wall push-up holds",
    focus: "elbow stability",
    description: "Isometric holds against wall",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Stand facing wall, arms extended",
      "Place hands on wall at shoulder height",
      "Hold position for 10-15 seconds",
      "Keep body in straight line"
    ],
    videoId: "wall-push-up-holds",
    points: 4
  },

  // EDUCATE · SRS 4-7
  {
    id: "ELBOW_EDUCATE_BANDED_ELBOW_FLEXION",
    region: "Elbow",
    phase: "Educate",
    name: "Banded elbow flexion",
    focus: "elbow flexion strength",
    description: "Resistance band elbow curls",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand on resistance band",
      "Hold band with palms up",
      "Curl hands toward shoulders",
      "Control the movement down"
    ],
    videoId: "banded-elbow-flexion",
    points: 6
  },
  {
    id: "ELBOW_EDUCATE_BANDED_ELBOW_EXTENSION",
    region: "Elbow",
    phase: "Educate",
    name: "Banded elbow extension",
    focus: "elbow extension strength",
    description: "Resistance band tricep extensions",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Anchor band overhead",
      "Hold band with elbows bent",
      "Extend elbows fully",
      "Control the return movement"
    ],
    videoId: "banded-elbow-extension",
    points: 6
  },
  {
    id: "ELBOW_EDUCATE_LOADED_FOREARM_ROTATION",
    region: "Elbow",
    phase: "Educate",
    name: "Loaded forearm rotation",
    focus: "forearm strength",
    description: "Forearm rotation with light weight",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold light weight in hand",
      "Elbow bent at 90 degrees",
      "Rotate forearm palm up and down",
      "Keep elbow stable"
    ],
    videoId: "loaded-forearm-rotation",
    points: 7
  },

  // REBUILD · SRS 8-11
  {
    id: "ELBOW_REBUILD_DUMBBELL_CURLS",
    region: "Elbow",
    phase: "Rebuild",
    name: "Dumbbell curls",
    focus: "elbow flexion strength",
    description: "Traditional dumbbell bicep curls",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold dumbbells at sides",
      "Curl weights toward shoulders",
      "Keep elbows close to body",
      "Lower with control"
    ],
    videoId: "dumbbell-curls",
    points: 9
  },
  {
    id: "ELBOW_REBUILD_TRICEP_DIPS",
    region: "Elbow",
    phase: "Rebuild",
    name: "Tricep dips",
    focus: "elbow extension strength",
    description: "Body weight tricep dips",
    duration: "10-15 minutes",
    difficulty: "Advanced",
    instructions: [
      "Support body on parallel bars",
      "Lower body by bending elbows",
      "Push back up to starting position",
      "Keep elbows close to body"
    ],
    videoId: "tricep-dips",
    points: 10
  },

  /* ---------- WRIST EXERCISES ---------- */
  
  // RESET · SRS 0-2
  {
    id: "WRIST_RESET_WRIST_CIRCLES",
    region: "Wrist",
    phase: "Reset",
    name: "Wrist circles",
    focus: "wrist mobility",
    description: "Gentle wrist range of motion",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Hold arms out in front",
      "Make circles with wrists",
      "Move in both directions",
      "Keep movements gentle"
    ],
    videoId: "wrist-circles",
    points: 3
  },
  {
    id: "WRIST_RESET_WRIST_FLEXION_EXTENSION",
    region: "Wrist",
    phase: "Reset",
    name: "Wrist flexion/extension",
    focus: "wrist mobility",
    description: "Wrist bending and straightening",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Hold arms out in front",
      "Bend wrists up and down",
      "Move through full range",
      "Keep elbows straight"
    ],
    videoId: "wrist-flexion-extension",
    points: 3
  },
  {
    id: "WRIST_RESET_WRIST_RADIAL_ULNAR_DEVIATION",
    region: "Wrist",
    phase: "Reset",
    name: "Wrist radial/ulnar deviation",
    focus: "wrist side-to-side motion",
    description: "Wrist movement side to side",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Hold arms out in front",
      "Move wrists side to side",
      "Keep fingers relaxed",
      "Move through pain-free range"
    ],
    videoId: "wrist-radial-ulnar-deviation",
    points: 3
  },

  // EDUCATE · SRS 4-7
  {
    id: "WRIST_EDUCATE_BANDED_WRIST_FLEXION",
    region: "Wrist",
    phase: "Educate",
    name: "Banded wrist flexion",
    focus: "wrist flexion strength",
    description: "Resistance band wrist curls",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Sit with band under foot",
      "Hold band with palm up",
      "Curl wrist upward",
      "Control the return movement"
    ],
    videoId: "banded-wrist-flexion",
    points: 6
  },
  {
    id: "WRIST_EDUCATE_BANDED_WRIST_EXTENSION",
    region: "Wrist",
    phase: "Educate",
    name: "Banded wrist extension",
    focus: "wrist extension strength",
    description: "Resistance band wrist extensions",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Sit with band under foot",
      "Hold band with palm down",
      "Extend wrist upward",
      "Control the return movement"
    ],
    videoId: "banded-wrist-extension",
    points: 6
  },
  {
    id: "WRIST_EDUCATE_LOADED_WRIST_ROTATION",
    region: "Wrist",
    phase: "Educate",
    name: "Loaded wrist rotation",
    focus: "wrist rotation strength",
    description: "Wrist rotation with light weight",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold light weight in hand",
      "Rotate wrist in circles",
      "Keep elbow stable",
      "Move through full range"
    ],
    videoId: "loaded-wrist-rotation",
    points: 7
  },

  // REBUILD · SRS 8-11
  {
    id: "WRIST_REBUILD_DUMBBELL_WRIST_CURLS",
    region: "Wrist",
    phase: "Rebuild",
    name: "Dumbbell wrist curls",
    focus: "wrist flexion strength",
    description: "Traditional wrist curls with weight",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Sit with forearms on thighs",
      "Hold dumbbells with palms up",
      "Curl wrists upward",
      "Lower with control"
    ],
    videoId: "dumbbell-wrist-curls",
    points: 9
  },
  {
    id: "WRIST_REBUILD_REVERSE_WRIST_CURLS",
    region: "Wrist",
    phase: "Rebuild",
    name: "Reverse wrist curls",
    focus: "wrist extension strength",
    description: "Wrist extensions with weight",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Sit with forearms on thighs",
      "Hold dumbbells with palms down",
      "Extend wrists upward",
      "Lower with control"
    ],
    videoId: "reverse-wrist-curls",
    points: 9
  },

  /* ---------- KNEE EXERCISES ---------- */
  
  // RESET · SRS 0-2
  {
    id: "KNEE_RESET_SEATED_KNEE_EXTENSION",
    region: "Knee",
    phase: "Reset",
    name: "Seated knee extension",
    focus: "knee mobility",
    description: "Gentle knee straightening exercise",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with back supported",
      "Straighten one knee fully",
      "Hold for 5 seconds",
      "Lower slowly and repeat"
    ],
    videoId: "seated-knee-extension",
    points: 3
  },
  {
    id: "KNEE_RESET_HEEL_SLIDES",
    region: "Knee",
    phase: "Reset",
    name: "Heel slides",
    focus: "knee flexion",
    description: "Sliding heel to increase knee bend",
    duration: "6-10 minutes",
    difficulty: "Beginner",
    instructions: [
      "Lie on back with legs straight",
      "Slide heel toward buttocks",
      "Hold for 5 seconds",
      "Slide back to starting position"
    ],
    videoId: "heel-slides",
    points: 4
  },
  {
    id: "KNEE_RESET_STRAIGHT_LEG_RAISES",
    region: "Knee",
    phase: "Reset",
    name: "Straight leg raises",
    focus: "quadriceps activation",
    description: "Lifting straight leg while lying down",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Lie on back with one knee bent",
      "Lift straight leg to hip height",
      "Hold for 5 seconds",
      "Lower slowly and repeat"
    ],
    videoId: "straight-leg-raises",
    points: 4
  },

  // EDUCATE · SRS 4-7
  {
    id: "KNEE_EDUCATE_MINISQUATS",
    region: "Knee",
    phase: "Educate",
    name: "Mini squats",
    focus: "knee stability",
    description: "Partial squats with body weight",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Squat down to 45 degrees",
      "Keep knees over toes",
      "Return to standing position"
    ],
    videoId: "mini-squats",
    points: 6
  },
  {
    id: "KNEE_EDUCATE_STEP_UPS",
    region: "Knee",
    phase: "Educate",
    name: "Step ups",
    focus: "knee strength",
    description: "Stepping up and down on platform",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand facing step or platform",
      "Step up with one foot",
      "Bring other foot up",
      "Step down with control"
    ],
    videoId: "step-ups",
    points: 7
  },
  {
    id: "KNEE_EDUCATE_WALL_SLIDES",
    region: "Knee",
    phase: "Educate",
    name: "Wall slides",
    focus: "knee and hip coordination",
    description: "Sliding down wall with back support",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand with back against wall",
      "Slide down to sitting position",
      "Hold for 10-15 seconds",
      "Slide back up to standing"
    ],
    videoId: "wall-slides",
    points: 6
  },

  // REBUILD · SRS 8-11
  {
    id: "KNEE_REBUILD_LOADED_SQUATS",
    region: "Knee",
    phase: "Rebuild",
    name: "Loaded squats",
    focus: "knee strength",
    description: "Squats with additional weight",
    duration: "15-20 minutes",
    difficulty: "Advanced",
    instructions: [
      "Hold weight at chest level",
      "Squat to parallel or below",
      "Keep knees aligned with toes",
      "Drive through heels to stand"
    ],
    videoId: "loaded-squats-knee",
    points: 9
  },
  {
    id: "KNEE_REBUILD_LUNGES",
    region: "Knee",
    phase: "Rebuild",
    name: "Lunges",
    focus: "knee stability",
    description: "Forward and reverse lunges",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Step forward with one leg",
      "Lower body until both knees bent",
      "Keep front knee over ankle",
      "Push back to starting position"
    ],
    videoId: "lunges",
    points: 10
  },

  /* ---------- ANKLE EXERCISES ---------- */
  
  // RESET · SRS 0-2
  {
    id: "ANKLE_RESET_ANKLE_CIRCLES",
    region: "Ankle",
    phase: "Reset",
    name: "Ankle circles",
    focus: "ankle mobility",
    description: "Gentle ankle range of motion",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with legs extended",
      "Make circles with ankles",
      "Move in both directions",
      "Keep movements gentle"
    ],
    videoId: "ankle-circles",
    points: 3
  },
  {
    id: "ANKLE_RESET_ANKLE_PUMPS",
    region: "Ankle",
    phase: "Reset",
    name: "Ankle pumps",
    focus: "ankle flexion/extension",
    description: "Pointing and flexing feet",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with legs extended",
      "Point toes away from body",
      "Then pull toes toward body",
      "Repeat rhythmically"
    ],
    videoId: "ankle-pumps",
    points: 3
  },
  {
    id: "ANKLE_RESET_ANKLE_INVERSION_EVERSION",
    region: "Ankle",
    phase: "Reset",
    name: "Ankle inversion/eversion",
    focus: "ankle side-to-side motion",
    description: "Rolling ankles in and out",
    duration: "5-8 minutes",
    difficulty: "Beginner",
    instructions: [
      "Sit with legs extended",
      "Roll ankles inward",
      "Then roll ankles outward",
      "Move through pain-free range"
    ],
    videoId: "ankle-inversion-eversion",
    points: 3
  },

  // EDUCATE · SRS 4-7
  {
    id: "ANKLE_EDUCATE_BANDED_ANKLE_DORSIFLEXION",
    region: "Ankle",
    phase: "Educate",
    name: "Banded ankle dorsiflexion",
    focus: "ankle dorsiflexion strength",
    description: "Resistance band ankle pulls",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Sit with band around foot",
      "Pull toes toward shin",
      "Keep heel on ground",
      "Control the return movement"
    ],
    videoId: "banded-ankle-dorsiflexion",
    points: 6
  },
  {
    id: "ANKLE_EDUCATE_BANDED_ANKLE_PLANTARFLEXION",
    region: "Ankle",
    phase: "Educate",
    name: "Banded ankle plantarflexion",
    focus: "ankle plantarflexion strength",
    description: "Resistance band ankle pushes",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Sit with band around foot",
      "Push toes away from shin",
      "Keep heel on ground",
      "Control the return movement"
    ],
    videoId: "banded-ankle-plantarflexion",
    points: 6
  },
  {
    id: "ANKLE_EDUCATE_SINGLE_LEG_BALANCE",
    region: "Ankle",
    phase: "Educate",
    name: "Single leg balance",
    focus: "ankle stability",
    description: "Standing on one leg",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand on one leg",
      "Keep other leg slightly off ground",
      "Maintain balance for 30 seconds",
      "Switch legs and repeat"
    ],
    videoId: "single-leg-balance",
    points: 7
  },

  // REBUILD · SRS 8-11
  {
    id: "ANKLE_REBUILD_CALF_RAISES",
    region: "Ankle",
    phase: "Rebuild",
    name: "Calf raises",
    focus: "ankle plantarflexion strength",
    description: "Standing calf raises",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand with feet shoulder-width apart",
      "Rise up onto balls of feet",
      "Hold for 2-3 seconds",
      "Lower slowly and repeat"
    ],
    videoId: "calf-raises",
    points: 9
  },
  {
    id: "ANKLE_REBUILD_SINGLE_LEG_CALF_RAISES",
    region: "Ankle",
    phase: "Rebuild",
    name: "Single leg calf raises",
    focus: "ankle strength and stability",
    description: "Calf raises on one leg",
    duration: "12-18 minutes",
    difficulty: "Advanced",
    instructions: [
      "Stand on one leg",
      "Rise up onto ball of foot",
      "Hold for 2-3 seconds",
      "Lower slowly and repeat"
    ],
    videoId: "single-leg-calf-raises",
    points: 10
  }
]; 