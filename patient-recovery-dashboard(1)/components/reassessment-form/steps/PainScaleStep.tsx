"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface PainScaleStepProps {
  formData: {
    vas: number;
  };
  updateFormData: (data: any) => void;
}

export function PainScaleStep({ formData, updateFormData }: PainScaleStepProps) {
  const handleSliderChange = (value: number[]) => {
    updateFormData({ vas: value[0] });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="vas-slider">
          Pain Scale (0-10):{" "}
          <span className="font-bold">{formData.vas}</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          On a scale from 0 to 10, where 0 is "no pain" and 10 is the "worst pain imaginable," how would you rate your pain right now?
        </p>
        <Slider
          id="vas-slider"
          min={0}
          max={10}
          step={1}
          value={[formData.vas]}
          onValueChange={handleSliderChange}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0 (No Pain)</span>
          <span>10 (Worst Pain)</span>
        </div>
      </div>
    </div>
  );
} 