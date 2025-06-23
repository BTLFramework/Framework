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
        {phases.map((phase, index) => (
          <div key={phase.name} className="flex items-center space-x-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                index <= currentIndex
                  ? "bg-teal-100 text-teal-700 border-2 border-teal-300"
                  : "bg-gray-100 text-gray-400 border-2 border-gray-200"
              }`}
            >
              {index + 1}
            </div>
            <div className="flex-1">
              <div
                className={`font-medium text-sm ${
                  index === currentIndex ? "text-teal-700" : index < currentIndex ? "text-gray-700" : "text-gray-400"
                }`}
              >
                {phase.name}
              </div>
              <div className="text-xs text-gray-500">{phase.description}</div>
            </div>
            {index === currentIndex && (
              <div className="px-2 py-1 bg-teal-100 text-teal-700 text-xs font-medium rounded-full">Current</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
