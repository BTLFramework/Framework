// Assessment Form Processor
// Automatically processes intake form data and generates assessment results

export const processIntakeForm = (formData) => {
  // Calculate Signature Recovery Score (SRS) based on form responses
  const calculateSRS = (formData) => {
    let score = 0;
    
    // Pain scale contribution (0-4 points)
    const painScore = Math.max(0, 10 - formData.painScale.averagePain);
    score += (painScore / 10) * 4;
    
    // Confidence contribution (0-3 points)
    score += (formData.confidence.confidenceLevel / 10) * 3;
    
    // Daily activities contribution (0-2 points)
    const activityLevels = {
      "Severe": 0,
      "Moderate": 1,
      "Mild": 1.5,
      "Minimal": 2
    };
    score += activityLevels[formData.dailyActivities.difficultyLevel] || 1;
    
    // Beliefs contribution (0-2 points)
    const positiveBeliefs = [
      formData.beliefs.painUnderstanding.includes("stress") || formData.beliefs.painUnderstanding.includes("posture"),
      formData.beliefs.recoveryExpectations.includes("hope") || formData.beliefs.recoveryExpectations.includes("normal"),
      formData.confidence.readinessForChange.includes("ready") || formData.confidence.readinessForChange.includes("try")
    ];
    score += (positiveBeliefs.filter(Boolean).length / 3) * 2;
    
    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  // Calculate Neck Disability Index (NDI) based on daily activities
  const calculateNDI = (formData) => {
    const activityImpact = {
      "Severe": 80,
      "Moderate": 50,
      "Mild": 30,
      "Minimal": 15
    };
    
    let baseScore = activityImpact[formData.dailyActivities.difficultyLevel] || 50;
    
    // Adjust based on number of affected activities
    const activityCount = formData.dailyActivities.affectedActivities.length;
    if (activityCount >= 5) baseScore += 20;
    else if (activityCount >= 3) baseScore += 10;
    
    return Math.min(100, Math.round(baseScore));
  };

  // Determine recovery phase based on scores and responses
  const determinePhase = (srs) => {
    if (srs <= 3) {
      return "RESET";
    } else if (srs <= 7) {
      return "REBUILD";
    } else {
      return "RESTORE";
    }
  };

  // Generate phase-specific cognitive reframing messages
  const getPhaseMessage = (phase, formData) => {
    const baseMessages = {
      RESET: {
        title: "Foundation Phase",
        message: "You're in the RESET phase - this is your foundation for recovery. Your current pain levels and limitations are normal starting points. Focus on understanding your pain patterns and building awareness of your body's signals.",
        focus: "Education, pain understanding, and establishing baseline function",
        encouragement: "Every recovery journey starts with awareness. Your detailed responses show you're ready to begin this process."
      },
      REBUILD: {
        title: "Strengthening Phase", 
        message: "You're in the REBUILD phase - you're actively strengthening and retraining your body. Your confidence level and readiness for change are excellent indicators for this phase. Each assessment will show your progress in rebuilding function.",
        focus: "Progressive strengthening, movement retraining, and confidence building",
        encouragement: "Your confidence score of " + formData.confidence.confidenceLevel + "/10 shows you're well-positioned for this phase."
      },
      RESTORE: {
        title: "Return to Life Phase",
        message: "You're in the RESTORE phase - you're returning to the activities you love. Your assessment reflects growing confidence and capability. This phase focuses on integrating your recovery into daily life.",
        focus: "Activity integration, lifestyle optimization, and long-term maintenance",
        encouragement: "You're ready to return to meaningful activities with your new understanding of pain and recovery."
      }
    };
    
    return baseMessages[phase] || baseMessages.RESET;
  };

  // Generate personalized insights based on form responses
  const generateInsights = (formData, phase) => {
    const insights = [];
    
    // Pain insights
    if (formData.painScale.averagePain > 6) {
      insights.push("Your pain levels indicate this is a good time to focus on pain education and management strategies.");
    }
    
    // Activity insights
    if (formData.dailyActivities.affectedActivities.includes("Sleeping")) {
      insights.push("Sleep disruption is common and can be addressed through positioning and relaxation techniques.");
    }
    
    // Belief insights
    if (formData.beliefs.concerns.includes("chronic")) {
      insights.push("Your concerns about chronic pain are valid, but education can help reframe these thoughts.");
    }
    
    // Confidence insights
    if (formData.confidence.confidenceLevel >= 7) {
      insights.push("Your high confidence level is a strong predictor of successful recovery.");
    }
    
    return insights;
  };

  // Process the form data
  const submissionDate = new Date();
  const followUpDate = new Date(submissionDate);
  followUpDate.setDate(submissionDate.getDate() + 28); // 4 weeks

  const srs = calculateSRS(formData);
  const ndi = calculateNDI(formData);
  const phase = determinePhase(srs);
  const phaseInfo = getPhaseMessage(phase, formData);
  const insights = generateInsights(formData, phase);

  return {
    scores: {
      srs: `${srs}/11`,
      ndi: `${ndi}%`,
      phase: phase
    },
    phaseInfo: phaseInfo,
    insights: insights,
    formData: formData,
    assessmentDate: submissionDate.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric' 
    }),
    followUpDate: followUpDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    })
  };
};

