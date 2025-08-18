'use client';

import React, { useState, useEffect } from 'react';
import { ClinicianInput } from './steps/ClinicianInput';
import { calculateSRS, getPhaseByScore } from '../helpers/scoreLogic';

export function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [resultScore, setResultScore] = useState(0);
  const [resultPhase, setResultPhase] = useState({ label: "", color: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  const [formData, setFormData] = useState({
    patientName: "",
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
    recoveryMilestone: false,
    clinicalProgressVerified: false,
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
          "Clinician Input",
        ]
      : [
          "Patient Info",
          "Pain & Region",
          "Pain Scale",
          "Daily Activities",
          "Beliefs",
          "Confidence",
          "Clinician Input",
        ];

  // Handle simple onChange events for text/select/radio/checkbox
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    // Disability‐index fields look like "ndi-3", etc.
    if (
      name.startsWith("ndi-") ||
      name.startsWith("odi-") ||
      name.startsWith("ulfi-") ||
      name.startsWith("lefs-")
    ) {
      const [key, idx] = name.split("-");
      const arr = [...formData[key as keyof typeof formData]] as number[];
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

  const handlePSFSChange = (index: number, key: string, value: any) => {
    setFormData((prev) => {
      const updated = [...prev.psfs];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, psfs: updated };
    });
  };

  // "Next" / "Back"
  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };
  
  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  // Submit: calculate SRS, derive phase, show results
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Calculate local results first
    const score = calculateSRS(formData);
    const phaseObj = getPhaseByScore(score);
    setResultScore(score);
    setResultPhase(phaseObj);
    
    try {
      // For now, just show the results
      setSubmissionResult({ success: true, message: 'Assessment completed successfully' });
      setShowResult(true);
    } catch (error) {
      console.error('❌ Submission error:', error);
      setSubmissionResult({ 
        success: false, 
        error: 'Failed to process assessment',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
      setShowResult(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // If "showResult" is true, display the Recovery Results UI
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

          {/* Phase Display */}
          <div className="mb-6">
            <span className="text-lg font-medium">Recovery Phase:&nbsp;</span>
            <span className={`text-xl font-bold px-3 py-1 rounded ${resultPhase.color} text-white`}>
              {resultPhase.label}
            </span>
          </div>

          {/* "Back to Form" button */}
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
      <div className="mb-6">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                index <= currentStep 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              <span className={`ml-2 text-sm ${
                index <= currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'
              }`}>
                {step}
              </span>
              {index < steps.length - 1 && (
                <div className={`w-16 h-0.5 mx-4 ${
                  index < currentStep ? 'bg-blue-500' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Render the "active" step component */}
        {currentStep === 0 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Patient Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Patient Name</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Form Type</label>
                <select
                  name="formType"
                  value={formData.formType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Intake">Intake</option>
                  <option value="Follow-Up">Follow-Up</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Pain Region & Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Region</label>
                <select
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Region</option>
                  <option value="Neck">Neck</option>
                  <option value="Low Back">Low Back</option>
                  <option value="Upper Limb">Upper Limb</option>
                  <option value="Lower Limb">Lower Limb</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pain Level (0-10)</label>
                <input
                  type="number"
                  name="vas"
                  min="0"
                  max="10"
                  value={formData.vas}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Daily Activities (PSFS)</h3>
            <div className="space-y-4">
              {formData.psfs.map((psfs, index) => (
                <div key={index} className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Activity {index + 1}</label>
                    <input
                      type="text"
                      value={psfs.activity}
                      onChange={(e) => handlePSFSChange(index, 'activity', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Lifting groceries"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Score (0-10)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={psfs.score}
                      onChange={(e) => handlePSFSChange(index, 'score', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Beliefs Assessment</h3>
            <div className="space-y-3">
              {[
                "Pain means I'm doing damage",
                "I should avoid activities that cause pain",
                "Pain will get worse if I keep moving",
                "I can't do normal activities until pain is gone",
                "None of these apply"
              ].map((belief) => (
                <label key={belief} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="beliefs"
                    value={belief}
                    checked={formData.beliefs.includes(belief)}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{belief}</span>
                </label>
              ))}
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Confidence Assessment</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Confidence Level (0-10)</label>
                <input
                  type="number"
                  name="confidence"
                  min="0"
                  max="10"
                  value={formData.confidence}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">0 = No confidence, 10 = Complete confidence</p>
              </div>
            </div>
          </div>
        )}

        {/* GROC only if "Follow-Up" */}
        {formData.formType === "Follow-Up" && currentStep === 5 && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Global Rating of Change (GROC)</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">GROC Score (-5 to +5)</label>
                <input
                  type="number"
                  name="groc"
                  min="-5"
                  max="5"
                  value={formData.groc}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">-5 = Much worse, 0 = No change, +5 = Much better</p>
              </div>
            </div>
          </div>
        )}

        {/* Clinician Input step */}
        {currentStep === (formData.formType === "Follow-Up" ? 6 : 5) && (
          <ClinicianInput formData={formData} onChange={handleChange} />
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
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Processing...' : 'Submit & See Recovery Phase'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
