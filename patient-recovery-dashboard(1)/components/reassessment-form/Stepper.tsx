"use client";

interface StepperProps {
  steps: string[];
  currentStep: number;
}

export function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="flex items-center justify-center space-x-4 sm:space-x-8 p-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;

        return (
          <div key={label} className="flex flex-col items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300
                ${
                  isActive
                    ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-secondary text-secondary-foreground"
                }`}
            >
              {isCompleted ? "✔" : stepNumber}
            </div>
            <p
              className={`mt-2 text-xs text-center transition-all duration-300
                ${
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground"
                }`}
            >
              {label}
            </p>
          </div>
        );
      })}
    </div>
  );
} 