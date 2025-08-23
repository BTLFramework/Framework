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
    date: "",
    formType: "Intake", // “Intake” or “Follow-Up”
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

    // Disability‐index fields look like “ndi-3”, etc.
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

    // “beliefs” is a multi‐checkbox array
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

  // “Next” / “Back”
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit: calculate SRS, derive phase, show results AND submit to dual portal system
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate local results first
    const score = calculateSRS(formData);
    const phaseObj = getPhaseByScore(score);
    setResultScore(score);
    setResultPhase(phaseObj);
    
    try {
      // Add email if not provided
      const submissionData = {
        ...formData,
        email: formData.email || `${formData.patientName.toLowerCase().replace(' ', '.')}@patient.com`
      };

      // Submit to patient portal API (which forwards to backend)
      const apiUrl = import.meta.env.VITE_API_URL || 'https://framework-production-92f5.up.railway.app';
      const response = await fetch(`${apiUrl}/api/patient-portal/intake`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const result = await response.json();
      
      // Store patient data for portal access
      if (result.success) {
        const patientData = {
          name: result.data.patient.name,
          email: result.data.patient.email,
          score: result.data.srsScore,
          phase: result.data.phase,
          timestamp: new Date().toISOString()
        };
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

  // If “showResult” is true, display the Recovery Results UI
  if (showResult) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Recovery Results</h2>

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

          {/* “Back to Form” button */}
          <button
            onClick={() => {
              setShowResult(false);
              setCurrentStep(0);
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to Form
          </button>
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
        {/* Render the “active” step component */}
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

        {/* GROC only if “Follow-Up” */}
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
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
              Submit &amp; See Recovery Phase
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
