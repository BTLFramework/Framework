"use client"

import { X, CheckCircle, XCircle } from "lucide-react"

interface ScoreBreakdownModalProps {
  score: number
  onClose: () => void
}

export function ScoreBreakdownModal({ score, onClose }: ScoreBreakdownModalProps) {
  const scoreComponents = [
    { name: "VAS improved ≥2", points: 1, achieved: true, description: "Pain level decreased significantly" },
    { name: "PSFS improved ≥4", points: 2, achieved: true, description: "Functional activities improved" },
    { name: "Confidence increased ≥3", points: 2, achieved: true, description: "Self-confidence in activities" },
    { name: "Belief flag resolved", points: 1, achieved: false, description: "Negative beliefs about recovery" },
    { name: "GROC ≥ +5", points: 1, achieved: true, description: "Global rating of change positive" },
    { name: "Recovery Milestone met", points: 1, achieved: true, description: "Key recovery goal achieved" },
    { name: "Clinical Progress verified", points: 1, achieved: true, description: "Clinician confirmed progress" },
  ]

  const totalAchieved = scoreComponents.filter((c) => c.achieved).reduce((sum, c) => sum + c.points, 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Signature Recovery Score™ Breakdown</h2>
              <p className="text-gray-600 text-sm mt-1">Your current score: {totalAchieved}/11</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            {scoreComponents.map((component, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200">
                <div className="flex-shrink-0 mt-0.5">
                  {component.achieved ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <XCircle className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-medium ${component.achieved ? "text-gray-900" : "text-gray-500"}`}>
                      {component.name}
                    </h3>
                    <span
                      className={`text-sm font-medium ${component.achieved ? "text-emerald-600" : "text-gray-400"}`}
                    >
                      +{component.points}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{component.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-teal-50 rounded-lg p-4 border border-teal-200">
            <h3 className="font-semibold text-teal-900 mb-2">Score Interpretation</h3>
            <div className="text-sm text-teal-800 space-y-1">
              <p>• Score 7+ = REBUILD phase ready</p>
              <p>• Score 9-11 = Graduation ready</p>
              <p>
                • Your current score ({totalAchieved}) indicates:{" "}
                <strong>
                  {totalAchieved >= 9
                    ? "Graduation Ready!"
                    : totalAchieved >= 7
                      ? "REBUILD Ready"
                      : "Continue Current Phase"}
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
