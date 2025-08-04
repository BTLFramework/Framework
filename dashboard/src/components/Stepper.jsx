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
    <div className="hidden md:flex justify-between mb-6">
      {steps.map((label, index) => (
        <div key={index} className="flex-1 text-center">
          <div
            className={`
              mx-auto mb-2 h-8 w-8 flex items-center justify-center rounded-full text-sm font-semibold
              ${
                index === currentStep
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }
            `}
          >
            {index + 1}
          </div>
          <div
            className={`text-xs ${
              index === currentStep ? "text-blue-500" : "text-gray-600"
            }`}
          >
            {label}
          </div>
        </div>
      ))}
    </div>
  );
}
