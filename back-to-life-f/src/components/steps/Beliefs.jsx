import React from "react";

export default function Beliefs({ formData, onChange }) {
  const beliefsList = [
    "I worry my body is damaged or fragile",
    "I avoid movement because I fear it will make things worse",
    "I'm afraid that moving might injure me more",
    "I was told something is 'out of place,' and it makes me cautious",
    "I don't fully trust my body to handle activity",
    "I've been told to avoid certain postures or movements",
    "None of these apply",
  ];

  return (
    <section>
      <div className="mb-8">
        <h2 className="btl-section-header">Beliefs About Pain & Movement</h2>
        <p className="btl-section-subtitle">
          Your beliefs about pain and movement can significantly impact your recovery. Select any statements that resonate with how you currently feel about your condition and movement.
        </p>
      </div>
      
      <div className="space-y-4">
        {beliefsList.map((belief, idx) => {
          const isSelected = formData.beliefs.includes(belief);
          const isNoneOption = belief === "None of these apply";
          
          return (
            <div
              key={idx}
              className={`
                btl-radio-item transition-all duration-300 cursor-pointer
                ${isSelected ? 'btl-radio-item selected' : ''}
                ${isNoneOption ? 'border-green-200 hover:border-green-300' : ''}
              `}
              onClick={() => {
                const event = {
                  target: {
                    name: 'beliefs',
                    value: belief,
                    checked: !isSelected
                  }
                };
                onChange(event);
              }}
            >
              <div className="flex items-center space-x-4 w-full">
                <div className="flex-shrink-0">
                  <input
                    type="checkbox"
                    name="beliefs"
                    value={belief}
                    checked={isSelected}
                    onChange={onChange}
                    className="sr-only"
                  />
                  <div className={`
                    w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-200
                    ${isSelected 
                      ? 'bg-gradient-to-br from-cyan-500 to-blue-600 border-cyan-500' 
                      : 'border-gray-300 bg-white'
                    }
                  `}>
                    {isSelected && (
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 flex-1">
                  <span className={`
                    text-sm font-medium transition-colors duration-200
                    ${isSelected ? 'text-cyan-700' : 'text-gray-700'}
                    ${isNoneOption ? 'text-green-700' : ''}
                  `}>
                    {belief}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
        <div className="flex items-start space-x-3">
          <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-semibold text-cyan-800 mb-1">Beliefs About Pain & Movement</h4>
            <p className="text-sm text-cyan-700 leading-relaxed">
              Evidence shows that concerns about movement can slow recovery; identifying them helps us pace activity safely and confidently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
