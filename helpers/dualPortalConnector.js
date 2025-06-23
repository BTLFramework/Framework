// Dual Portal Connector
// Connects existing MultiStepForm intake system to dual portal data processing

import { simulateDualPortalSubmission } from './assessmentProcessor';

// Transform MultiStepForm data to our processing format
export const transformIntakeFormData = (multiStepFormData) => {
  return {
    // Patient Information
    patientName: multiStepFormData.patientName,
    email: multiStepFormData.email || `${multiStepFormData.patientName.toLowerCase().replace(' ', '.')}@patient.com`,
    date: multiStepFormData.date,
    formType: multiStepFormData.formType,
    
    // Pain Region & Disability Index
    region: multiStepFormData.region,
    ndi: multiStepFormData.ndi,
    odi: multiStepFormData.odi,
    ulfi: multiStepFormData.ulfi,
    lefs: multiStepFormData.lefs,
    disabilityPercentage: multiStepFormData.disabilityPercentage,
    
    // Pain and Function Measures
    vas: multiStepFormData.vas,
    psfs: multiStepFormData.psfs,
    
    // Cognitive and Confidence Measures
    beliefs: multiStepFormData.beliefs,
    confidence: multiStepFormData.confidence,
    
    // Follow-up specific
    groc: multiStepFormData.groc || 0,
    
    // Clinical verification (if provided)
    recoveryMilestone: multiStepFormData.recoveryMilestone || false,
    clinicalProgressVerified: multiStepFormData.clinicalProgressVerified || false
  };
};

// Process intake form submission for dual portal population
export const processIntakeSubmission = async (multiStepFormData, previousAssessment = null) => {
  console.log("🔄 Processing intake form for dual portal submission...");
  
  // Transform the form data
  const transformedData = transformIntakeFormData(multiStepFormData);
  
  // Process through our dual portal system
  const result = simulateDualPortalSubmission(transformedData, previousAssessment);
  
  // Prepare data for both portals
  const dualPortalData = {
    // Patient Portal Data (what patient sees)
    patientPortal: {
      assessmentResults: result.patientPortalData,
      personalizedContent: {
        phaseSpecificTasks: getPhaseSpecificTasks(result.patientPortalData.scores.phase),
        recoveryToolkit: getPhaseSpecificToolkit(result.patientPortalData.scores.phase),
        cognitiveReframing: result.patientPortalData.phaseInfo
      }
    },
    
    // Clinician Portal Data (what provider sees)
    clinicianPortal: {
      patientOverview: {
        name: transformedData.patientName,
        email: transformedData.email,
        submissionDate: result.patientPortalData.assessmentDate,
        srsScore: result.patientPortalData.scores.srs,
        phase: result.patientPortalData.scores.phase,
        disabilityIndex: result.patientPortalData.scores.disabilityIndex
      },
      clinicalFlags: result.clinicianPortalData.clinicalFlags,
      detailedAssessment: {
        painScore: transformedData.vas,
        confidenceLevel: transformedData.confidence,
        functionalLimitations: transformedData.psfs,
        beliefFlags: transformedData.beliefs,
        phaseRecommendations: getPhaseRecommendations(result.patientPortalData.scores.phase)
      },
      actionItems: generateActionItems(result.clinicianPortalData.clinicalFlags, result.patientPortalData.scores)
    }
  };
  
  console.log("✅ Dual portal data prepared:", {
    PatientPhase: result.patientPortalData.scores.phase,
    SRS_Score: result.patientPortalData.scores.srs,
    ClinicalReview: result.clinicianPortalData.clinicalFlags.requiresReview ? "Required" : "Not Required",
    ActionItems: dualPortalData.clinicianPortal.actionItems.length
  });
  
  return dualPortalData;
};

// Generate phase-specific tasks for patient portal
const getPhaseSpecificTasks = (phase) => {
  const tasksByPhase = {
    RESET: [
      { title: "Pain Education Module", type: "education", duration: "10 min" },
      { title: "Gentle Movement Exercises", type: "exercise", duration: "15 min" },
      { title: "Breathing & Relaxation", type: "wellness", duration: "5 min" }
    ],
    EDUCATE: [
      { title: "Movement Retraining", type: "exercise", duration: "20 min" },
      { title: "Confidence Building Activities", type: "psychology", duration: "10 min" },
      { title: "Pain Science Learning", type: "education", duration: "15 min" }
    ],
    REBUILD: [
      { title: "Strength Training Program", type: "exercise", duration: "30 min" },
      { title: "Return to Activity Planning", type: "planning", duration: "15 min" },
      { title: "Maintenance Strategies", type: "education", duration: "10 min" }
    ]
  };
  
  return tasksByPhase[phase] || tasksByPhase.RESET;
};

