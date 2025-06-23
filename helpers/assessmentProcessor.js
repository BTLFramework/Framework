// Assessment Form Processor
// Implements the correct Signature Recovery Score™ logic from Back to Life intake forms

export const processIntakeForm = (formData, previousValues = null) => {
  // Calculate Signature Recovery Score (SRS) based on correct methodology
  const calculateSRS = (formData, previousValues) => {
    let score = 0;
    
    // For initial intake, we establish baseline - no points awarded yet
    if (!previousValues) {
      return 0; // Initial intake establishes baseline only
    }
    
    // VAS reduction ≥ 2 points (+1 point)
    if (previousValues.vas - Number(formData.vas) >= 2) {
      score += 1;
    }
    
    // PSFS improvement ≥ 4 points combined (+2 points)
    const prevPSFSSum = previousValues.psfs.reduce((a, b) => a + b, 0);
    const currPSFSSum = formData.psfs.reduce((sum, item) => sum + (item.score || 0), 0);
    if (currPSFSSum - prevPSFSSum >= 4) {
      score += 2;
    }
    
    // Disability Index improvement ≥ 10% (+1 point)
    if (previousValues.disabilityIndex - formData.disabilityPercentage >= 10) {
      score += 1;
    }
    
    // Confidence increase ≥ 3 points (+2 points)
    if (Number(formData.confidence) - previousValues.confidence >= 3) {
      score += 2;
    }
    
    // Beliefs resolved - "None of these apply" (+1 point)
    if (formData.beliefs.includes("None of these apply")) {
      score += 1;
    }
    
    // GROC ≥ +5 (Follow-up only) (+1 point)
    if (formData.formType === "Follow-Up" && Number(formData.groc) >= 5) {
      score += 1;
    }
    
    // Recovery Milestone (manual clinical assessment) (+1 point)
    if (formData.recoveryMilestone) {
      score += 1;
    }
    
    // Clinical Progress Verified (+1 point)
    if (formData.clinicalProgressVerified) {
      score += 1;
    }
    
    // Cap at 11
    return Math.min(score, 11);
  };

  // Determine recovery phase based on correct SRS scoring
  const getPhaseByScore = (score) => {
    if (score <= 3) return "RESET";
    if (score <= 6) return "EDUCATE"; 
    return "REBUILD";
  };

  // Calculate Disability Index based on region and responses
  const calculateDisabilityIndex = (formData) => {
    const region = formData.region?.toLowerCase();
    let baseScore = 0;
    
    // Use appropriate disability index based on region
    if (region?.includes('neck') || region?.includes('cervical')) {
      // NDI calculation
      baseScore = formData.ndi?.reduce((sum, score) => sum + score, 0) * 2; // NDI is out of 100
    } else if (region?.includes('back') || region?.includes('lumbar')) {
      // ODI calculation  
      baseScore = formData.odi?.reduce((sum, score) => sum + score, 0) * 2; // ODI is out of 100
    } else if (region?.includes('upper')) {
      // ULFI calculation
      baseScore = formData.ulfi?.reduce((sum, score) => sum + score, 0) * 4; // ULFI scoring
    } else if (region?.includes('lower')) {
      // LEFS calculation
      baseScore = 80 - formData.lefs?.reduce((sum, score) => sum + score, 0); // LEFS is reverse scored
    }
    
    return Math.min(100, Math.max(0, Math.round(baseScore)));
  };

  // Generate phase-specific cognitive reframing messages
  const getPhaseMessage = (phase, formData, isBaseline = false) => {
    const baseMessages = {
      RESET: {
        title: "RESET Phase - Building Your Foundation",
        message: isBaseline 
          ? "You're establishing your recovery baseline. This phase focuses on understanding your pain patterns and building awareness of your body's signals. Every recovery journey starts with this crucial foundation."
          : "You're progressing through the RESET phase. Your improvements in pain understanding and functional awareness are building the foundation for lasting recovery.",
        focus: "Pain education, movement awareness, and establishing healthy patterns",
        encouragement: isBaseline 
          ? "Your detailed responses show you're ready to begin this recovery process with clarity and commitment."
          : "Your progress shows you're building the essential foundation needed for the next phase."
      },
      EDUCATE: {
        title: "EDUCATE Phase - Understanding Your Recovery",
        message: "You're in the EDUCATE phase - actively learning about your condition and mastering recovery techniques. Your confidence and functional improvements show you're ready to take more control of your recovery.",
        focus: "Movement education, confidence building, and skill development",
        encouragement: "Your growing confidence and understanding are excellent indicators for continued progress."
      },
      REBUILD: {
        title: "REBUILD Phase - Returning to Life",
        message: "You're in the REBUILD phase - actively strengthening and returning to the activities you love. Your assessment reflects significant progress and readiness for advanced recovery strategies.",
        focus: "Strength building, activity integration, and long-term maintenance",
        encouragement: "Your high scores reflect your readiness to rebuild and sustain your recovery gains."
      }
    };
    
    return baseMessages[phase] || baseMessages.RESET;
  };

  // Generate personalized insights based on form responses and scoring
  const generateInsights = (formData, phase, srsScore, isBaseline = false) => {
    const insights = [];
    
    if (isBaseline) {
      // Initial intake insights
      if (formData.vas > 6) {
        insights.push("Your pain levels indicate this is an ideal time to focus on pain education and management strategies.");
      }
      
      if (formData.confidence < 5) {
        insights.push("Building confidence will be a key focus area. Small, consistent wins will help develop your recovery confidence.");
      }
      
      if (formData.beliefs.some(belief => belief.includes("chronic") || belief.includes("permanent"))) {
        insights.push("Addressing pain beliefs through education can significantly impact your recovery trajectory.");
      }
    } else {
      // Follow-up insights based on improvements
      if (srsScore >= 2) {
        insights.push("Your improvement in multiple areas shows excellent engagement with the recovery process.");
      }
      
      if (formData.confidence >= 7) {
        insights.push("Your high confidence level is a strong predictor of continued success in recovery.");
      }
      
      if (phase === "REBUILD") {
        insights.push("You're ready for advanced recovery strategies and return-to-activity planning.");
      }
    }
    
    return insights;
  };

  // Process the form data
  const submissionDate = new Date();
  const followUpDate = new Date(submissionDate);
  followUpDate.setDate(submissionDate.getDate() + 28); // 4 weeks

  const srsScore = calculateSRS(formData, previousValues);
  const disabilityIndex = calculateDisabilityIndex(formData);
  const phase = getPhaseByScore(srsScore);
  const isBaseline = !previousValues;
  const phaseInfo = getPhaseMessage(phase, formData, isBaseline);
  const insights = generateInsights(formData, phase, srsScore, isBaseline);

  return {
    scores: {
      srs: `${srsScore}/11`,
      disabilityIndex: `${disabilityIndex}%`,
      phase: phase,
      vas: formData.vas,
      confidence: formData.confidence,
      psfsTotal: formData.psfs?.reduce((sum, item) => sum + (item.score || 0), 0) || 0
    },
    phaseInfo: phaseInfo,
    insights: insights,
    formData: formData,
    isBaseline: isBaseline,
    assessmentDate: submissionDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    }),
    followUpDate: followUpDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  };
};

