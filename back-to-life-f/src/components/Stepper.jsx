import React from "react";

/**
 * Renders a horizontal numbered stepper.
 *
 * Props:
 *  - steps: Array<string> of labels for each step, e.g. ["Patient Info", "Pain & Region", ...]
 *  - currentStep: zero‐based index of which step is active
 */
export default function Stepper({ steps, currentStep }) {
  return (
    <div className="flex justify-between items-center overflow-x-auto pb-2">
      {steps.map((label, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        
        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div
                className={`
                  mb-2 h-10 w-10 flex items-center justify-center rounded-full text-sm font-bold transition-all duration-300 btl-stepper-step-number
                  ${
                    isActive
                      ? "btl-stepper-step active shadow-lg"
                      : isCompleted
                      ? "btl-stepper-step completed"
                      : "bg-gray-200 text-gray-500"
                  }
                `}
              >
                {isCompleted ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>
              <div
                className={`text-xs font-medium transition-all duration-300 text-center px-1 leading-tight ${
                  isActive 
                    ? "text-cyan-700 font-semibold" 
                    : isCompleted
                    ? "text-cyan-600"
                    : "text-gray-500"
                }`}
              >
                <span className="hidden sm:inline">{label}</span>
                <span className="sm:hidden">
                  {label.split(' ')[0]}
                </span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-1 sm:mx-2 mt-5 min-w-4">
                <div 
                  className={`h-full transition-all duration-500 ${
                    index < currentStep 
                      ? "back-to-life-gradient" 
                      : "bg-gray-200"
                  }`}
                ></div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
