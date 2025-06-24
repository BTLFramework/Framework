/**
 * Signature Recovery Score™ (SRS) Calculation Logic
 * 
 * This module contains the comprehensive algorithm for calculating
 * the SRS based on multiple assessment factors.
 */

/**
 * Calculate the Signature Recovery Score™ (SRS)
 * @param {Object} data - Assessment data
 * @param {number} data.disabilityPercentage - Disability index percentage (0-100)
 * @param {number} data.vas - Visual Analog Scale pain score (0-10)
 * @param {Array} data.psfs - Patient Specific Functional Scale activities
 * @param {Array} data.beliefs - Negative beliefs array
 * @param {number} data.confidence - Confidence level (0-10)
 * @param {number} data.groc - Global Rating of Change (-5 to +5)
 * @returns {number} SRS score (0-11)
 */
function calculateSRS({ disabilityPercentage, vas, psfs, beliefs, confidence, groc }) {
  let srsScore = 11; // Start with perfect score

  // 1. Disability Index Impact (0-3 point reduction)
  if (disabilityPercentage >= 80) {
    srsScore -= 3; // Severe disability
  } else if (disabilityPercentage >= 60) {
    srsScore -= 2; // Moderate disability
  } else if (disabilityPercentage >= 40) {
    srsScore -= 1; // Mild disability
  }
  // No reduction for <40% disability

  // 2. Pain Level Impact (0-3 point reduction)
  if (vas >= 8) {
    srsScore -= 3; // Severe pain
  } else if (vas >= 6) {
    srsScore -= 2; // Moderate pain
  } else if (vas >= 4) {
    srsScore -= 1; // Mild pain
  }
  // No reduction for <4 pain

  // 3. Functional Capacity Impact (0-2 point reduction)
  if (psfs && psfs.length > 0) {
    const avgPSFS = psfs.reduce((sum, item) => sum + (item.score || 0), 0) / psfs.length;
    if (avgPSFS <= 3) {
      srsScore -= 2; // Poor function
    } else if (avgPSFS <= 6) {
      srsScore -= 1; // Moderate function
    }
    // No reduction for >6 average function
  }

  // 4. Confidence Impact (0-2 point reduction)
  if (confidence <= 3) {
    srsScore -= 2; // Very low confidence
  } else if (confidence <= 6) {
    srsScore -= 1; // Low confidence
  }
  // No reduction for >6 confidence

  // 5. Negative Beliefs Impact (0-1 point reduction)
  if (beliefs && beliefs.length >= 2) {
    srsScore -= 1; // Multiple negative beliefs
  }

  // 6. Global Rating of Change (Follow-up assessments only)
  if (groc !== undefined && groc !== null && groc !== 0) {
    if (groc <= -3) {
      srsScore -= 2; // Much worse
    } else if (groc <= -1) {
      srsScore -= 1; // Somewhat worse
    } else if (groc >= 3) {
      srsScore += 1; // Much better (bonus point)
    }
    // No change for slight improvements or no change
  }

  // Ensure score stays within bounds (0-11)
  srsScore = Math.max(0, Math.min(11, srsScore));

  return srsScore;
}

/**
 * Get phase classification based on SRS score
 * @param {number} srsScore - SRS score (0-11)
 * @returns {Object} Phase information
 */
function getPhaseByScore(srsScore) {
  if (srsScore >= 8) {
    return { 
      label: "REBUILD", 
      color: "green",
      description: "Focus on building strength and returning to activities"
    };
  }
  if (srsScore >= 5) {
    return { 
      label: "EDUCATE", 
      color: "yellow",
      description: "Learn about pain science and movement strategies"
    };
  }
  return { 
    label: "RESET", 
    color: "red",
    description: "Address pain, fear, and basic movement patterns"
  };
}

/**
 * Calculate disability percentage from disability index scores
 * @param {Array} scores - Array of disability index scores
 * @param {string} indexType - Type of disability index (NDI, ODI, ULFI, LEFS)
 * @returns {number} Disability percentage (0-100)
 */
function calculateDisabilityPercentage(scores, indexType) {
  if (!scores || !Array.isArray(scores) || scores.length === 0) {
    return 0;
  }

  const total = scores.reduce((sum, score) => sum + (score || 0), 0);
  
  // Maximum scores for each index type
  const maxScores = {
    'NDI': 50,   // Neck Disability Index
    'ODI': 50,   // Oswestry Disability Index
    'ULFI': 120, // Upper Limb Functional Index
    'LEFS': 80   // Lower Extremity Functional Scale
  };

  const maxScore = maxScores[indexType] || 50; // Default to 50
  return Math.round((total / maxScore) * 100);
}

/**
 * Validate assessment data for SRS calculation
 * @param {Object} data - Assessment data to validate
 * @returns {Object} Validation result with isValid and errors
 */
function validateAssessmentData(data) {
  const errors = [];
  
  if (data.vas === undefined || data.vas < 0 || data.vas > 10) {
    errors.push('VAS score must be between 0 and 10');
  }
  
  if (data.confidence === undefined || data.confidence < 0 || data.confidence > 10) {
    errors.push('Confidence score must be between 0 and 10');
  }
  
  if (data.disabilityPercentage === undefined || data.disabilityPercentage < 0 || data.disabilityPercentage > 100) {
    errors.push('Disability percentage must be between 0 and 100');
  }
  
  if (data.groc !== undefined && (data.groc < -5 || data.groc > 5)) {
    errors.push('GROC score must be between -5 and +5');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

module.exports = {
  calculateSRS,
  getPhaseByScore,
  calculateDisabilityPercentage,
  validateAssessmentData
}; 