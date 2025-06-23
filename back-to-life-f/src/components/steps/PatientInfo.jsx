import React from "react";

export default function PatientInfo({ formData, onChange }) {
  return (
    <section className="bg-white md:p-8 p-0 rounded">
      <h2 className="text-lg font-semibold mb-2">Patient Info</h2>
      <div className="grid grid-cols-1 gap-4">
        {/* Patient Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Patient Name
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={onChange}
            className="mt-1 block w-full border border-2 border-gray-200 rounded-md p-2"
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="your.email@example.com"
            className="mt-1 block w-full border border-2 border-gray-200 rounded-md p-2"
          />
          <p className="mt-1 text-xs text-gray-500">
            Used for patient portal access (auto-generated if not provided)
          </p>
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={onChange}
            className="mt-1 block w-full border border-gray-200 border-2 rounded-md p-2"
            required
          />
        </div>

        {/* Form Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Form Type
          </label>
          <select
            name="formType"
            value={formData.formType}
            onChange={onChange}
            className="mt-1 block w-full border border-2 border-gray-200 rounded-md p-2"
          >
            <option>Intake</option>
            <option>Follow-Up</option>
          </select>
        </div>
      </div>
    </section>
  );
}
