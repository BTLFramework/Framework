"use client";

import React from 'react';

interface PainRegionStepProps {
  formData: {
    region: string;
  };
  updateFormData: (data: any) => void;
}

export function PainRegionStep({ formData, updateFormData }: PainRegionStepProps) {
  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateFormData({ region: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Pain & Region</h3>
        <p className="text-sm text-muted-foreground">
          Please select the region where you're experiencing pain.
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          Region of Complaint <span className="text-red-500">*</span>
        </label>
        <select
          id="region"
          name="region"
          value={formData.region || ""}
          onChange={handleRegionChange}
          className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select Region</option>
          <option value="Neck">Neck</option>
          <option value="Low Back">Low Back</option>
          <option value="Upper Limb">Upper Limb</option>
          <option value="Lower Limb">Lower Limb</option>
        </select>
      </div>
    </div>
  );
} 