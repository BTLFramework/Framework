"use client"

import { X, Clock, Tag, CheckCircle } from "lucide-react"
import { useState } from "react"
import { classifyTier, Mood } from "@/utils/assessment";
import { tierContent } from "@/content/assessmentResponses";
import ResultModal from "./ResultModal";
import { useAuth } from "@/hooks/useAuth";

interface TaskModalProps {
  task: {
    id: number
    title: string
    description: string
    icon: any
    status: string
    timeEstimate: string
    category: string
    points?: number
    pain?: number
    stress?: number
    mood?: string
  }
  onClose: () => void
  onTaskComplete?: (taskData: any) => void
}

export function TaskModal({ task, onClose, onTaskComplete }: TaskModalProps) {
  const { patient } = useAuth();
  const [isCompleted, setIsCompleted] = useState(task.status === "completed")
  const [feedback, setFeedback] = useState("")
  const [score, setScore] = useState(5)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add state for tier and escalate
  const [tier, setTier] = useState<number | undefined>(undefined);
  const [escalate, setEscalate] = useState(false);

  const handleComplete = async () => {
    setIsSubmitting(true)
    
    try {
      // Get patient email from auth context
      const email = patient?.email || ''

      const taskCompletionData = {
        email,
        taskId: task.id,
        taskTitle: task.title,
        points: task.points || 5, // Default 5 points if not specified
        feedback,
        difficultyScore: score
      }

      console.log('🎯 Completing task:', taskCompletionData)

      // Send to backend
      const response = await fetch('/api/patients/complete-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskCompletionData)
      })

      if (!response.ok) {
        throw new Error(`Failed to complete task: ${response.statusText}`)
      }

      const result = await response.json()
      console.log('✅ Task completion result:', result)

      // Update local state
      setIsCompleted(true)

      // Assume task.pain, task.stress, task.mood are available (if not, adjust as needed)
      if (typeof task.pain === 'number' && typeof task.stress === 'number' && task.mood) {
        const computedTier = classifyTier({
          pain: task.pain as 0|1|2|3,
          stress: task.stress as 0|1|2|3,
          mood: task.mood as Mood
        });
        setTier(computedTier);
        // If result.data.escalate is available, set escalate
        if (result.data && typeof result.data.escalate === 'boolean') {
          setEscalate(result.data.escalate);
        } else {
          setEscalate(false);
        }
      }

      // Notify parent component of completion
      if (onTaskComplete) {
        onTaskComplete({
          ...result.data,
          taskId: task.id,
          taskTitle: task.title
        })
      }

      // Note: Patient data is now managed by auth context, not localStorage

      // Show success notification
      if (typeof window !== 'undefined') {
        // Create a simple toast notification
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-emerald-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        toast.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
            </svg>
            <span>+${result.data.pointsEarned} points earned! SRS: ${result.data.newSRSScore}/11</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 4000)
      }

    } catch (error) {
      console.error('❌ Error completing task:', error)
      
      // Show error notification
      if (typeof window !== 'undefined') {
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        toast.innerHTML = `
          <div class="flex items-center space-x-2">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
            </svg>
            <span>Failed to complete task. Please try again.</span>
          </div>
        `
        document.body.appendChild(toast)
        setTimeout(() => {
          document.body.removeChild(toast)
        }, 4000)
      }
    } finally {
      setIsSubmitting(false)
    }
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
                  <div className="flex items-center space-x-1 text-sm font-medium text-teal-600">
                    <span>+{task.points || 5} pts</span>
                  </div>
                </div>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
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
                disabled={isSubmitting}
                className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg hover:bg-teal-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Completing...' : 'Mark as Complete'}
              </button>
            </div>
          ) : (
            // NEW LOGIC: Show ResultModal for tiered feedback
            tier !== undefined ? (
              <ResultModal
                message={tierContent[tier as keyof typeof tierContent].message}
                label={tierContent[tier as keyof typeof tierContent].cta.label}
                route={tierContent[tier as keyof typeof tierContent].cta.route}
                onClose={onClose}
              />
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Task Completed!</h3>
                <p className="text-gray-600">Great job completing this task. Your progress has been recorded.</p>
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-emerald-800 text-sm font-medium">
                    +{task.points || 5} recovery points earned!
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}
