"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface ConfidenceStepProps {
  formData: {
    confidence: number;
  };
  updateFormData: (data: any) => void;
}

export function ConfidenceStep({ formData, updateFormData }: ConfidenceStepProps) {
  const handleSliderChange = (value: number[]) => {
    updateFormData({ confidence: value[0] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="confidence-slider">
          Confidence in Recovery (0-10):{" "}
          <span className="font-bold">{formData.confidence}</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          How confident are you that you will be able to return to the activities that are important to you?
        </p>
        <Slider
          id="confidence-slider"
          min={0}
          max={10}
          step={1}
          value={[formData.confidence]}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Not at all Confident</span>
          <span>Completely Confident</span>
        </div>
      </div>
    </div>
  );
} 