import React from "react";

export default function PainScale({ formData, onChange }) {
  const getPainDescription = (value) => {
    if (value === 0) return "No pain";
    if (value <= 2) return "Mild pain";
    if (value <= 4) return "Moderate pain";
    if (value <= 6) return "Moderately severe pain";
    if (value <= 8) return "Severe pain";
    return "Worst pain possible";
  };

  const getPainColor = (value) => {
    if (value === 0) return "text-green-600";
    if (value <= 2) return "text-yellow-600";
    if (value <= 4) return "text-orange-500";
    if (value <= 6) return "text-orange-600";
    if (value <= 8) return "text-red-500";
    return "text-red-700";
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Pain Assessment</h2>
        <p className="btl-section-subtitle">
          Rate your current pain level using the scale below. This helps us understand your baseline pain experience.
        </p>
      </div>
      
      <div className="bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-100">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="btl-label">Current Pain Level:</span>
            <div className={`text-4xl font-bold ${getPainColor(formData.vas)}`}>
              {formData.vas}
            </div>
            <span className="text-lg text-gray-600">/ 10</span>
          </div>
          <div className={`text-lg font-medium ${getPainColor(formData.vas)}`}>
            {getPainDescription(formData.vas)}
          </div>
        </div>

        <div className="relative">
          <input
            type="range"
            name="vas"
            min="0"
            max="10"
            value={formData.vas}
            onChange={onChange}
            className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 via-orange-200 to-red-200 rounded-lg cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-cyan-100 touch-target"
            style={{
              background: `linear-gradient(to right, 
                #dcfce7 0%, #fef3c7 20%, #fed7aa 40%, 
                #fecaca 60%, #fca5a5 80%, #ef4444 100%)`
            }}
          />
          <style jsx>{`
            input[type="range"]::-webkit-slider-thumb {
              appearance: none;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #155e75 0%, #0891b2 100%);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            input[type="range"]::-moz-range-thumb {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #155e75 0%, #0891b2 100%);
              cursor: pointer;
              border: 3px solid white;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
          `}</style>
        </div>

        <div className="flex justify-between text-sm text-gray-500 mt-4 px-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-medium">{i}</span>
              {(i === 0 || i === 5 || i === 10) && (
                <span className="text-xs mt-1 text-center max-w-12">
                  {i === 0 ? "No pain" : i === 5 ? "Moderate" : "Worst"}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Pain Assessment (VAS)</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Evidence shows that tracking pain on a simple 0-10 scale reliably monitors treatment response and guides care.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
