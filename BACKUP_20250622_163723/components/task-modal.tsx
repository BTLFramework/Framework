"use client"

import { X, Clock, Tag, CheckCircle } from "lucide-react"
import { useState } from "react"

interface TaskModalProps {
  task: {
    id: number
    title: string
    description: string
    icon: any
    status: string
    timeEstimate: string
    category: string
  }
  onClose: () => void
}

export function TaskModal({ task, onClose }: TaskModalProps) {
  const [isCompleted, setIsCompleted] = useState(task.status === "completed")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(5)

  const handleComplete = () => {
    setIsCompleted(true)
    // Here you would typically save to backend
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <task.icon className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
                <div className="flex items-center space-x-4 mt-1">
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Clock className="w-4 h-4" />
                    <span>{task.timeEstimate}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Tag className="w-4 h-4" />
                    <span>{task.category}</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">Instructions</h3>
            <p className="text-gray-600">{task.description}</p>

            {task.category === "Exercise" && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-900 mb-2">Exercise Steps:</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Start with gentle warm-up movements</li>
                  <li>Perform each stretch for 30 seconds</li>
                  <li>Focus on controlled, smooth movements</li>
                  <li>Stop if you experience sharp pain</li>
                </ol>
              </div>
            )}
          </div>

          {!isCompleted ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rate your experience (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(Number.parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1 - Very Difficult</span>
                  <span className="font-medium">{score}</span>
                  <span>10 - Very Easy</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional feedback (optional)</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  rows={3}
                  placeholder="How did this task feel? Any concerns or observations?"
                />
              </div>

              <button
                onClick={handleComplete}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium"
              >
                Mark as Complete
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Completed!</h3>
              <p className="text-gray-600">Great job completing this task. Your progress has been recorded.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
