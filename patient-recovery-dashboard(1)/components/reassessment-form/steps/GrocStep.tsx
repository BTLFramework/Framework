"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

interface GrocStepProps {
  formData: {
    groc: number;
  };
  updateFormData: (data: any) => void;
}

export function GrocStep({ formData, updateFormData }: GrocStepProps) {
  const handleSliderChange = (value: number[]) => {
    updateFormData({ groc: value[0] });
  };
  
  const getGrocLabel = (value: number) => {
    if (value === 7) return "A very great deal better";
    if (value === 6) return "A great deal better";
    if (value === 5) return "A good deal better";
    if (value === 4) return "Moderately better";
    if (value === 3) return "Somewhat better";
    if (value === 2) return "A little better";
    if (value === 1) return "Minimally better";
    if (value === 0) return "No change";
    if (value === -1) return "Minimally worse";
    if (value === -2) return "A little worse";
    if (value === -3) return "Somewhat worse";
    if (value === -4) return "Moderately worse";
    if (value === -5) return "A good deal worse";
    if (value === -6) return "A great deal worse";
    if (value === -7) return "A very great deal worse";
    return "";
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="groc-slider">
          Global Rating of Change (-7 to +7):{" "}
          <span className="font-bold">{formData.groc}</span>
        </Label>
        <p className="text-sm text-muted-foreground">
          Compared to when you started care, how would you describe your condition now?
        </p>
        
        <div className="py-4">
            <Slider
              id="groc-slider"
              min={-7}
              max={7}
              step={1}
              value={[formData.groc]}
              onValueChange={handleSliderChange}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2 px-1">
                <span>Worse</span>
                <span>No Change</span>
                <span>Better</span>
            </div>
        </div>
        
        <div className="text-center font-semibold text-primary pt-2">
            {getGrocLabel(formData.groc)}
        </div>
      </div>
    </div>
  );
} 