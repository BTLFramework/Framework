// SRS Configuration - Single Source of Truth
// This file centralizes all scoring rules and phase cutoffs

// Baseline (Intake) Scoring Rules - Range: 0-9 points
export const intakeRules = {
  pain: {
    // VAS 0-10: ≤2 → +1 point
    threshold: 2,
    points: 1,
    description: "Pain (VAS ≤2)"
  },
  
  disability: {
    // Disability Index ≤20% → +1 point
    threshold: 20,
    points: 1,
    description: "Disability (≤20%)"
  },
  
  function: {
    // PSFS Average: ≥7 → +2, 4-6.9 → +1
    excellent: { threshold: 7, points: 2 },
    good: { threshold: 4, points: 1 },
    description: "Task Function (PSFS)"
  },
  
  confidence: {
    // Confidence 0-10: ≥8 → +2, 5-7 → +1
    high: { threshold: 8, points: 2 },
    moderate: { threshold: 5, points: 1 },
    description: "Confidence"
  },
  
  fearAvoidance: {
    // TSK-11 raw score ≤22 → +1 point (low fear-avoidance)
    threshold: 22,
    points: 1,
    description: "Low fear-avoidance (TSK-11 ≤22)"
  },
  
  clinician: {
    milestone: { points: 1, description: "Recovery Milestone Met" },
    progress: { points: 1, description: "Objective Progress" }
  }
};

// Follow-up Scoring Rules - Range: 0-11 points
export const followUpRules = {
  pain: {
    // VAS decrease ≥2 pts → +1
    improvement: 2,
    points: 1,
    description: "Pain improved (VAS -2+)"
  },
  
  function: {
    // PSFS increase ≥4 pts → +2
    improvement: 4,
    points: 2,
    description: "Function improved (PSFS +4+)"
  },
  
  disability: {
    // Disability drop ≥10% → +1
    improvement: 10,
    points: 1,
    description: "Disability improved (-10%+)"
  },
  
  confidence: {
    // Confidence increase ≥3 pts → +2
    improvement: 3,
    points: 2,
    description: "Confidence improved (+3+)"
  },
  
  beliefs: {
    // All negative beliefs cleared → +1
    points: 1,
    description: "All negative beliefs cleared"
  },
  
  groc: {
    // GROC ≥+5 → +1
    threshold: 5,
    points: 1,
    description: "GROC (≥+5)"
  },
  
  clinician: {
    milestone: { points: 1, description: "Recovery Milestone Met" },
    progress: { points: 1, description: "Objective Progress" }
  }
};

// Phase Determination Cutoffs
export const phaseCutoffs = {
  reset: 3,     // 0-3 = RESET
  educate: 7    // 4-7 = EDUCATE, 8-11 = REBUILD
};

// Phase Helper Function
export function getPhase(score) {
  if (score <= phaseCutoffs.reset) return "RESET";
  if (score <= phaseCutoffs.educate) return "EDUCATE";
  return "REBUILD";
}

// Score Ranges
export const scoreRanges = {
  baseline: { min: 0, max: 9 },
  followup: { min: 0, max: 11 }
};

// Phase Descriptions for UI
export const phaseDescriptions = {
  RESET: {
    title: "RESET Phase",
    description: "Focus on symptom control & movement reassurance",
    color: "red",
    range: "0-3 points"
  },
  EDUCATE: {
    title: "EDUCATE Phase", 
    description: "Graded exposure, education, habit change",
    color: "yellow",
    range: "4-7 points"
  },
  REBUILD: {
    title: "REBUILD Phase",
    description: "Higher-load rehab, capacity & performance building",
    color: "green",
    range: "8-11 points"
  }
};

// Clinical Evidence References
export const evidenceBase = {
  painThreshold: {
    reference: "pubmed.ncbi.nlm.nih.gov",
    note: "Mild pain band ≤ 30 mm (≈2/10)"
  },
  disabilityThreshold: {
    reference: "healthcare.msu.edu", 
    note: "≤ 20% = mild disability band"
  },
  functionThreshold: {
    reference: "jospt.org",
    note: "MID ≈ 2 pts; ≥7 shows good function"
  },
  confidenceThreshold: {
    reference: "pmc.ncbi.nlm.nih.gov",
    note: "High self-efficacy drives adherence"
  }
}; 