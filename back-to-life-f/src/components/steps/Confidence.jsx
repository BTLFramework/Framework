import React from "react";

export default function Confidence({ formData, onChange }) {
  const getConfidenceDescription = (confidence) => {
    if (confidence === 0) return "No confidence";
    if (confidence <= 2) return "Very low confidence";
    if (confidence <= 4) return "Low confidence";
    if (confidence <= 6) return "Moderate confidence";
    if (confidence <= 8) return "High confidence";
    return "Complete confidence";
  };

  const getConfidenceColor = (confidence) => {
    if (confidence === 0) return "text-red-700";
    if (confidence <= 2) return "text-red-600";
    if (confidence <= 4) return "text-orange-600";
    if (confidence <= 6) return "text-yellow-600";
    if (confidence <= 8) return "text-green-500";
    return "text-green-600";
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Confidence in Recovery</h2>
        <p className="btl-section-subtitle">
          Rate your current confidence level in your ability to recover and return to your normal activities. Your confidence plays a crucial role in your healing journey.
        </p>
      </div>

      <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 btl-card-hover">
        <div className="flex items-center justify-between mb-6">
          <label className="btl-label">
            How confident are you in your recovery?
          </label>
          <div className="flex items-center space-x-3">
            <div className={`text-3xl font-bold ${getConfidenceColor(formData.confidence)}`}>
              {formData.confidence}
            </div>
            <span className="text-lg text-gray-600">/ 10</span>
          </div>
        </div>
        
        <div className={`text-center mb-6 text-lg font-medium ${getConfidenceColor(formData.confidence)}`}>
          {getConfidenceDescription(formData.confidence)}
        </div>

        <div className="relative mb-6">
          <input
            type="range"
            name="confidence"
            min="0"
            max="10"
            value={formData.confidence}
            onChange={onChange}
            className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-green-300 rounded-lg cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-cyan-100 touch-target"
            style={{
              background: `linear-gradient(to right, 
                #fecaca 0%, #fed7aa 20%, #fef3c7 40%, 
                #d9f99d 60%, #bbf7d0 80%, #86efac 100%)`
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

        <div className="flex justify-between text-sm text-gray-500 px-1">
          {Array.from({ length: 11 }, (_, i) => (
            <div key={i} className="flex flex-col items-center">
              <span className="font-medium">{i}</span>
              {(i === 0 || i === 5 || i === 10) && (
                <span className="text-xs mt-1 text-center max-w-16">
                  {i === 0 ? "None" : i === 5 ? "Moderate" : "Complete"}
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-gray-600">Low confidence (0-3)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="text-gray-600">High confidence (8-10)</span>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Confidence in Recovery</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Evidence shows that confidence levels correlate with engagement and outcomes; knowing yours lets us tailor the right level of support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
