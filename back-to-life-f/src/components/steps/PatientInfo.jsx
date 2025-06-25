import React from "react";

export default function PatientInfo({ formData, onChange }) {
  // Get today's date in ISO format for default value
  const todayISO = new Date().toISOString().split("T")[0];
  
  // Validation helper for future dates
  const isFutureDate = (dateString) => {
    return new Date(dateString) > new Date();
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Patient Information</h2>
        <p className="btl-section-subtitle">
          Let's start with your basic information to personalize your assessment.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Patient Name */}
        <div>
          <label className="btl-label block">
            Patient Name *
          </label>
          <input
            type="text"
            name="patientName"
            value={formData.patientName}
            onChange={onChange}
            className="btl-input block w-full"
            placeholder="Enter your full name"
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="btl-label block">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={onChange}
            placeholder="your.email@example.com"
            className="btl-input block w-full"
          />
          <p className="btl-helper-text">
            Used for patient portal access (auto-generated if not provided)
          </p>
        </div>

        {/* Date of Birth */}
        <div>
          <label htmlFor="dob" className="btl-label block">
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            name="dob"
            value={formData.dob || ""}
            onChange={onChange}
            className="btl-input block w-full"
            max={todayISO}
          />
          <p className="btl-helper-text">
            Required for patient demographics and age-related assessments
          </p>
        </div>

        {/* Form Completion Date */}
        <div>
          <label htmlFor="intakeDate" className="btl-label block">
            Form Completion Date *
          </label>
          <input
            id="intakeDate"
            type="date"
            name="date"
            value={formData.date || todayISO}
            onChange={onChange}
            className={`btl-input block w-full ${
              isFutureDate(formData.date) ? 'btl-error' : ''
            }`}
            max={todayISO}
            required
          />
          <p className="btl-helper-text">
            Auto-filled to today; adjust only if completing the form later
          </p>
          {isFutureDate(formData.date) && (
            <p className="btl-error-text">
              Completion date cannot be in the future
            </p>
          )}
        </div>

        {/* Form Type */}
        <div className="md:col-span-2">
          <label className="btl-label block">
            Assessment Type *
          </label>
          <div className="btl-radio-group grid-cols-2">
            <label className={`btl-radio-item ${formData.formType === 'Intake' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="formType"
                value="Intake"
                checked={formData.formType === 'Intake'}
                onChange={onChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-current mr-3 flex items-center justify-center">
                  {formData.formType === 'Intake' && (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">Initial Assessment</div>
                  <div className="text-sm text-gray-600">Your first Back to Life evaluation</div>
                </div>
              </div>
            </label>
            <label className={`btl-radio-item ${formData.formType === 'Follow-Up' ? 'selected' : ''}`}>
              <input
                type="radio"
                name="formType"
                value="Follow-Up"
                checked={formData.formType === 'Follow-Up'}
                onChange={onChange}
                className="sr-only"
              />
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full border-2 border-current mr-3 flex items-center justify-center">
                  {formData.formType === 'Follow-Up' && (
                    <div className="w-2 h-2 rounded-full bg-current"></div>
                  )}
                </div>
                <div>
                  <div className="font-semibold">Follow-Up Assessment</div>
                  <div className="text-sm text-gray-600">Progress evaluation after treatment</div>
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
