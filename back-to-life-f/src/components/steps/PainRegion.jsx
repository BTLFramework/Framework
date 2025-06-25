import React, { useEffect } from "react";
import {
  NDI_QUESTIONS,
  ODI_QUESTIONS,
  ULFI_QUESTIONS,
  LEFS_QUESTIONS,
} from "../../constants/disabilityQuestions";

/**
 * Props:
 *   - formData (object)
 *   - onChange (function)
 *
 * This step shows:
 *   • Region dropdown
 *   • Depending on region, the appropriate DI questions (NDI/ODI/ULFI/LEFS)
 *   • Auto‐calculates the % and displays at the bottom
 */
export default function PainRegion({ formData, onChange }) {
  // Compute DI % whenever data changes (could also live in MultiStepForm.useEffect,
  // but here we show another pattern: local effect that simply writes into formData).
  useEffect(() => {
    let percentage = 0;

    if (formData.region === "Neck") {
      const sum = formData.ndi.reduce((acc, v) => acc + v, 0);
      percentage = (sum / (NDI_QUESTIONS.length * 5)) * 100;
    } else if (formData.region === "Back") {
      const sum = formData.odi.reduce((acc, v) => acc + v, 0);
      percentage = (sum / (ODI_QUESTIONS.length * 5)) * 100;
    } else if (formData.region === "Upper Limb") {
      const sum = formData.ulfi.reduce((acc, v) => acc + v, 0);
      percentage = (sum / (ULFI_QUESTIONS.length * 4)) * 100;
    } else if (formData.region === "Lower Limb") {
      const sum = formData.lefs.reduce((acc, v) => acc + v, 0);
      percentage = (sum / (LEFS_QUESTIONS.length * 4)) * 100;
    }

    // Only update if changed
    if (Math.abs(percentage - formData.disabilityPercentage) > 0.01) {
      onChange({ target: { name: "disabilityPercentage", value: percentage } });
    }
  }, [
    formData.region,
    formData.ndi,
    formData.odi,
    formData.ulfi,
    formData.lefs,
  ]);

  return (
    <section className="bg-white md:p-8 p-0 rounded space-y-6">
      <div className="mb-8">
        <h2 className="btl-section-header">Pain Region & Disability Assessment</h2>
      </div>

      {/* Region dropdown - Enhanced visibility */}
      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border-2 border-transparent bg-clip-padding relative btl-card-hover">
        {/* Subtle BTL gradient border */}
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-200 via-blue-200 to-cyan-200 rounded-2xl opacity-50 -z-10"></div>
        
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-3 h-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600"></div>
          <label className="btl-label block text-lg font-semibold">
            Region of Complaint *
          </label>
        </div>
        
        <select
          name="region"
          value={formData.region}
          onChange={onChange}
          className="btl-select w-full text-lg font-medium border-2 border-gray-200 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all duration-200"
        >
          <option value="">Select your primary region of complaint</option>
          <option>Neck</option>
          <option>Back</option>
          <option>Upper Limb</option>
          <option>Lower Limb</option>
        </select>
        
        <p className="text-sm text-gray-600 mt-2 italic">
          Choose the area where you're experiencing your primary symptoms
        </p>
      </div>

      {/* Conditional: Neck → NDI */}
      {formData.region === "Neck" && (
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">
            Neck Disability Index (NDI)
          </h3>
          {NDI_QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                {q.label}
              </label>
              <div className="space-y-2">
                {q.options.map((opt, val) => (
                  <label key={val} className="flex items-start space-x-2">
                    <input
                      type="radio"
                      name={`ndi-${idx}`}
                      value={val}
                      checked={formData.ndi[idx] === val}
                      onChange={onChange}
                      className="h-4 w-4 text-blue-600 border-2 border-gray-200 mt-1"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 text-sm font-medium">
            NDI Score: {formData.disabilityPercentage.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Conditional: Back → ODI */}
      {formData.region === "Back" && (
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">
            Oswestry Disability Index (ODI)
          </h3>
          {ODI_QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">
                {q.label}
              </label>
              <div className="space-y-2">
                {q.options.map((opt, val) => (
                  <label key={val} className="flex items-start space-x-2">
                    <input
                      type="radio"
                      name={`odi-${idx}`}
                      value={val}
                      checked={formData.odi[idx] === val}
                      onChange={onChange}
                      className="h-4 w-4 text-blue-600 border-2 border-gray-200 mt-1"
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
          <div className="mt-2 text-sm font-medium">
            ODI Score: {formData.disabilityPercentage.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Conditional: Upper Limb → ULFI */}
      {formData.region === "Upper Limb" && (
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">
            Upper Limb Functional Index (ULFI)
          </h3>
          {ULFI_QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">{q}</label>
              <div className="flex space-x-4 mb-1">
                {[0, 1, 2, 3, 4].map((val) => (
                  <label key={val} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`ulfi-${idx}`}
                      value={val}
                      checked={formData.ulfi[idx] === val}
                      onChange={onChange}
                      className="h-4 w-4 text-blue-600 border-2 border-gray-200"
                    />
                    <span className="text-sm">{val}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 = No difficulty</span>
                <span>4 = Unable to perform</span>
              </div>
            </div>
          ))}
          <div className="mt-2 text-sm font-medium">
            ULFI Score: {formData.disabilityPercentage.toFixed(1)}%
          </div>
        </div>
      )}

      {/* Conditional: Lower Limb → LEFS */}
      {formData.region === "Lower Limb" && (
        <div className="space-y-4">
          <h3 className="text-md font-medium mb-2">
            Lower Extremity Functional Scale (LEFS)
          </h3>
          {LEFS_QUESTIONS.map((q, idx) => (
            <div key={idx} className="mb-4">
              <label className="block text-sm text-gray-700 mb-1">{q}</label>
              <div className="flex space-x-4 mb-1">
                {[0, 1, 2, 3, 4].map((val) => (
                  <label key={val} className="flex items-center space-x-1">
                    <input
                      type="radio"
                      name={`lefs-${idx}`}
                      value={val}
                      checked={formData.lefs[idx] === val}
                      onChange={onChange}
                      className="h-4 w-4 text-blue-600 border-2 border-gray-200"
                    />
                    <span className="text-sm">{val}</span>
                  </label>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0 = No difficulty</span>
                <span>4 = Unable to perform</span>
              </div>
            </div>
          ))}
          <div className="mt-2 text-sm font-medium">
            LEFS Score: {formData.disabilityPercentage.toFixed(1)}%
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Disability Index (NDI / ODI / LEFS)</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Evidence shows that standardized disability scores capture real-life limits and track change as rehabilitation progresses.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
