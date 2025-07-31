import React, { useEffect } from "react";

export default function TSK11({ formData, onChange }) {
  // TSK-11 items with reverse-scored items marked
  const tskItems = [
    {
      id: 1,
      text: "I'm afraid I might injure myself if I exercise",
      reverseScored: false
    },
    {
      id: 2,
      text: "If I tried to overcome it, my pain would increase",
      reverseScored: false
    },
    {
      id: 3,
      text: "My body is telling me something dangerously wrong",
      reverseScored: false
    },
    {
      id: 4,
      text: "Pain would probably be relieved if I exercised",
      reverseScored: true
    },
    {
      id: 5,
      text: "I'm afraid that I might injure myself accidentally",
      reverseScored: false
    },
    {
      id: 6,
      text: "If I exercise, it's probably unsafe for my body",
      reverseScored: false
    },
    {
      id: 7,
      text: "My pain would increase if I became active",
      reverseScored: false
    },
    {
      id: 8,
      text: "I can't do physical activities which (don't) make my pain worse",
      reverseScored: true
    },
    {
      id: 9,
      text: "I'm confident I can do physical activities despite pain",
      reverseScored: true
    },
    {
      id: 10,
      text: "It's not really safe for a person with a condition like mine to be physically active",
      reverseScored: false
    },
    {
      id: 11,
      text: "I'm afraid that I might injure myself if I became active",
      reverseScored: false
    }
  ];

  const handleTSKChange = (itemId, value) => {
    const newTSK = { ...formData.tsk11 };
    newTSK[itemId] = parseInt(value);
    onChange({ target: { name: 'tsk11', value: newTSK } });
  };

  const calculateTSK11Score = () => {
    if (!formData.tsk11) return null;
    
    let rawScore = 0;
    let answeredCount = 0;
    
    // TSK-11 items with reverse-scored items (4, 8, 9)
    const reverseScoredItems = [4, 8, 9];
    
    for (let i = 1; i <= 11; i++) {
      const response = formData.tsk11[i];
      if (response !== undefined && response >= 0 && response <= 4) {
        answeredCount++;
        if (reverseScoredItems.includes(i)) {
          rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
        } else {
          rawScore += response;
        }
      }
    }
    
    return answeredCount === 11 ? rawScore : null;
  };

  const tskScore = calculateTSK11Score();
  const faScore = tskScore !== null ? Math.round(((tskScore - 11) / 33) * 100) : null;
  
  const getFearAvoidanceLevel = (score) => {
    if (score <= 33) return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
    if (score <= 50) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
  };

  const fearAvoidanceLevel = faScore !== null ? getFearAvoidanceLevel(faScore) : null;

  // Add useEffect to reset state when formData changes (e.g., new intake)
  useEffect(() => {
    if (formData && Object.keys(formData.tsk11 || {}).length === 0) {
      // Assuming setLocalTSK11 is the local state setter for TSK-11
      // If not, this might need to be adjusted based on how TSK-11 state is managed
      // For now, we'll just ensure it's empty if formData is empty
      // This might require a local state variable to be defined here
      // setLocalTSK11({}); 
    }
  }, [formData]);

  // Ensure all TSK-11 values are initialized to 0 on mount
  useEffect(() => {
    const updatedTSK11 = { ...formData.tsk11 };
    let changed = false;
    for (let id = 1; id <= 11; id++) {
      if (updatedTSK11[id] === undefined) {
        updatedTSK11[id] = 0;
        changed = true;
      }
    }
    if (changed) {
      onChange({ target: { name: 'tsk11', value: updatedTSK11 } });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Fear of Movement</h2>
        <p className="btl-section-subtitle">
          These questions measure how comfortable you feel moving while in pain. Your answers help us tailor the right pacing and education for your recovery.
        </p>
      </div>

      <div className="space-y-6">
        {tskItems.map((item) => (
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
                  <div className={`text-2xl font-bold ${formData.tsk11 && formData.tsk11[item.id] !== undefined ? 'text-cyan-600' : 'text-gray-400'}`}>
                    {formData.tsk11 && formData.tsk11[item.id] !== undefined ? formData.tsk11[item.id] : '-'}
                  </div>
                  <span className="text-lg text-gray-600">/ 4</span>
                </div>
              </div>

              <div className="relative mb-4">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={formData.tsk11 && formData.tsk11[item.id] !== undefined ? formData.tsk11[item.id] : 0}
                  onChange={(e) => handleTSKChange(item.id, parseInt(e.target.value))}
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
                      {val === 0 ? "Strongly disagree" : val === 1 ? "Disagree" : val === 2 ? "Agree" : val === 3 ? "Strongly agree" : "Strongly agree"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {tskScore !== null && (
        <div className={`mt-6 p-4 ${fearAvoidanceLevel.bgColor} border ${fearAvoidanceLevel.borderColor} rounded-xl`}>
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 mb-1">TSK-11 Assessment Complete</h4>
              <p className="text-sm text-gray-600">
                Raw Score: <span className="font-medium">{tskScore}/44</span> • 
                Fear Level: <span className={`font-medium ${fearAvoidanceLevel.color}`}>{fearAvoidanceLevel.level}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                Normalized: <span className="font-medium">{faScore}/100</span>
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
            <h4 className="font-semibold text-cyan-800 mb-1">Tampa Scale for Kinesiophobia (TSK-11)</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Understanding your thoughts about movement helps us create a safe, gradual approach to physical activity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
} 