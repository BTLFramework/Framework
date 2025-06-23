"use client";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface BeliefsStepProps {
  formData: {
    beliefs: string[];
  };
  updateFormData: (data: any) => void;
}

const BELIEF_OPTIONS = [
  "I worry my body is damaged or fragile",
  "I avoid movement because I fear it will make things worse",
  "I'm afraid that moving might injure me more",
  "I was told something is 'out of place,' and it makes me cautious",
  "I don't fully trust my body to handle activity",
  "I've been told to avoid certain postures or movements",
  "None of these apply",
];

export function BeliefsStep({ formData, updateFormData }: BeliefsStepProps) {

  const handleCheckboxChange = (option: string, checked: boolean | "indeterminate") => {
    let newBeliefs = [...formData.beliefs];

    if (checked) {
      if (option === "None of these apply") {
        newBeliefs = ["None of these apply"];
      } else {
        newBeliefs = newBeliefs.filter(b => b !== "None of these apply");
        newBeliefs.push(option);
      }
    } else {
      newBeliefs = newBeliefs.filter(b => b !== option);
    }
    
    updateFormData({ beliefs: newBeliefs });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Beliefs About Pain & Movement</h3>
        <p className="text-sm text-muted-foreground">
          Please check all statements that apply to you.
        </p>
      </div>
      <div className="space-y-3">
        {BELIEF_OPTIONS.map((option) => (
          <div key={option} className="flex items-start space-x-3">
            <Checkbox
              id={option}
              checked={formData.beliefs.includes(option)}
              onCheckedChange={(checked) => handleCheckboxChange(option, checked)}
            />
            <Label htmlFor={option} className="font-normal leading-relaxed">
              {option}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
} 