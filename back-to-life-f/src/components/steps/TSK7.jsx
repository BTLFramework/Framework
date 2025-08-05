import React, { useEffect } from "react";

export default function TSK7({ formData, onChange }) {
  // TSK-7 items with reverse-scored items marked (matching patient portal)
  const tskItems = [
    {
      id: 1,
      text: "I avoid certain movements because I worry they'll make my pain worse",
      category: "Fear of Movement",
      reverseScored: false
    },
    {
      id: 2,
      text: "I feel safe being physically active, even if I feel a little discomfort",
      category: "Movement Confidence",
      reverseScored: true
    },
    {
      id: 3,
      text: "I worry that doing too much could delay my recovery",
      category: "Recovery Concerns",
      reverseScored: false
    },
    {
      id: 4,
      text: "I think my body is fragile and needs to be protected",
      category: "Body Confidence",
      reverseScored: false
    },
    {
      id: 5,
      text: "If something hurts, I assume it's causing damage",
      category: "Pain Interpretation",
      reverseScored: false
    },
    {
      id: 6,
      text: "Just because something hurts doesn't mean it's harmful",
      category: "Pain Understanding",
      reverseScored: true
    },
    {
      id: 7,
      text: "I'm confident in my body's ability to handle movement",
      category: "Body Confidence",
      reverseScored: true
    }
  ];

  const handleTSKChange = (itemId, value) => {
    const newTSK = { ...formData.tsk7 };
    newTSK[itemId] = parseInt(value);
    onChange({ target: { name: 'tsk7', value: newTSK } });
  };

  const calculateTSK7Score = () => {
    if (!formData.tsk7) return null;
    
    let rawScore = 0;
    let answeredCount = 0;
    
    // TSK-7 items with reverse-scored items (2, 6, 7)
    const reverseScoredItems = [2, 6, 7];
    
    for (let i = 1; i <= 7; i++) {
      const response = formData.tsk7[i];
      if (response !== undefined && response >= 1 && response <= 4) {
        answeredCount++;
        if (reverseScoredItems.includes(i)) {
          rawScore += (5 - response); // Reverse score: 1→4, 2→3, 3→2, 4→1
        } else {
          rawScore += response;
        }
      }
    }
    
    return answeredCount === 7 ? rawScore : null;
  };

  const tskScore = calculateTSK7Score();
  const faScore = tskScore !== null ? Math.round(((tskScore - 7) / 21) * 100) : null;
  
  const getFearAvoidanceLevel = (score) => {
    if (score <= 30) return { level: "Low", color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" };
    if (score <= 50) return { level: "Moderate", color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200" };
    return { level: "High", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
  };

  const fearLevel = faScore !== null ? getFearAvoidanceLevel(faScore) : null;

  // Auto-save when score changes
  useEffect(() => {
    if (tskScore !== null) {
      console.log(`TSK-7 Score: ${tskScore}/28 (${faScore}% fear-avoidance)`);
    }
  }, [tskScore, faScore]);

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Fear-Avoidance Assessment</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Please rate how much you agree with each statement about your current condition.
        </p>
      </div>

      {/* Score Display */}
      {tskScore !== null && (
        <div className={`p-4 rounded-lg border-2 ${fearLevel?.borderColor} ${fearLevel?.bgColor} mb-6`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">Fear-Avoidance Level</h3>
              <p className={`text-sm ${fearLevel?.color}`}>
                {fearLevel?.level} ({faScore}%)
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">{tskScore}</div>
              <div className="text-sm text-gray-500">/ 28</div>
            </div>
          </div>
          <div className="mt-2 bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                fearLevel?.level === 'Low' ? 'bg-green-500' :
                fearLevel?.level === 'Moderate' ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${(tskScore / 28) * 100}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="space-y-4">
        {tskItems.map((item) => (
          <div key={item.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="mb-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900 flex-1 pr-4">
                  {item.text}
                </h3>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  {item.category}
                </span>
              </div>
              {item.reverseScored && (
                <p className="text-xs text-blue-600 mb-3">
                  ✨ This item is reverse-scored (higher agreement = lower fear)
                </p>
              )}
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((value) => (
                <label
                  key={value}
                  className={`relative flex flex-col items-center p-3 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                    formData.tsk7?.[item.id] === value
                      ? 'border-btl-500 bg-btl-50 text-btl-700'
                      : 'border-gray-200 hover:border-btl-300 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name={`tsk7_${item.id}`}
                    value={value}
                    checked={formData.tsk7?.[item.id] === value}
                    onChange={(e) => handleTSKChange(item.id, parseInt(e.target.value))}
                    className="sr-only"
                  />
                  <div className="text-lg font-semibold mb-1">{value}</div>
                  <div className="text-xs text-center leading-tight">
                    {value === 1 && "Strongly Disagree"}
                    {value === 2 && "Disagree"}
                    {value === 3 && "Agree"}
                    {value === 4 && "Strongly Agree"}
                  </div>
                </label>
              ))}
            </div>

            {formData.tsk7?.[item.id] && (
              <div className="mt-3 text-sm text-gray-600">
                Your response: <span className="font-medium">
                  {formData.tsk7[item.id] === 1 && "Strongly Disagree"}
                  {formData.tsk7[item.id] === 2 && "Disagree"}
                  {formData.tsk7[item.id] === 3 && "Agree"}
                  {formData.tsk7[item.id] === 4 && "Strongly Agree"}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Object.keys(formData.tsk7 || {}).length} / 7 questions answered</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div 
            className="bg-btl-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(formData.tsk7 || {}).length / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Clinical Information */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">Understanding Your Score</h4>
        <div className="text-sm text-blue-800 space-y-1">
          <p><strong>Low Fear-Avoidance (≤8 points):</strong> You feel confident moving and don't avoid activities due to fear.</p>
          <p><strong>Moderate Fear-Avoidance (9-14 points):</strong> You have some concerns about movement but are generally willing to be active.</p>
          <p><strong>High Fear-Avoidance (≥15 points):</strong> You may avoid activities due to fear of pain or injury.</p>
        </div>
      </div>
    </div>
  );
}