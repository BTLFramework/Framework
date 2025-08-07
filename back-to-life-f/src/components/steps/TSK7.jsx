import React from "react";

export default function TSK7({ formData, onChange }) {
  // TSK-7 items with reverse-scored items marked (matching patient portal)
  const tskItems = [
    {
      id: 1,
      text: "I avoid certain movements because I worry they'll make my pain worse",
      category: "Fear of Movement"
    },
    {
      id: 2,
      text: "I feel safe being physically active, even if I feel a little discomfort",
      category: "Movement Confidence"
    },
    {
      id: 3,
      text: "I worry that doing too much could delay my recovery",
      category: "Recovery Concerns"
    },
    {
      id: 4,
      text: "I think my body is fragile and needs to be protected",
      category: "Body Confidence"
    },
    {
      id: 5,
      text: "If something hurts, I assume it's causing damage",
      category: "Pain Interpretation"
    },
    {
      id: 6,
      text: "Just because something hurts doesn't mean it's harmful",
      category: "Pain Understanding"
    },
    {
      id: 7,
      text: "I'm confident in my body's ability to handle movement",
      category: "Body Confidence"
    }
  ];

  const handleTSKChange = (itemId, value) => {
    const newTSK = { ...formData.tsk7 };
    newTSK[itemId] = parseInt(value);
    onChange({ target: { name: 'tsk7', value: newTSK } });
  };

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Fear of Movement Assessment</h2>
        <p className="btl-section-subtitle">
          Please rate how much you agree with each statement about your current condition and movement. This helps us understand your confidence in movement and recovery.
        </p>
      </div>
      
      <div className="space-y-6">
        {tskItems.map((item) => (
          <div key={item.id} className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100 btl-card-hover">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <label className="btl-label block text-lg font-medium text-gray-900 flex-1 pr-4">
                  {item.text}
                </label>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[1, 2, 3, 4].map((value) => (
                <label
                  key={value}
                  className={`relative flex flex-col items-center p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    formData.tsk7?.[item.id] === value
                      ? 'border-btl-500 bg-btl-50 text-btl-700 shadow-md'
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
                  <div className="text-xl font-bold mb-2">{value}</div>
                  <div className="text-xs text-center leading-tight font-medium">
                    {value === 1 && "Strongly Disagree"}
                    {value === 2 && "Disagree"}
                    {value === 3 && "Agree"}
                    {value === 4 && "Strongly Agree"}
                  </div>
                </label>
              ))}
            </div>

            {formData.tsk7?.[item.id] && (
              <div className="mt-4 p-3 bg-btl-50 border border-btl-200 rounded-lg">
                <div className="text-sm text-btl-700">
                  <span className="font-medium">Your response:</span>{" "}
                  {formData.tsk7[item.id] === 1 && "Strongly Disagree"}
                  {formData.tsk7[item.id] === 2 && "Disagree"}
                  {formData.tsk7[item.id] === 3 && "Agree"}
                  {formData.tsk7[item.id] === 4 && "Strongly Agree"}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Progress Indicator */}
      <div className="mt-8 bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
          <span className="font-medium">Assessment Progress</span>
          <span className="font-medium">{Object.keys(formData.tsk7 || {}).filter(key => formData.tsk7[key] !== undefined && formData.tsk7[key] !== null).length} / 7 questions answered</span>
        </div>
        <div className="bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-btl-500 to-btl-600 h-3 rounded-full transition-all duration-300"
            style={{ width: `${(Object.keys(formData.tsk7 || {}).filter(key => formData.tsk7[key] !== undefined && formData.tsk7[key] !== null).length / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Information section */}
      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Fear of Movement Assessment</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Understanding your confidence in movement helps us create a recovery plan that addresses both physical and psychological aspects of your condition. This assessment is based on evidence showing that movement confidence significantly impacts recovery outcomes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}