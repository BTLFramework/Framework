import React, { useState, useEffect } from "react";
import Stepper from "./Stepper";
import PhaseFlow from "./PhaseFlow";
import SRSDisplay from "./SRSDisplay";
import { computeBaselineSRS, getPhaseByScore } from "../helpers/scoreLogic";

// Import each step
import PatientInfo from "./steps/PatientInfo";
import PainRegion from "./steps/PainRegion";
import PainScale from "./steps/PainScale";
import DailyActivities from "./steps/DailyActivities";
import Confidence from "./steps/Confidence";
import PCS4 from "./steps/PCS4";
import TSK11 from "./steps/TSK11";
import GROC from "./steps/GROC";
import ClinicianInput from './steps/ClinicianInput';

// Recovery Score Wheel Component
const RecoveryScoreWheel = ({ score, maxScore, phase }) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const percentage = (animatedScore / maxScore) * 100;
  const circumference = 2 * Math.PI * 90;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getScoreStatus = () => {
    if (score >= 9) return { text: "Graduation Ready!", color: "text-emerald-600" };
    if (score >= 7) return { text: "REBUILD Ready", color: "text-blue-600" };
    if (score >= 4) return { text: "Making Progress", color: "text-blue-500" };
    return { text: "Getting Started", color: "text-gray-600" };
  };

  const status = getScoreStatus();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#155e75" />
              <stop offset="20%" stopColor="#0891b2" />
              <stop offset="40%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-4xl font-bold text-gray-900 mb-1">{animatedScore}</div>
          <div className="text-lg text-gray-600 mb-2">/ {maxScore}</div>
          <div className={`text-sm font-medium ${status.color}`}>{status.text}</div>
        </div>
      </div>

      <div className="flex items-center justify-center w-full max-w-xs mt-6 space-x-2">
        <span className="text-xs text-gray-500">0</span>
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{ 
              width: `${percentage}%`,
              background: 'linear-gradient(135deg, #155e75 0%, #0891b2 20%, #06b6d4 40%, #22d3ee 70%, #67e8f9 100%)'
            }}
          ></div>
        </div>
        <span className="text-xs text-gray-500">11</span>
      </div>
    </div>
  );
};

// Helper functions for phase styling
const getPhaseStyles = (phase) => {
  const styles = {
    "RESET": { 
      textColor: "text-slate-700",
      bgColor: "bg-gradient-to-br from-slate-50 to-slate-100",
      borderColor: "border-slate-300"
    },
    "EDUCATE": { 
      textColor: "text-cyan-700",
      bgColor: "bg-gradient-to-br from-cyan-50 to-cyan-100",
      borderColor: "border-cyan-300"
    },
    "REBUILD": { 
      textColor: "text-blue-700",
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-300"
    }
  };
  return styles[phase] || styles["RESET"];
};

