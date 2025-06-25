import React from "react";

export default function DailyActivities({ formData, onChange }) {
  const getActivityDescription = (score) => {
    if (score === 0) return "Unable to perform";
    if (score <= 2) return "Severely limited";
    if (score <= 4) return "Moderately limited";
    if (score <= 6) return "Somewhat limited";
    if (score <= 8) return "Slightly limited";
    return "Able to perform fully";
  };

  const getActivityColor = (score) => {
    if (score === 0) return "text-red-700";
    if (score <= 2) return "text-red-600";
    if (score <= 4) return "text-orange-600";
    if (score <= 6) return "text-yellow-600";
    if (score <= 8) return "text-green-500";
    return "text-green-600";
  };

  const defaultActivities = [
    "Lifting groceries",
    "Climbing stairs", 
    "Playing with kids"
  ];

  const placeholderActivities = [
    "Enter an important daily activity (e.g., lifting groceries)",
    "Enter another activity affected by your condition (e.g., climbing stairs)",
    "Enter a third activity important to you (e.g., playing with kids)"
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Daily Activities Assessment</h2>
        <p className="btl-section-subtitle">
          Rate how well you can currently perform these important daily activities. This helps us understand your functional limitations and track your progress.
        </p>
      </div>
      
      <div className="space-y-6">
        {formData.psfs.map((item, index) => (
          <div key={index} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 btl-card-hover">
            <div className="mb-6">
              <label className="btl-label block mb-2">
                Activity {index + 1} *
              </label>
                              <div className="relative">
                  <input
                    type="text"
                    value={item.activity}
                    onChange={(e) => onChange(index, "activity", e.target.value)}
                    placeholder={placeholderActivities[index] || "Enter an important daily activity"}
                    className="btl-input block w-full pr-20"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
                    {item.activity && (
                      <button
                        type="button"
                        onClick={() => onChange(index, "activity", "")}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                        title="Clear activity"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                    <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                </div>
              <p className="btl-helper-text">
                Choose an activity that's important to you and affected by your condition
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="btl-label">
                  Current Performance Level
                </label>
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl font-bold ${getActivityColor(item.score)}`}>
                    {item.score}
                  </div>
                  <span className="text-lg text-gray-600">/ 10</span>
                </div>
              </div>
              
              <div className={`text-center mb-4 font-medium ${getActivityColor(item.score)}`}>
                {getActivityDescription(item.score)}
              </div>

              <div className="relative mb-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={item.score}
                  onChange={(e) => onChange(index, "score", Number(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 to-green-300 rounded-lg cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-cyan-100"
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
                        {i === 0 ? "Unable" : i === 5 ? "Moderate" : "Full ability"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Patient-Specific Functional Scale (PSFS)</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Evidence shows that rating your own key activities helps set personal goals and predicts functional improvement over time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
