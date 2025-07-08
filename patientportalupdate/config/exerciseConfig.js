// Exercise Configuration for Patient Portal
// Automatically updates based on intake form: SRS score, phase, and region

export const EXERCISE_DATABASE = [
  /* ---------- RESET PHASE (SRS 0-3) ---------- */
  
  // Neck/Cervical Exercises (SRS 0-2)
  { 
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Neck", 
    region: "Cervical / Upper T-Spine", 
    exercise: "Supine decompression breathing",
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
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Neck", 
    region: "Cervical / Upper T-Spine", 
    exercise: "Wall-press chin tuck",
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
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Neck", 
    region: "Cervical / Upper T-Spine", 
    exercise: "Prone T isometric",
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

  // Back/Lumbar Exercises (SRS 0-2)
  { 
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Standing decompression breath",
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
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Supine anchored breathing",
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
    stage: "Reset", 
    srsMin: 0, 
    srsMax: 2, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Anchored bridge hold",
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

  // Back/Lumbar Exercises (SRS 2-3)
  { 
    stage: "Reset", 
    srsMin: 2, 
    srsMax: 3, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Anchored bridge march",
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
    stage: "Reset", 
    srsMin: 2, 
    srsMax: 3, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Anchored back-extension hold",
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

  // Lower Limb Exercises (SRS 2-3)
  { 
    stage: "Reset", 
    srsMin: 2, 
    srsMax: 3, 
    category: "Lower Limb", 
    region: "Hip / Pelvis", 
    exercise: "Two-foot glute-med wall lean",
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

  // Upper Limb Exercises (SRS 2-3)
  { 
    stage: "Reset", 
    srsMin: 2, 
    srsMax: 3, 
    category: "Upper Limb", 
    region: "Shoulder / Scap", 
    exercise: "Band-tension wall slide",
    description: "Improve shoulder mobility and scapular control",
    duration: "6-10 minutes",
    difficulty: "Beginner+",
    instructions: [
      "Stand with back to wall, arms in W position",
      "Hold light resistance band",
      "Slide arms up and down wall",
      "Maintain band tension throughout"
    ],
    videoId: "band-tension-wall-slide",
    points: 5
  },

  /* ---------- EDUCATE PHASE (SRS 4-7) ---------- */
  
  { 
    stage: "Educate", 
    srsMin: 4, 
    srsMax: 7, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Loaded Foundation hinge",
    description: "Learn proper hip hinge movement with light load",
    duration: "12-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold light weight (5-10 lbs)",
      "Hinge at hips, keep back straight",
      "Push hips back, lower weight",
      "Drive hips forward to return"
    ],
    videoId: "loaded-foundation-hinge",
    points: 8
  },
  { 
    stage: "Educate", 
    srsMin: 4, 
    srsMax: 7, 
    category: "Lower Limb", 
    region: "Hip / Pelvis", 
    exercise: "Single-leg glute-med wall lean",
    description: "Progress to single-leg hip stabilization",
    duration: "8-12 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Stand on one leg next to wall",
      "Lean into wall with hip/shoulder",
      "Maintain balance on standing leg",
      "Hold for 15-20 seconds each side"
    ],
    videoId: "single-leg-glute-med-lean",
    points: 6
  },
  { 
    stage: "Educate", 
    srsMin: 4, 
    srsMax: 7, 
    category: "Upper Limb", 
    region: "Shoulder / Scap", 
    exercise: "D2 banded reach + IR cue",
    description: "Functional shoulder movement with resistance",
    duration: "10-15 minutes",
    difficulty: "Intermediate",
    instructions: [
      "Hold resistance band in D2 pattern",
      "Reach diagonally up and across body",
      "Focus on internal rotation cue",
      "Control the return movement"
    ],
    videoId: "d2-banded-reach-ir",
    points: 7
  },

  /* ---------- REBUILD PHASE (SRS 8-11) ---------- */
  
  { 
    stage: "Rebuild", 
    srsMin: 8, 
    srsMax: 11, 
    category: "Back", 
    region: "Lumbar / Core", 
    exercise: "Gorilla lift + breath cadence",
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
    stage: "Rebuild", 
    srsMin: 8, 
    srsMax: 11, 
    category: "Lower Limb", 
    region: "Hip / Pelvis", 
    exercise: "Weighted Foundation squat (IR)",
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
  { 
    stage: "Rebuild", 
    srsMin: 8, 
    srsMax: 11, 
    category: "Upper Limb", 
    region: "Shoulder / Scap", 
    exercise: "KB rack march + band IR pull",
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
  }
];

// Helper function to get exercises for a patient based on their data
export function getPatientExercises(patientData) {
  const { srsScore, phase, region } = patientData;
  
  // Convert region from intake form to exercise categories
  const regionMapping = {
    "Neck": ["Neck"],
    "Mid-Back / Thoracic": ["Back", "Upper Limb"], 
    "Low Back / SI Joint": ["Back"],
    "Shoulder": ["Upper Limb"],
    "Elbow / Forearm": ["Upper Limb"],
    "Wrist / Hand": ["Upper Limb"],
    "Hip / Groin": ["Lower Limb"],
    "Knee": ["Lower Limb"],
    "Ankle / Foot": ["Lower Limb"]
  };

  const relevantCategories = regionMapping[region] || ["Back"];
  
  // First, try to get exercises with exact criteria
  let filteredExercises = EXERCISE_DATABASE.filter(exercise => {
    // Check if SRS score is within range
    const srsInRange = srsScore >= exercise.srsMin && srsScore <= exercise.srsMax;
    
    // Check if phase matches
    const phaseMatches = exercise.stage === phase;
    
    // Check if category is relevant to patient's region
    const categoryRelevant = relevantCategories.includes(exercise.category);
    
    return srsInRange && phaseMatches && categoryRelevant;
  });

  // If we don't have at least 3 exercises, expand the criteria
  if (filteredExercises.length < 3) {
    console.log(`🔄 Only ${filteredExercises.length} exercises found, expanding criteria...`);
    
    // Try expanding to include all categories for the phase/SRS
    filteredExercises = EXERCISE_DATABASE.filter(exercise => {
      const srsInRange = srsScore >= exercise.srsMin && srsScore <= exercise.srsMax;
      const phaseMatches = exercise.stage === phase;
      return srsInRange && phaseMatches;
    });
    
    // If still not enough, include adjacent phases
    if (filteredExercises.length < 3) {
      const phaseOrder = ["Reset", "Educate", "Rebuild"];
      const currentPhaseIndex = phaseOrder.indexOf(phase);
      const adjacentPhases = [phase];
      
      // Add previous phase if exists
      if (currentPhaseIndex > 0) {
        adjacentPhases.push(phaseOrder[currentPhaseIndex - 1]);
      }
      // Add next phase if exists
      if (currentPhaseIndex < phaseOrder.length - 1) {
        adjacentPhases.push(phaseOrder[currentPhaseIndex + 1]);
      }
      
      filteredExercises = EXERCISE_DATABASE.filter(exercise => {
        const srsInRange = srsScore >= exercise.srsMin && srsScore <= exercise.srsMax;
        const phaseMatches = adjacentPhases.includes(exercise.stage);
        return srsInRange && phaseMatches;
      });
    }
  }

  // Ensure we have at least 3 exercises, prioritizing by relevance
  const finalExercises = filteredExercises.slice(0, 3);
  
  // If we still don't have 3, fill with fallback exercises
  if (finalExercises.length < 3) {
    const fallbackExercises = EXERCISE_DATABASE.filter(ex => 
      !finalExercises.includes(ex) && ex.stage === "Reset"
    ).slice(0, 3 - finalExercises.length);
    
    finalExercises.push(...fallbackExercises);
  }

  console.log(`✅ Returning ${finalExercises.length} exercises for patient:`, {
    srsScore, phase, region, 
    exercises: finalExercises.map(ex => ex.exercise)
  });

  return finalExercises;
}

// Helper function to get daily exercise tasks
export function getDailyExerciseTasks(patientData) {
  const exercises = getPatientExercises(patientData);
  
  // Select 2-3 exercises for daily tasks based on priority
  const dailyTasks = exercises.slice(0, 3).map((exercise, index) => ({
    id: `exercise-${index + 1}`,
    title: exercise.exercise,
    description: exercise.description,
    category: "Exercise",
    duration: exercise.duration,
    difficulty: exercise.difficulty,
    points: exercise.points,
    status: "pending",
    type: "exercise",
    exerciseData: exercise
  }));

  return dailyTasks;
}

// Helper function to categorize exercises by body region
export function categorizeExercisesByRegion(exercises) {
  const categories = {
    "Neck": [],
    "Back": [], 
    "Upper Limb": [],
    "Lower Limb": []
  };

  exercises.forEach(exercise => {
    if (categories[exercise.category]) {
      categories[exercise.category].push(exercise);
    }
  });

  return categories;
}

// Helper function to get phase-appropriate exercise count
export function getPhaseExerciseTarget(phase) {
  const targets = {
    "Reset": { daily: 2, weekly: 10 },
    "Educate": { daily: 3, weekly: 15 },
    "Rebuild": { daily: 3, weekly: 18 }
  };
  
  return targets[phase] || targets["Reset"];
} 