const getPhaseDescription = (phase) => {
  const descriptions = {
    "RESET": "Calm. Decompress. Stabilize. Evidence-based chiropractic care and targeted decompression techniques restore space for safe, efficient movement.",
    "EDUCATE": "Retrain. Rebuild Trust. Restore Confidence. We restore trust in movement by rebuilding strong, sustainable patterns — using education, reinforcement, and graded progression.",
    "REBUILD": "Strengthen. Sustain. Thrive. Functional integration, strength progression, and resilience training — built to last beyond the clinic."
  };
  return descriptions[phase] || descriptions["RESET"];
};

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(0);
  const [resultPhase, setResultPhase] = useState({ label: "", color: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Initial form data factory function
  const getInitialFormData = () => ({
    patientName: "",
    email: "", // Add email field
    dob: "", // Date of Birth
    date: new Date().toISOString().split("T")[0], // Default to today
    formType: "Intake", // "Intake" or "Follow-Up"
    region: "",
    ndi: Array(10).fill(0),
    tdi: Array(10).fill(0), // Thoracic Disability Index
    odi: Array(10).fill(0),
    ulfi: Array(25).fill(0),
    lefs: Array(20).fill(0),
    disabilityPercentage: 0,
    vas: 0,
    psfs: [
      { activity: "", score: 0 },
      { activity: "", score: 0 },
      { activity: "", score: 0 },
    ],
    pcs4: { 1: undefined, 2: undefined, 3: undefined, 4: undefined }, // Initialize with undefined
    tsk11: { 1: undefined, 2: undefined, 3: undefined, 4: undefined, 5: undefined, 6: undefined, 7: undefined, 8: undefined, 9: undefined, 10: undefined, 11: undefined }, // Initialize with undefined
    confidence: 0,
    groc: 0, // Follow‐up only
    beliefs: [], // Initialize beliefs array
  });

  const [formData, setFormData] = useState(getInitialFormData());

  // Steps array changes based on formType
  const steps =
    formData.formType === "Follow-Up"
              ? [
            "Patient Info",
            "Pain & Region",
            "Pain Scale",
            "Daily Activities",
            "Confidence",
            "Pain Beliefs",
            "Fear of Movement",
            "GROC",
          ]
              : [
            "Patient Info",
            "Pain & Region",
            "Pain Scale",
            "Daily Activities",
            "Confidence",
            "Pain Beliefs",
            "Fear of Movement",
          ];

  // Handle simple onChange events for text/select/radio/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Disability‐index fields look like "ndi-3", etc.
    if (
      name.startsWith("ndi-") ||
      name.startsWith("tdi-") ||
      name.startsWith("odi-") ||
      name.startsWith("ulfi-") ||
      name.startsWith("lefs-")
    ) {
      const [key, idx] = name.split("-");
      const arr = [...formData[key]];
      arr[Number(idx)] = Number(value);
      setFormData((prev) => ({ ...prev, [key]: arr }));
      return;
    }

    // "beliefs" is a multi‐checkbox array
    if (type === "checkbox" && name === "beliefs") {
      const newBeliefs = formData.beliefs.includes(value)
        ? formData.beliefs.filter((b) => b !== value)
        : [...formData.beliefs, value];
      setFormData((prev) => ({ ...prev, beliefs: newBeliefs }));
      return;
    }

    // ordinary checkbox
    if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
      return;
    }

    // ordinary text/select/range
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePSFSChange = (index, key, value) => {
    setFormData((prev) => {
      const updated = [...prev.psfs];
      updated[index][key] = value;
      return { ...prev, psfs: updated };
    });
  };

  // Whenever disability index arrays or region change, recalc %:
  useEffect(() => {
    let percentage = 0;
    const { region, ndi, tdi, odi, ulfi, lefs } = formData;

    // Use new region mapping
    if (region === "Neck") {
      const sum = ndi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Mid-Back / Thoracic") {
      const sum = tdi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Low Back / SI Joint") {
      const sum = odi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Shoulder" || region === "Elbow / Forearm" || region === "Wrist / Hand") {
      const sum = ulfi.reduce((a, b) => a + b, 0);
      percentage = (sum / (25 * 4)) * 100;
    } else if (region === "Hip / Groin" || region === "Knee" || region === "Ankle / Foot") {
      const sum = lefs.reduce((a, b) => a + b, 0);
      percentage = (sum / (20 * 4)) * 100;
    } else if (region === "Back") {
      // Backward compatibility
      const sum = odi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Upper Limb") {
      // Backward compatibility
      const sum = ulfi.reduce((a, b) => a + b, 0);
      percentage = (sum / (25 * 4)) * 100;
    } else if (region === "Lower Limb") {
      // Backward compatibility
      const sum = lefs.reduce((a, b) => a + b, 0);
      percentage = (sum / (20 * 4)) * 100;
    }

    if (Math.abs(percentage - formData.disabilityPercentage) > 0.01) {
      setFormData((prev) => ({ ...prev, disabilityPercentage: percentage }));
    }
  }, [
    formData.region,
    formData.ndi,
    formData.tdi,
    formData.odi,
    formData.ulfi,
    formData.lefs,
  ]);

  // Reset form to initial state
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the form? All entered data will be lost.")) {
      setFormData(getInitialFormData());
      setCurrentStep(0);
      setShowResult(false);
      setSubmissionResult(null);
    }
  };

  // Automatically reset form when formType changes or on mount
  useEffect(() => {
    setFormData(getInitialFormData());
    setCurrentStep(0);
    setShowResult(false);
    setSubmissionResult(null);
  }, [formData.formType]);

  // Validation for required fields per step
  const isStepComplete = () => {
    switch (currentStep) {
      case 0: // Patient Info
        return formData.patientName && formData.email && formData.dob && formData.date;
      case 1: // Pain & Region
        return formData.region;
      case 2: // Pain Scale
        return formData.vas !== undefined && formData.vas !== null;
      case 3: // Daily Activities (PSFS)
        return formData.psfs.every(item => item.activity && item.score !== null && item.score !== undefined);
      case 4: // Confidence
        return formData.confidence !== undefined && formData.confidence !== null;
      case 5: // PCS-4
        return [1,2,3,4].every(i => formData.pcs4 && formData.pcs4[i] !== undefined && formData.pcs4[i] !== null);
      case 6: // TSK-11
        return [1,2,3,4,5,6,7,8,9,10,11].every(i => formData.tsk11 && formData.tsk11[i] !== undefined && formData.tsk11[i] !== null);
      default:
        return true;
    }
  };
  const [showStepError, setShowStepError] = useState(false);

  // "Next" / "Back"
  const handleNext = () => {
    if (!isStepComplete()) {
      setShowStepError(true);
      return;
    }
    setShowStepError(false);
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit: calculate SRS, derive phase, show results, AND send to patient portal
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate completion date is not in the future
    if (new Date(formData.date) > new Date()) {
      alert("Form completion date cannot be in the future. Please correct the date before submitting.");
      return;
    }
    
    console.log('🚀 Starting form submission...');
    
    // Use already calculated disability percentage from formData
    const disabilityPercentage = Math.round(formData.disabilityPercentage);
    
    // Calculate SRS using centralized baseline logic
    const srsResult = computeBaselineSRS({
      ...formData,
      disabilityPercentage
    });
    
    console.log('📊 SRS Calculation Result:', srsResult);
    
    // Store the calculated results in formData for the completion screen
    setFormData(prev => ({
      ...prev,
      srsScore: srsResult.score, // Store the numeric score
      phase: srsResult.phase,
      calculatedDisabilityPercentage: disabilityPercentage
    }));
    
    // Prepare submission data
    const submissionData = {
      patientName: formData.patientName,
      email: formData.email,
      dob: formData.dob,
      date: formData.date,
      formType: 'Intake',
      region: formData.region,
      ndi: formData.ndi,
      tdi: formData.tdi, // Include TDI data
      odi: formData.odi,
      ulfi: formData.ulfi,
      lefs: formData.lefs,
      disabilityPercentage,
      vas: formData.vas,
      psfs: formData.psfs,
      pcs4: formData.pcs4, // Include PCS-4 data
      tsk11: formData.tsk11, // Include TSK-11 data
      beliefs: formData.beliefs,
      confidence: formData.confidence,
      groc: 0, // Always 0 for intake
      srsScore: srsResult.formattedScore, // Send as "X/9" format
      phase: srsResult.phase
    };

    setIsSubmitting(true);

    try {
      // Add email if not provided
      const submissionDataWithEmail = {
        ...submissionData,
        email: submissionData.email || `${submissionData.patientName.toLowerCase().replace(' ', '.')}@patient.com`
      };

      // Submit to patient portal API
      console.log('🔄 Submitting to patient portal...', submissionDataWithEmail);
      
      const response = await fetch('http://localhost:3000/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionDataWithEmail)
      });

      const result = await response.json();
      console.log('✅ Patient portal response:', result);
      
      // Store patient data for portal access
      if (result.success) {
        const patientData = {
          name: result.data.patient.name,
          email: result.data.patient.email,
          score: `${result.data.srsScore}/9`, // Format as string for portal compatibility (baseline scoring)
          phase: result.data.phase,
          timestamp: new Date().toISOString()
        };
        console.log('💾 Storing patient data for redirect:', patientData);
        localStorage.setItem('btl_patient_data', JSON.stringify(patientData));
      }
      
      setSubmissionResult(result);
      setShowResult(true);
      
    } catch (error) {
      console.error('❌ Submission error:', error);
      setSubmissionResult({ 
        success: false, 
        error: 'Failed to connect to patient portal',
        details: error.message 
      });
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If "showResult" is true, display the Recovery Results UI with portal integration
  if (showResult) {
    // Get the calculated score and phase from the stored form data or default values
    const displayScore = formData.srsScore || 0;
    const displayPhase = formData.phase || "RESET";
    const maxScore = 11; // Always show out of 11 with locked points system

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Header Section */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-2 shadow-lg back-to-life-gradient">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-2xl md:text-2xl font-bold gradient-text mb-1">Signature Recovery Score™ Complete!</h1>
            <p className="text-blue-900 text-base">Your personalized recovery score has been calculated</p>
          </div>

          {/* Responsive grid: side-by-side on desktop, stacked on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
            {/* Left Column - Score Display */}
            <div className="flex flex-col justify-center items-center w-full max-w-md mx-auto">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Your Recovery Score</h3>
                  <SRSDisplay 
                    score={displayScore} 
                    clinicianAssessed={false} 
                    grocCaptured={false}
                    className="justify-center text-2xl"
                  />
                  <p className="text-gray-600 text-xs mt-2">
                    Intake assessments show 3 locked points until your first clinical visit and follow-up assessment.
                  </p>
                </div>
                <div className="mobile-recovery-wheel">
                  <div style={{ maxWidth: '180px', margin: '0 auto' }}>
                    <RecoveryScoreWheel 
                      score={displayScore} 
                      maxScore={maxScore} 
                      phase={displayPhase}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Portal Button and Next Steps */}
            <div className="flex flex-col justify-start h-full w-full max-w-md mx-auto">
              {/* Create Account Button - updated flow */}
              <div className="mb-3">
                <button 
                  onClick={() => {
                    if (submissionResult?.success) {
                      const patientData = {
                        name: submissionResult.data.patient.name,
                        email: submissionResult.data.patient.email,
                        score: `${submissionResult.data.srsScore}/9`,
                        phase: submissionResult.data.phase,
                        timestamp: new Date().toISOString()
                      };
                      const params = new URLSearchParams({
                        patientData: JSON.stringify(patientData)
                      });
                      window.location.href = `http://localhost:3000/create-account?${params.toString()}`;
                    } else {
                      window.location.href = 'http://localhost:3000';
                    }
                  }}
                  className="w-full btn-primary-gradient text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 hover:shadow-lg text-base"
                >
                  Create Your Portal Account
                </button>
              </div>

              {/* Next Steps and Info */}
              <div className="bg-white rounded-2xl shadow-xl p-5 w-full flex flex-col gap-4">
                <h4 className="font-semibold text-btl-800 mb-2 text-base">Next Steps</h4>
                <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1">
                  <li><span className="font-medium">Review Your Results:</span> See your recovery score and phase. This guides your next steps in the program.</li>
                  <li><span className="font-medium">Create Your Account:</span> Set up your secure portal account with your own password.</li>
                  <li><span className="font-medium">Access Your Portal:</span> Log in to view your recovery plan, daily tasks, and track progress.</li>
                  <li><span className="font-medium">Book Your Appointment:</span> Schedule your first session to begin your personalized treatment plan.</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-xs">
              Questions? Contact us at <a href="mailto:support@backtolife.ca" className="text-blue-600 hover:underline">support@backtolife.ca</a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the multi‐step form
  return (
    <div className="btl-form-container">
      <div className="max-w-5xl mx-auto px-4 py-8 md:px-4 md:py-8">
        {/* Header */}
        <div className="btl-form-header rounded-t-2xl px-8 py-6 mb-0">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl md:text-3xl font-bold text-white mb-2">
                Signature Recovery Score™ Assessment
              </h1>
              <p className="text-blue-100 text-lg md:text-lg">
                Complete your assessment to calculate your personalized recovery score
              </p>
            </div>
            <button
              type="button"
              onClick={handleReset}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Reset</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white px-8 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-600">
              Step {currentStep + 1} of {steps.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              {Math.round(((currentStep + 1) / steps.length) * 100)}% Complete
            </span>
          </div>
          <div className="btl-progress-bar">
            <div 
              className="btl-progress-fill"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stepper */}
        <div className="btl-stepper px-8 py-4 mobile-stepper-compact">
          <Stepper steps={steps} currentStep={currentStep} />
        </div>

        {/* Form Content */}
        <div className="btl-form-card rounded-b-2xl p-8 mb-8 md:p-8 md:mb-8">
          <form onSubmit={handleSubmit}>
            <div className="btl-step-card p-8">
              {/* Render the "active" step component */}
              {currentStep === 0 && (
                <PatientInfo formData={formData} onChange={handleChange} />
              )}

              {currentStep === 1 && (
                <PainRegion formData={formData} onChange={handleChange} />
              )}

              {currentStep === 2 && (
                <PainScale formData={formData} onChange={handleChange} />
              )}

              {currentStep === 3 && (
                <DailyActivities formData={formData} onChange={handlePSFSChange} />
              )}

              {currentStep === 4 && (
                <Confidence formData={formData} onChange={handleChange} />
              )}

              {currentStep === 5 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                  <strong>PCS-4 Debug:</strong><br />
                  {JSON.stringify(formData.pcs4)}<br />
                  {[1,2,3,4].map(i => (
                    <div key={i}>
                      Question {i}: {String(formData.pcs4 && formData.pcs4[i])} (type: {typeof (formData.pcs4 && formData.pcs4[i])})
                    </div>
                  ))}
                  <div>
                    Validation: {[1,2,3,4].every(i => formData.pcs4 && formData.pcs4[i] !== undefined && formData.pcs4[i] !== null) ? 'PASS' : 'FAIL'}
                  </div>
                </div>
              )}

              {currentStep === 5 && (
                <PCS4 formData={formData} onChange={handleChange} />
              )}

              {currentStep === 6 && (
                <TSK11 formData={formData} onChange={handleChange} />
              )}

              {/* GROC only if "Follow-Up" */}
              {formData.formType === "Follow-Up" && currentStep === 7 && (
                <GROC formData={formData} onChange={handleChange} />
              )}

              {/* Clinician Input for Intake */}
              {formData.formType === "Intake" && currentStep === 7 && (
                <ClinicianInput formData={formData} onChange={handleChange} />
              )}

              {/* Clinician Input for Follow-Up */}
              {formData.formType === "Follow-Up" && currentStep === 8 && (
                <ClinicianInput formData={formData} onChange={handleChange} />
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100 mobile-nav-stack">
              <button
                type="button"
                onClick={handleBack}
                disabled={currentStep === 0}
                className="btn-secondary-gradient disabled:opacity-50 disabled:cursor-not-allowed touch-target"
              >
                ← Back
              </button>
              
              <div className="flex items-center space-x-4 mobile-progress-info">
                <span className="text-sm text-gray-500">
                  {currentStep + 1} / {steps.length}
                </span>
                
                {currentStep < steps.length - 1 && (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary-gradient touch-target"
                  >
                    Next →
                  </button>
                )}

                {currentStep === steps.length - 1 && (
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary-gradient disabled:opacity-50 touch-target"
                  >
                    {isSubmitting ? '🔄 Processing...' : 'Complete Assessment'}
                  </button>
                )}
              </div>
            </div>
            {showStepError && (
              <div className="mt-4 text-red-600 font-semibold text-center">
                Please complete all required fields before continuing.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