// Generate phase-specific toolkit for patient portal
const getPhaseSpecificToolkit = (phase) => {
  const toolkitByPhase = {
    RESET: [
      { title: "Pain Tracking Journal", category: "monitoring" },
      { title: "Sleep Hygiene Guide", category: "wellness" },
      { title: "Stress Management Tools", category: "psychology" }
    ],
    EDUCATE: [
      { title: "Movement Quality Videos", category: "exercise" },
      { title: "Confidence Tracker", category: "psychology" },
      { title: "Activity Pacing Guide", category: "planning" }
    ],
    REBUILD: [
      { title: "Progressive Exercise Library", category: "exercise" },
      { title: "Return to Work Planner", category: "planning" },
      { title: "Long-term Maintenance Plan", category: "education" }
    ]
  };
  
  return toolkitByPhase[phase] || toolkitByPhase.RESET;
};

// Generate phase recommendations for clinician portal
const getPhaseRecommendations = (phase) => {
  const recommendations = {
    RESET: [
      "Focus on pain education and reassurance",
      "Gentle movement and postural awareness",
      "Address catastrophic thinking patterns",
      "Establish trust and rapport"
    ],
    EDUCATE: [
      "Progressive movement education",
      "Confidence building through graded exposure", 
      "Functional movement training",
      "Monitor progress and adjust approach"
    ],
    REBUILD: [
      "Advanced strengthening protocols",
      "Return to activity planning",
      "Maintenance strategy development",
      "Discharge planning considerations"
    ]
  };
  
  return recommendations[phase] || recommendations.RESET;
};

// Generate action items for clinician portal
const generateActionItems = (clinicalFlags, scores) => {
  const actionItems = [];
  
  if (clinicalFlags.requiresReview) {
    actionItems.push({
      priority: "high",
      action: "Schedule progress review appointment",
      reason: "Patient has reached significant improvement milestone"
    });
  }
  
  if (clinicalFlags.milestoneEligible) {
    actionItems.push({
      priority: "medium", 
      action: "Verify recovery milestone achievement",
      reason: "SRS score indicates potential milestone completion"
    });
  }
  
  if (clinicalFlags.phaseTransition) {
    actionItems.push({
      priority: "medium",
      action: "Update treatment plan for phase progression",
      reason: "Patient may be ready for next phase interventions"
    });
  }
  
  const srsValue = parseInt(scores.srs.split('/')[0]);
  if (srsValue >= 9) {
    actionItems.push({
      priority: "high",
      action: "Consider discharge planning",
      reason: "Patient approaching graduation criteria"
    });
  }
  
  return actionItems;
};

// API submission function that would connect to your server
export const submitToDualPortal = async (multiStepFormData, previousAssessment = null) => {
  try {
    const dualPortalData = await processIntakeSubmission(multiStepFormData, previousAssessment);
    
    // Here you would make actual API calls to:
    // 1. Update patient portal with new assessment
    // 2. Update clinician dashboard with new patient data
    // 3. Send notifications as needed
    
    // For now, we'll simulate API calls
    console.log("📡 Simulating API submissions...");
    
    // Simulate patient portal update
    await simulatePatientPortalUpdate(dualPortalData.patientPortal);
    
    // Simulate clinician portal update  
    await simulateClinicianPortalUpdate(dualPortalData.clinicianPortal);
    
    return {
      success: true,
      patientPortalUrl: `/patient-portal/${dualPortalData.clinicianPortal.patientOverview.email}`,
      clinicianDashboardUrl: `/clinician-dashboard`,
      data: dualPortalData
    };
    
  } catch (error) {
    console.error("❌ Error submitting to dual portal:", error);
    throw error;
  }
};

// Simulate patient portal update
const simulatePatientPortalUpdate = async (patientData) => {
  console.log("🔄 Updating patient portal...");
  // In real implementation: POST to patient portal API
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Simulate clinician portal update  
const simulateClinicianPortalUpdate = async (clinicianData) => {
  console.log("🔄 Updating clinician dashboard...");
  // In real implementation: POST to clinician dashboard API
  return new Promise(resolve => setTimeout(resolve, 500));
};

// Integration helper for MultiStepForm component
export const enhanceMultiStepForm = (originalSubmitHandler) => {
  return async (formData) => {
    try {
      // Run original submit logic
      const originalResult = await originalSubmitHandler(formData);
      
      // Process through dual portal system
      const dualPortalResult = await submitToDualPortal(formData);
      
      return {
        ...originalResult,
        dualPortalData: dualPortalResult.data,
        patientPortalUrl: dualPortalResult.patientPortalUrl,
        clinicianDashboardUrl: dualPortalResult.clinicianDashboardUrl
      };
      
    } catch (error) {
      console.error("❌ Enhanced form submission failed:", error);
      throw error;
    }
  };
}; 