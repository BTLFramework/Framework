import React from "react";

export default function PatientInfo({ formData, onChange }) {
  // Get today's date in ISO format for default value
  const todayISO = new Date().toISOString().split("T")[0];
  
  // Validation helper for future dates
  const isFutureDate = (dateString) => {
    return new Date(dateString) > new Date();
  };

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

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={onChange}
            className="mt-1 block w-full border border-2 border-gray-200 rounded-md p-2"
            max={todayISO} // Prevent future dates
          />
          <p className="mt-1 text-xs text-gray-500">
            Required for patient demographics and age-related assessments
          </p>
        </div>

        {/* Form Completion Date */}
        <div>
          <label htmlFor="intakeDate" className="block text-sm font-medium text-gray-700">
            Form Completion Date
          </label>
          <p className="text-xs text-gray-500 mb-1">
            Auto-filled to today; adjust only if you're completing the form later.
          </p>
          <input
            id="intakeDate"
            type="date"
            name="date"
            value={formData.date || todayISO}
            onChange={onChange}
            className={`mt-1 block w-full border border-2 rounded-md p-2 ${
              isFutureDate(formData.date) ? 'border-red-300 bg-red-50' : 'border-gray-200'
            }`}
            max={todayISO} // Prevent future dates
            required
          />
          {isFutureDate(formData.date) && (
            <p className="mt-1 text-xs text-red-600">
              Completion date can't be in the future.
            </p>
          )}
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
