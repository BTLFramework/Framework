import React from "react";

export default function ClinicianInput({ formData, onChange }) {
  return (
    <section className="bg-white md:p-8 p-0 rounded space-y-4">
      <h2 className="text-lg font-semibold mb-2">Clinician Input</h2>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="recoveryMilestone"
          checked={formData.recoveryMilestone}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-700">
          Recovery Milestone Achieved
        </span>
      </label>

      <label className="flex items-center space-x-2">
        <input
          type="checkbox"
          name="clinicalProgressVerified"
          checked={formData.clinicalProgressVerified}
          onChange={onChange}
          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
        />
        <span className="text-sm text-gray-700">
          Clinical Progress Verified
        </span>
      </label>
    </section>
  );
}
