"use client"

import { useState, useEffect } from "react"
import { X, Play, CheckCircle, Clock, BarChart3, Target, ChevronLeft, ChevronRight, List } from "lucide-react"
import { usePatientRecoveryData } from "@/hooks/usePatientData"
import { useExercises } from "@/hooks/useExercises"

interface ExerciseModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: (exerciseData: any) => void
  patientId: string
}

export function ExerciseModal({ isOpen, onClose, onComplete, patientId }: ExerciseModalProps) {
  const [currentView, setCurrentView] = useState<'list' | 'exercise'>('list')
  const [selectedExercise, setSelectedExercise] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const [completedExercises, setCompletedExercises] = useState<number[]>([])
  const [showVideo, setShowVideo] = useState(false)

  // Fetch patient data via SWR
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId, "patient", isOpen)
  
  // Get exercises from the centralized library
  const exercises = patientData ? useExercises(patientData.region, patientData.phase) : []

  useEffect(() => {
    if (isOpen) {
      setCurrentView('list')
      setCompletedExercises([])
      setSelectedExercise(0)
      setCurrentStep(0)
      setShowVideo(false)
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }

  // Handle loading state
  if (patientLoading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-btl-600 to-btl-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Loading Exercises...</h2>
                <p className="text-btl-100 text-sm">Please wait while we load your personalized routine</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-btl-600 rounded-lg transition-colors ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600"></div>
          </div>
        </div>
      </div>
    )
  }

  // Handle error state
  if (patientError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">Error Loading Exercises</h2>
                <p className="text-red-100 text-sm">Unable to load your personalized routine</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-red-600 rounded-lg transition-colors ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">Please try again later or contact support.</p>
          </div>
        </div>
      </div>
    )
  }

  // Handle no exercises state
  if (exercises.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
          <div className="bg-gradient-to-r from-btl-600 to-btl-700 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-1">No Exercises Available</h2>
                <p className="text-btl-100 text-sm">No exercises found for your current phase and region</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-btl-600 rounded-lg transition-colors ml-4">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>
          <div className="p-6 text-center">
            <p className="text-gray-600">Please check back later or contact your provider.</p>
          </div>
        </div>
      </div>
    )
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800"
      case "Beginner+": return "bg-blue-100 text-blue-800"
      case "Intermediate": return "bg-yellow-100 text-yellow-800"
      case "Advanced": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Reset": return "bg-blue-50 text-blue-700 border-blue-200"
      case "Educate": return "bg-green-50 text-green-700 border-green-200"
      case "Rebuild": return "bg-purple-50 text-purple-700 border-purple-200"
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  const handleExerciseClick = (index: number) => {
    setSelectedExercise(index)
    setCurrentView('exercise')
    setCurrentStep(0)
    setShowVideo(false)
  }

  const handleCompleteExercise = () => {
    const newCompleted = [...completedExercises, selectedExercise]
    setCompletedExercises(newCompleted)

    // If all exercises completed, close modal and report completion
    if (newCompleted.length === exercises.length) {
      const totalPoints = exercises.reduce((sum, ex) => sum + ex.points, 0)
      onComplete({
        type: 'exercise_session',
        exercisesCompleted: exercises.length,
        totalPoints,
        phase: patientData.phase,
        completedAt: new Date().toISOString()
      })
      onClose()
    } else {
      // Go back to list view
      setCurrentView('list')
    }
  }

  const currentExerciseData = exercises[selectedExercise]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-btl-600 to-btl-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              {currentView === 'list' ? (
                <>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor(patientData.phase || 'Reset')}`}>
                      {patientData.phase || 'Reset'} Phase
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">Today's Movement</h2>
                  <p className="text-btl-100 text-sm">Your personalized exercise routine</p>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-3 mb-2">
                    <button
                      onClick={() => setCurrentView('list')}
                      className="flex items-center space-x-1 text-btl-100 hover:text-white transition-colors"
                    >
                      <ChevronLeft className="w-4 h-4" />
                      <span className="text-sm">Back to List</span>
                    </button>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor(currentExerciseData.phase)}`}>
                      {currentExerciseData.phase} Phase
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(currentExerciseData.difficulty)}`}>
                      {currentExerciseData.difficulty}
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold mb-1">{currentExerciseData.name}</h2>
                  <p className="text-btl-100 text-sm">{currentExerciseData.description}</p>
                </>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-btl-600 rounded-lg transition-colors ml-4"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Info */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className="text-sm">{exercises.reduce((sum, ex) => sum + ex.points, 0)} total points</span>
              </div>
              <div className="flex items-center space-x-2">
                <List className="w-4 h-4" />
                <span className="text-sm">{exercises.length} exercises</span>
              </div>
            </div>
            <div className="text-sm">
              {completedExercises.length} of {exercises.length} completed
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {currentView === 'list' ? (
            /* Exercise List View */
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Exercise Routine</h3>
              {exercises.map((exercise, index) => (
                <div
                  key={index}
                  onClick={() => handleExerciseClick(index)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                    completedExercises.includes(index)
                      ? "bg-green-50 border-green-200"
                      : "bg-white border-gray-200 hover:border-btl-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        completedExercises.includes(index)
                          ? "bg-green-600"
                          : "bg-btl-600"
                      }`}>
                        {completedExercises.includes(index) ? (
                          <CheckCircle className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-0.5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{exercise.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{exercise.description}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <div className="flex items-center space-x-1 text-gray-500">
                            <Clock className="w-4 h-4" />
                            <span className="text-sm px-2 py-0.5 rounded-full bg-gray-100">{exercise.duration}</span>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                            {exercise.difficulty}
                          </span>
                          <span className="text-sm text-btl-600 font-medium px-2 py-0.5 rounded-full bg-btl-100">+{exercise.points} pts</span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))}
              
              {/* Complete Session Button */}
              {completedExercises.length === exercises.length && (
                <div className="text-center pt-6">
                  <button
                    onClick={() => onComplete({
                      type: 'exercise_session',
                      exercisesCompleted: exercises.length,
                      totalPoints: exercises.reduce((sum, ex) => sum + ex.points, 0),
                      phase: patientData.phase,
                      completedAt: new Date().toISOString()
                    })}
                    className="px-8 py-3 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium text-lg"
                  >
                    Complete Session ({exercises.reduce((sum, ex) => sum + ex.points, 0)} points)
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Individual Exercise View */
            <>
              {/* Video Section */}
              {!showVideo ? (
                <div className="mb-6">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 text-center">
                    <div className="w-20 h-20 mx-auto mb-4 bg-btl-600 rounded-full flex items-center justify-center border-2 border-btl-600">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercise Demonstration</h3>
                    <p className="text-gray-600 mb-4">Watch the video to see proper form and technique</p>
                    <button
                      onClick={() => setShowVideo(true)}
                      className="bg-btl-600 text-white px-6 py-3 rounded-full hover:bg-btl-700 transition-colors font-medium"
                    >
                      Watch Video
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center">
                    <div className="text-center text-white">
                      <div className="w-16 h-16 mx-auto mb-4 bg-btl-600 rounded-full flex items-center justify-center border-2 border-btl-600 opacity-50">
                        <Play className="w-8 h-8 text-white ml-1" />
                      </div>
                      <p className="text-lg">{currentExerciseData.name}</p>
                      <p className="text-sm opacity-75">Video ID: {currentExerciseData.videoId}</p>
                      <button
                        onClick={() => setShowVideo(false)}
                        className="mt-4 text-sm text-btl-300 hover:text-white px-3 py-1 rounded-full bg-black/50"
                      >
                        Hide Video
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Instructions */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Step-by-Step Instructions</h3>
                <div className="space-y-3">
                  {currentExerciseData.instructions.map((instruction: string, index: number) => (
                    <div
                      key={index}
                      className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        index === currentStep
                          ? "bg-btl-50 border-2 border-btl-200"
                          : index < currentStep
                          ? "bg-green-50 border-2 border-green-200"
                          : "bg-gray-50 border-2 border-gray-200"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          index === currentStep
                            ? "bg-btl-600 text-white"
                            : index < currentStep
                            ? "bg-green-600 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                      >
                        {index < currentStep ? <CheckCircle className="w-4 h-4" /> : index + 1}
                      </div>
                      <p className="flex-1 text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-4 border-t">
                <button
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed rounded-full"
                >
                  Previous Step
                </button>
                
                <div className="text-sm text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                  Step {currentStep + 1} of {currentExerciseData.instructions.length}
                </div>

                {currentStep < currentExerciseData.instructions.length - 1 ? (
                  <button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="px-4 py-2 bg-btl-600 text-white rounded-full hover:bg-btl-700 transition-colors"
                  >
                    Next Step
                  </button>
                ) : (
                  <button
                    onClick={handleCompleteExercise}
                    className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors font-medium"
                  >
                    Complete Exercise (+{currentExerciseData.points} pts)
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
} 