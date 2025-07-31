"use client"

interface PhaseIndicatorProps {
  currentPhase: string
}

export function PhaseIndicator({ currentPhase }: PhaseIndicatorProps) {
  const phases = [
    { name: "RESET", description: "Pain management & initial recovery" },
    { name: "EDUCATE", description: "Learning & understanding" },
    { name: "REBUILD", description: "Strength & function restoration" },
  ]

  const currentIndex = phases.findIndex((phase) => phase.name === currentPhase)

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Recovery Phase</h3>

      <div className="space-y-4">
        {phases.map((phase, index) => {
          const isCurrent = index === currentIndex;
          return (
            <div
              key={phase.name}
              className={`flex items-center space-x-3 relative transition-all duration-200
                ${isCurrent ?
                  'bg-gradient-to-r from-[#155e75] via-[#0891b2] to-[#06b6d4] text-white shadow-lg rounded-xl border-l-8 border-[#06b6d4]' :
                  'bg-white text-gray-900 border border-gray-200 rounded-xl'}
                p-4
              `}
              style={isCurrent ? { boxShadow: '0 4px 16px rgba(21,94,117,0.10)' } : {}}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 mr-2
                  ${index <= currentIndex ?
                    (isCurrent ? 'bg-white text-[#155e75] border-[#0891b2]' : 'bg-teal-100 text-teal-700 border-teal-300') :
                    'bg-gray-100 text-gray-400 border-gray-200'}
                `}
              >
                {index + 1}
              </div>
              <div className="flex-1">
                <div className={`font-medium text-sm ${isCurrent ? 'text-white' : index < currentIndex ? 'text-gray-700' : 'text-gray-400'}`}>{phase.name}</div>
                <div className={`text-xs ${isCurrent ? 'text-white/80' : 'text-gray-500'}`}>{phase.description}</div>
              </div>
              {/* No pill for current phase, highlight is on the card */}
            </div>
          );
        })}
      </div>
    </div>
  )
}