// Helper function to simulate dual portal data flow
export const simulateDualPortalSubmission = (intakeFormData, previousAssessment = null) => {
  console.log("Processing intake form for dual portal submission...");
  
  // Extract previous values if this is a follow-up
  const previousValues = previousAssessment ? {
    vas: previousAssessment.scores.vas,
    psfs: previousAssessment.formData.psfs || [],
    confidence: previousAssessment.scores.confidence,
    disabilityIndex: parseFloat(previousAssessment.scores.disabilityIndex)
  } : null;
  
  const processedData = processIntakeForm(intakeFormData, previousValues);
  
  console.log("Dual Portal Results:", {
    SRS: processedData.scores.srs,
    DisabilityIndex: processedData.scores.disabilityIndex,
    Phase: processedData.scores.phase,
    IsBaseline: processedData.isBaseline,
    ClinicalReview: processedData.isBaseline ? "Initial Assessment Complete" : "Progress Review Required"
  });
  
  return {
    patientPortalData: processedData,
    clinicianPortalData: {
      ...processedData,
      clinicalFlags: {
        requiresReview: !processedData.isBaseline && processedData.scores.srs.split('/')[0] >= 7,
        milestoneEligible: processedData.scores.srs.split('/')[0] >= 9,
        phaseTransition: processedData.isBaseline ? false : true
      }
    }
  };
};

// Function to update assessment data with correct scoring
export const updateAssessmentData = (currentAssessments, newFormData) => {
  // Find previous assessment for comparison
  const previousAssessment = currentAssessments.find(a => a.status === "completed" && a.id !== "initial-intake");
  
  const { patientPortalData } = simulateDualPortalSubmission(newFormData, previousAssessment);
  
  // Update or create the assessment
  const updatedAssessments = currentAssessments.map(assessment => {
    if (assessment.id === "initial-intake" || (assessment.status === "due" && assessment.title.includes("Reassessment"))) {
      return {
        ...assessment,
        status: "completed",
        date: patientPortalData.assessmentDate,
        scores: patientPortalData.scores,
        formData: patientPortalData.formData,
        phaseInfo: patientPortalData.phaseInfo,
        insights: patientPortalData.insights,
        isBaseline: patientPortalData.isBaseline
      };
    }
    return assessment;
  });
  
  return updatedAssessments;
}; 