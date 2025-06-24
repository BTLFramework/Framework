import React, { useState, useEffect } from "react";
import Stepper from "./Stepper";
import PhaseFlow from "./PhaseFlow";
import { calculateSRS, getPhaseByScore } from "../helpers/scoreLogic";

// Import each step
import PatientInfo from "./steps/PatientInfo";
import PainRegion from "./steps/PainRegion";
import PainScale from "./steps/PainScale";
import DailyActivities from "./steps/DailyActivities";
import Beliefs from "./steps/Beliefs";
import Confidence from "./steps/Confidence";
import GROC from "./steps/GROC";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(0);
  const [resultPhase, setResultPhase] = useState({ label: "", color: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
    email: "", // Add email field
    date: "",
    formType: "Intake", // "Intake" or "Follow-Up"
    region: "",
    ndi: Array(10).fill(0),
    odi: Array(10).fill(0),
    ulfi: Array(25).fill(0),
    lefs: Array(20).fill(0),
    disabilityPercentage: 0,
    vas: 0,
    psfs: [
      { activity: "Lifting groceries", score: 5 },
      { activity: "Climbing stairs", score: 3 },
      { activity: "Playing with kids", score: 7 },
    ],
    beliefs: [],
    confidence: 0,
    groc: 0, // Follow‐up only
  });

  // Steps array changes based on formType
  const steps =
    formData.formType === "Follow-Up"
      ? [
          "Patient Info",
          "Pain & Region",
          "Pain Scale",
          "Daily Activities",
          "Beliefs",
          "Confidence",
          "GROC",
        ]
      : [
          "Patient Info",
          "Pain & Region",
          "Pain Scale",
          "Daily Activities",
          "Beliefs",
          "Confidence",
        ];

  // Handle simple onChange events for text/select/radio/checkbox
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Disability‐index fields look like "ndi-3", etc.
    if (
      name.startsWith("ndi-") ||
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
    const { region, ndi, odi, ulfi, lefs } = formData;

    if (region === "Neck") {
      const sum = ndi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Low Back") {
      const sum = odi.reduce((a, b) => a + b, 0);
      percentage = (sum / (10 * 5)) * 100;
    } else if (region === "Upper Limb") {
      const sum = ulfi.reduce((a, b) => a + b, 0);
      percentage = (sum / (25 * 4)) * 100;
    } else if (region === "Lower Limb") {
      const sum = lefs.reduce((a, b) => a + b, 0);
      percentage = (sum / (20 * 4)) * 100;
    }

    if (Math.abs(percentage - formData.disabilityPercentage) > 0.01) {
      setFormData((prev) => ({ ...prev, disabilityPercentage: percentage }));
    }
  }, [
    formData.region,
    formData.ndi,
    formData.odi,
    formData.ulfi,
    formData.lefs,
  ]);

  // "Next" / "Back"
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit: calculate SRS, derive phase, show results, AND send to patient portal
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Starting form submission...');
    
    // Use already calculated disability percentage from formData
    const disabilityPercentage = Math.round(formData.disabilityPercentage);
    
    // Calculate SRS using new baseline logic
    const srsResult = calculateSRS({
      ...formData,
      disabilityPercentage,
      formType: 'Intake'  // Ensure we trigger baseline calculation
    });
    
    console.log('📊 SRS Calculation Result:', srsResult);
    
    // Prepare submission data
    const submissionData = {
      patientName: formData.patientName,
      email: formData.email,
      date: formData.date,
      formType: 'Intake',
      region: formData.region,
      ndi: formData.ndi,
      odi: formData.odi,
      ulfi: formData.ulfi,
      lefs: formData.lefs,
      disabilityPercentage,
      vas: formData.vas,
      psfs: formData.psfs,
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
          score: `${result.data.srsScore}/11`, // Format as string for portal compatibility
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
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">🎉 Intake Complete!</h2>

          {/* Signature Recovery Score */}
          <div className="mb-8">
            <span className="text-lg font-medium">
              Signature Recovery Score™:&nbsp;
            </span>
            <span className="text-3xl font-bold text-blue-600">
              {resultScore}
            </span>
            <span className="text-lg">/ 11</span>
          </div>

          {/* Phase Flow Arrows */}
          <PhaseFlow resultPhase={resultPhase} />

          {/* Portal Integration Status */}
          {submissionResult && (
            <div className={`mt-6 p-4 rounded-lg border-2 ${
              submissionResult.success 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50'
            }`}>
              <h3 className={`font-bold text-lg mb-2 ${
                submissionResult.success ? 'text-green-700' : 'text-red-700'
              }`}>
                {submissionResult.success 
                  ? '✅ Patient Portal Integration Successful' 
                  : '❌ Patient Portal Integration Failed'
                }
              </h3>
              
              {submissionResult.success ? (
                <div>
                  <p className="text-green-700 mb-4">
                    Your intake form has been processed and your personalized patient portal is ready!
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        if (submissionResult?.success) {
                          const patientData = {
                            name: submissionResult.data.patient.name,
                            email: submissionResult.data.patient.email,
                            score: `${submissionResult.data.srsScore}/11`,
                            phase: submissionResult.data.phase,
                            timestamp: new Date().toISOString()
                          };
                          console.log('🚀 Opening portal with patient data:', patientData);
                          const params = new URLSearchParams({
                            patientData: JSON.stringify(patientData)
                          });
                          window.open(`http://localhost:3000?${params.toString()}`, '_blank');
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      🚀 Open Your Patient Portal
                    </button>
                    <button
                      onClick={() => {
                        if (submissionResult?.success) {
                          const patientData = {
                            name: submissionResult.data.patient.name,
                            email: submissionResult.data.patient.email,
                            score: `${submissionResult.data.srsScore}/11`,
                            phase: submissionResult.data.phase,
                            timestamp: new Date().toISOString()
                          };
                          console.log('🚀 Redirecting with patient data:', patientData);
                          const params = new URLSearchParams({
                            patientData: JSON.stringify(patientData)
                          });
                          const fullUrl = `http://localhost:3000?${params.toString()}`;
                          console.log('🔗 Generated URL:', fullUrl);
                          window.location.href = fullUrl;
                        }
                      }}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      ➡️ Go to Patient Portal (Same Tab)
                    </button>
                    <p className="text-sm text-gray-600 text-center">
                      Portal URL: <code className="bg-gray-100 px-2 py-1 rounded">http://localhost:3000</code>
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <p className="text-red-700 mb-2">
                    {submissionResult.error || 'Unknown error occurred'}
                  </p>
                  {submissionResult.details && (
                    <p className="text-sm text-red-600">
                      Details: {submissionResult.details}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex space-x-4 mt-6">
            <button
              onClick={() => {
                setShowResult(false);
                setCurrentStep(0);
                setSubmissionResult(null);
              }}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              ← Back to Form
            </button>
            
            {submissionResult?.success && (
              <button
                onClick={() => {
                  const patientData = {
                    name: submissionResult.data.patient.name,
                    email: submissionResult.data.patient.email,
                    score: `${submissionResult.data.srsScore}/11`,
                    phase: submissionResult.data.phase,
                    timestamp: new Date().toISOString()
                  };
                                      console.log('🚀 Opening portal (bottom button) with patient data:', patientData);
                    const params = new URLSearchParams({
                      patientData: JSON.stringify(patientData)
                    });
                    window.open(`http://localhost:3000?${params.toString()}`, '_blank');
                }}
                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Open Patient Portal →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Otherwise, render the multi‐step form
  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Stepper Nav */}
      <Stepper steps={steps} currentStep={currentStep} />

      <form onSubmit={handleSubmit} className="space-y-6">
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
          <Beliefs formData={formData} onChange={handleChange} />
        )}

        {currentStep === 5 && (
          <Confidence formData={formData} onChange={handleChange} />
        )}

        {/* GROC only if "Follow-Up" */}
        {formData.formType === "Follow-Up" && currentStep === 6 && (
          <GROC formData={formData} onChange={handleChange} />
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            Back
          </button>

          {currentStep < steps.length - 1 && (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Next
            </button>
          )}

          {currentStep === steps.length - 1 && (
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded hover:from-green-600 hover:to-green-700 disabled:opacity-50 font-semibold"
            >
              {isSubmitting ? '🔄 Processing...' : '🚀 Submit & See Recovery Phase'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
