"use client"

import { X, Clock, Award, ArrowRight } from "lucide-react"

interface AssessmentModalProps {
  assessment: {
    title: string
    description: string
    status: string
    timeInfo: string
    points: number
  }
  onClose: () => void
}

export function AssessmentModal({ assessment, onClose }: AssessmentModalProps) {
  const handleStartAssessment = () => {
    // Here you would navigate to the actual assessment
    alert(`Starting ${assessment.title}...`)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{assessment.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{assessment.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <Clock className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-blue-900">Time Required</p>
                <p className="text-sm text-blue-700">5-7 minutes</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-teal-50 rounded-lg border border-teal-200">
              <Award className="w-5 h-5 text-teal-600" />
              <div>
                <p className="font-medium text-teal-900">Points Reward</p>
                <p className="text-sm text-teal-700">+{assessment.points} recovery points</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-medium text-gray-900 mb-2">What to expect:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Rate your pain levels in different activities</li>
              <li>• Answer questions about daily functioning</li>
              <li>• Track your progress over time</li>
              <li>• Get personalized insights</li>
            </ul>
          </div>

          {assessment.status === "Completed" ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Assessment Completed!</h3>
              <p className="text-gray-600 text-sm">You earned +{assessment.points} recovery points</p>
            </div>
          ) : (
            <button
              onClick={handleStartAssessment}
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 px-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
