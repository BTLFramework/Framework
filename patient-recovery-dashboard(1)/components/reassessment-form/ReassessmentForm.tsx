"use client";

import { useState } from 'react';
import { Stepper } from './Stepper';
import { PatientInfoStep } from './steps/PatientInfoStep';
import { PainRegionStep } from './steps/PainRegionStep';
import { PainScaleStep } from './steps/PainScaleStep';
import { DailyActivitiesStep } from './steps/DailyActivitiesStep';
import { BeliefsStep } from './steps/BeliefsStep';
import { ConfidenceStep } from './steps/ConfidenceStep';
import { GrocStep } from './steps/GrocStep';

const STEPS = [
  "Patient Info",
  "Pain & Region",
  "Pain Scale",
  "Daily Activities",
  "Beliefs",
  "Confidence",
  "GROC"
];

export function ReassessmentForm() {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    patientName: "Jane Doe",
    email: "jane.doe@example.com",
    date: new Date().toISOString().split('T')[0],
    region: "",
    vas: 5,
    psfs: [{ activity: "Lifting groceries", score: 5 }],
    beliefs: [],
    confidence: 7,
    groc: 0,
  });

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const updateFormData = (newData: Partial<typeof formData>) => {
    setFormData(prevData => ({ ...prevData, ...newData }));
  };

  const renderStepContent = () => {
    const stepName = STEPS[currentStep - 1];
    switch (stepName) {
      case "Patient Info":
        return <PatientInfoStep formData={formData} updateFormData={updateFormData} />;
      case "Pain & Region":
        return <PainRegionStep formData={formData} updateFormData={updateFormData} />;
      case "Pain Scale":
        return <PainScaleStep formData={formData} updateFormData={updateFormData} />;
      case "Daily Activities":
        return <DailyActivitiesStep formData={formData} updateFormData={updateFormData} />;
      case "Beliefs":
        return <BeliefsStep formData={formData} updateFormData={updateFormData} />;
      case "Confidence":
        return <ConfidenceStep formData={formData} updateFormData={updateFormData} />;
      case "GROC":
        return <GrocStep formData={formData} updateFormData={updateFormData} />;
      default:
        return <p>Step not found.</p>;
    }
  };

  return (
    <div className="bg-background rounded-lg shadow-xl border border-border p-4 sm:p-8 max-w-4xl mx-auto">
      <Stepper steps={STEPS} currentStep={currentStep} />
      <div className="mt-6 font-semibold text-lg">
        {STEPS[currentStep - 1]}
      </div>
      <div className="mt-4 p-6 bg-card rounded-lg border border-border min-h-[400px]">
        {renderStepContent()}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 1}
          className="px-6 py-2 bg-secondary text-secondary-foreground rounded-md font-semibold hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={currentStep === STEPS.length}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {currentStep === STEPS.length ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
} 