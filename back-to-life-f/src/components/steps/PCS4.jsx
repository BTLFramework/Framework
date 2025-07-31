import React, { useEffect } from "react";

export default function PCS4({ formData, onChange }) {
  // PCS-4 items (Pain Catastrophizing Scale - 4 item version)
  const pcsItems = [
    {
      id: 1,
      text: "I worry all the time about whether the pain will end",
      category: "Rumination"
    },
    {
      id: 2,
      text: "I feel I can't go on",
      category: "Helplessness"
    },
    {
      id: 3,
      text: "It's terrible and I think it's never going to get any better",
      category: "Magnification"
    },
    {
      id: 4,
      text: "It's awful and I feel that it overwhelms me",
      category: "Magnification"
    }
  ];

  const handlePCSChange = (itemId, value) => {
    const newPCS = { ...formData.pcs4 };
    newPCS[itemId] = parseInt(value);
    onChange({ target: { name: 'pcs4', value: newPCS } });
  };

  const calculatePCSScore = () => {
    if (!formData.pcs4) return null;
    
    let totalScore = 0;
    let answeredCount = 0;
    
    pcsItems.forEach(item => {
      const response = formData.pcs4[item.id];
      if (response !== undefined && response >= 0 && response <= 4) {
        answeredCount++;
        totalScore += response;
      }
    });
    
    return answeredCount === 4 ? totalScore : null;
  };

  const pcsScore = calculatePCSScore();
  
  const getCatastrophizingLevel = (score) => {
    if (score <= 6) return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
    if (score <= 12) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
  };

  const catastrophizingLevel = pcsScore !== null ? getCatastrophizingLevel(pcsScore) : null;

  // Ensure all PCS-4 values are initialized to 0 on mount
  useEffect(() => {
    const updatedPCS4 = { ...formData.pcs4 };
    let changed = false;
    [1,2,3,4].forEach(id => {
      if (updatedPCS4[id] === undefined) {
        updatedPCS4[id] = 0;
        changed = true;
      }
    });
    if (changed) {
      onChange({ target: { name: 'pcs4', value: updatedPCS4 } });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Pain Beliefs</h2>
        <p className="btl-section-subtitle">
          These questions help us understand how you think about your pain. There are no right or wrong answers - we want to understand your perspective.
        </p>
      </div>

      <div className="space-y-6">
        {pcsItems.map((item) => (
          <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 btl-card-hover">
            <div className="mb-6">
              <div className="mb-3">
                <label className="text-lg font-bold text-gray-700">
                  Question {item.id}
                </label>
              </div>
              <p className="text-base font-semibold text-cyan-800 mb-4 leading-relaxed">
                {item.text}
              </p>
              <p className="btl-helper-text">
                Indicate how much you agree or disagree with this statement
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="btl-label">
                  Your Response
                </label>
                <div className="flex items-center space-x-3">
                  <div className={`text-2xl font-bold ${formData.pcs4 && formData.pcs4[item.id] !== undefined ? 'text-cyan-600' : 'text-gray-400'}`}>
                    {formData.pcs4 && formData.pcs4[item.id] !== undefined ? formData.pcs4[item.id] : '-'}
                  </div>
                  <span className="text-lg text-gray-600">/ 4</span>
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={formData.pcs4 && formData.pcs4[item.id] !== undefined ? formData.pcs4[item.id] : 0}
                  onChange={(e) => handlePCSChange(item.id, parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-200 via-yellow-200 to-red-300 rounded-lg cursor-pointer appearance-none focus:outline-none focus:ring-4 focus:ring-cyan-100"
                  style={{
                    background: `linear-gradient(to right, 
                      #bbf7d0 0%, #fef3c7 25%, #fed7aa 50%, 
                      #fecaca 75%, #fca5a5 100%)`
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
                {[0, 1, 2, 3, 4].map((val) => (
                  <div key={val} className="flex flex-col items-center">
                    <span className="font-medium">{val}</span>
                    <span className="text-xs mt-1 text-center max-w-12">
                      {val === 0 ? "Not at all" : val === 1 ? "Slightly" : val === 2 ? "Moderately" : val === 3 ? "Very much" : "Extremely"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {pcsScore !== null && (
        <div className={`mt-6 p-4 ${catastrophizingLevel.bgColor} border ${catastrophizingLevel.borderColor} rounded-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">PCS-4 Assessment Complete</h4>
              <p className="text-sm text-gray-600">
                Score: <span className="font-medium">{pcsScore}/16</span> • 
                Level: <span className={`font-medium ${catastrophizingLevel.color}`}>{catastrophizingLevel.level}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Normalized: <span className="font-medium">{Math.round((pcsScore / 16) * 100)}/100</span>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Pain Catastrophizing Scale (PCS-4)</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Understanding your thoughts about pain helps us provide targeted education and support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 