// Helper function to update assessment data
export const updateAssessmentData = (currentAssessments, newFormData) => {
  const processedData = processIntakeForm(newFormData);
  
  // Find and update the initial intake form
  const updatedAssessments = currentAssessments.map(assessment => {
    if (assessment.id === "initial-intake") {
      return {
        ...assessment,
        status: "completed",
        date: processedData.assessmentDate,
        scores: processedData.scores,
        formData: processedData.formData,
        phaseInfo: processedData.phaseInfo,
        insights: processedData.insights
      };
    }
    return assessment;
  });
  
  return updatedAssessments;
};

// Demo function to show how different form responses affect the assessment
export const demoAssessmentVariations = () => {
  // RESET Phase Example (High pain, low confidence)
  const resetPhaseData = {
    patientInfo: { name: "John Doe", age: "45", gender: "Male", occupation: "Construction Worker" },
    painRegion: { primaryRegion: "Lower Back", secondaryRegions: ["Hips"], painPattern: "Severe and constant" },
    painScale: { currentPain: 9, worstPain: 10, averagePain: 8, painDescription: "Debilitating pain that prevents most activities" },
    dailyActivities: { difficultyLevel: "Severe", affectedActivities: ["Walking", "Standing", "Sitting", "Sleeping", "Work"], limitations: "Unable to work or perform daily tasks" },
    beliefs: { painUnderstanding: "I think I have a serious injury", recoveryExpectations: "I'm not sure if I'll ever get better", concerns: "Very worried about permanent damage" },
    confidence: { confidenceLevel: 2, readinessForChange: "Desperate for any help", goals: "Just want the pain to stop" }
  };

  // REBUILD Phase Example (Moderate pain, good confidence)
  const rebuildPhaseData = {
    patientInfo: { name: "Sarah Johnson", age: "34", gender: "Female", occupation: "Office Manager" },
    painRegion: { primaryRegion: "Neck", secondaryRegions: ["Shoulders", "Upper Back"], painPattern: "Constant with flare-ups" },
    painScale: { currentPain: 6, worstPain: 8, averagePain: 5, painDescription: "Sharp, burning pain that radiates to shoulders" },
    dailyActivities: { difficultyLevel: "Moderate", affectedActivities: ["Driving", "Computer work", "Sleeping"], limitations: "Difficulty turning head, trouble sleeping on affected side" },
    beliefs: { painUnderstanding: "I think it's from poor posture and stress", recoveryExpectations: "I hope to return to normal activities without pain", concerns: "Worried about long-term damage and chronic pain" },
    confidence: { confidenceLevel: 7, readinessForChange: "Very ready to try new approaches", goals: "Return to yoga, improve sleep quality, reduce pain medications" }
  };

  // RESTORE Phase Example (Low pain, high confidence)
  const restorePhaseData = {
    patientInfo: { name: "Maria Garcia", age: "28", gender: "Female", occupation: "Yoga Instructor" },
    painRegion: { primaryRegion: "Shoulder", secondaryRegions: [], painPattern: "Occasional with movement" },
    painScale: { currentPain: 2, worstPain: 4, averagePain: 2, painDescription: "Mild discomfort during certain movements" },
    dailyActivities: { difficultyLevel: "Minimal", affectedActivities: ["Overhead movements"], limitations: "Slight limitation with overhead activities" },
    beliefs: { painUnderstanding: "I understand this is part of my recovery process", recoveryExpectations: "I'm confident I'll return to full function", concerns: "Minor concerns about returning to teaching" },
    confidence: { confidenceLevel: 9, readinessForChange: "Excited to continue my recovery journey", goals: "Return to teaching full yoga classes and advanced poses" }
  };

  return {
    reset: processIntakeForm(resetPhaseData),
    rebuild: processIntakeForm(rebuildPhaseData),
    restore: processIntakeForm(restorePhaseData)
  };
};

// Function to simulate form submission and update assessment
export const simulateFormSubmission = (formData, currentAssessments) => {
  console.log("Processing new form submission...");
  
  const processedData = processIntakeForm(formData);
  
  console.log("Assessment Results:", {
    SRS: processedData.scores.srs,
    NDI: processedData.scores.ndi,
    Phase: processedData.scores.phase,
    PhaseTitle: processedData.phaseInfo.title,
    Insights: processedData.insights
  });
  
  // Update the assessment data
  const updatedAssessments = updateAssessmentData(currentAssessments, formData);
  
  return {
    processedData,
    updatedAssessments
  };
}; 