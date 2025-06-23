"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface Activity {
  activity: string;
  score: number;
}

interface DailyActivitiesStepProps {
  formData: {
    psfs: Activity[];
  };
  updateFormData: (data: any) => void;
}

export function DailyActivitiesStep({ formData, updateFormData }: DailyActivitiesStepProps) {
  const handleActivityChange = (index: number, value: string) => {
    const newPsfs = [...formData.psfs];
    newPsfs[index].activity = value;
    updateFormData({ psfs: newPsfs });
  };

  const handleScoreChange = (index: number, value: number[]) => {
    const newPsfs = [...formData.psfs];
    newPsfs[index].score = value[0];
    updateFormData({ psfs: newPsfs });
  };
  
  const addActivity = () => {
    updateFormData({ psfs: [...formData.psfs, { activity: "", score: 0 }] });
  };

  const removeActivity = (index: number) => {
    const newPsfs = formData.psfs.filter((_, i) => i !== index);
    updateFormData({ psfs: newPsfs });
  };


  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium">Daily Activities (Patient-Specific Functional Scale)</h3>
        <p className="text-sm text-muted-foreground">
          Please list up to 3 important activities you are unable to do or have difficulty with as a result of your problem.
        </p>
      </div>

      {formData.psfs.map((item, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
          <div className="space-y-2">
            <Label htmlFor={`activity-${index}`}>Activity {index + 1}</Label>
            <Input
              id={`activity-${index}`}
              value={item.activity}
              onChange={(e) => handleActivityChange(index, e.target.value)}
              placeholder="e.g., Lifting groceries"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`score-${index}`}>
              Current Ability (0-10): <span className="font-bold">{item.score}</span>
            </Label>
            <Slider
              id={`score-${index}`}
              min={0}
              max={10}
              step={1}
              value={[item.score]}
              onValueChange={(value) => handleScoreChange(index, value)}
            />
             <div className="flex justify-between text-xs text-muted-foreground">
              <span>Unable to Perform</span>
              <span>Able to Perform at Prior Level</span>
            </div>
          </div>
          {formData.psfs.length > 1 && (
             <Button 
                variant="ghost" 
                size="sm" 
                className="absolute top-2 right-2"
                onClick={() => removeActivity(index)}
              >
                &times;
              </Button>
          )}
        </div>
      ))}
      
      {formData.psfs.length < 3 && (
        <Button onClick={addActivity}>Add Another Activity</Button>
      )}
    </div>
  );
} 