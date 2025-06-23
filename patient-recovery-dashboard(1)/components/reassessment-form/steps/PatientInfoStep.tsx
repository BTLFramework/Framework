"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface PatientInfoStepProps {
  formData: {
    patientName: string;
    email: string;
    date: string;
  };
  updateFormData: (data: any) => void;
}

export function PatientInfoStep({ formData, updateFormData }: PatientInfoStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="patientName">Patient Name</Label>
        <Input
          id="patientName"
          name="patientName"
          value={formData.patientName || ""}
          onChange={handleChange}
          placeholder="e.g., Jane Doe"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email || ""}
          onChange={handleChange}
          placeholder="e.g., jane.doe@example.com"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          value={formData.date || ""}
          onChange={handleChange}
        />
      </div>
    </div>
  );
} 