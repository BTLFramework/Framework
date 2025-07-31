"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Dumbbell, BookOpen, Heart, Target, Clock, Play, CheckCircle, TrendingUp, Wrench, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { usePatientRecoveryData } from "@/hooks/usePatientData"
import { useExercises } from "@/hooks/useExercises"
import { exercises as allExercises } from "@/lib/exerciseLibrary"
import { ExerciseVideoModal } from "@/components/exercise-video-modal"
import { ToolkitModal } from "@/components/toolkit-modal"
import { useAuth } from "@/hooks/useAuth"

export default function RecoveryToolsPage() {
  const router = useRouter()
  const { patient } = useAuth()
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [patientId, setPatientId] = useState<string>("")
  const [completedInsights, setCompletedInsights] = useState<number[]>([])
  
  // Dialog state for toolkit modal
  const [selectedToolkit, setSelectedToolkit] = useState<any>(null)

  // Fetch patient data via SWR
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId, "patient", !!patientId)
  
  // Get patient's personalized exercises from the centralized library
  const patientExercises = patientData ? useExercises(patientData.region, patientData.phase) : []

  // Load patient data and exercises
  useEffect(() => {
    const loadPatientData = () => {
      // Use authenticated patient data instead of localStorage
      if (patient?.email) {
        setPatientId(patient.email)
      }
    }

    const loadCompletedInsights = () => {
      try {
        const stored = localStorage.getItem('btl_completed_insights')
        if (stored) {
          setCompletedInsights(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading completed insights:', error)
      }
    }

    loadPatientData()
    loadCompletedInsights()
  }, [])

  // Resource counts for each category
  const exerciseCount = allExercises.length
  const recoveryGuidesCount = 49 // Based on the toolkit section data
  const supportToolsCount = 4 // Consistent across all files

  const handleInsightComplete = (insightId: number, points?: number) => {
    setCompletedInsights(prev => {
      if (!prev.includes(insightId)) {
        const newCompleted = [...prev, insightId]
        localStorage.setItem('btl_completed_insights', JSON.stringify(newCompleted))
        return newCompleted
      }
      return prev
    })
  }

  const categories = [
    {
      id: "videos",
      name: "Exercise Videos",
      description: "Guided recovery movements",
      longDescription: "Access our comprehensive library of movement and strengthening exercises designed specifically for your recovery phase. Each video includes detailed instructions, proper form guidance, and progression options to support your rehabilitation journey.",
      icon: Dumbbell,
      color: "from-btl-600 to-btl-700",
      bgColor: "from-btl-50 to-btl-100",
      borderColor: "border-btl-200",
      count: exerciseCount,
      onClick: () => setSelectedToolkit({
        title: "Exercise Videos",
        description: "Guided recovery movements",
        category: "videos",
        count: exerciseCount
      })
    },
    {
      id: "guides",
      name: "Recovery Guides",
      description: "Educational resources",
      longDescription: "Explore evidence-based educational content covering pain management, recovery strategies, and lifestyle modifications. Our guides provide practical insights and actionable advice to help you understand your condition and optimize your recovery process.",
      icon: BookOpen,
      color: "from-btl-600 to-btl-700",
      bgColor: "from-btl-50 to-btl-100",
      borderColor: "border-btl-200",
      count: recoveryGuidesCount,
      onClick: () => setSelectedToolkit({
        title: "Recovery Guides",
        description: "Educational resources",
        category: "guides",
        count: recoveryGuidesCount
      })
    },
    {
      id: "tools",
      name: "Support Tools",
      description: "Recovery support utilities",
      longDescription: "Utilize specialized tools and resources designed to enhance your recovery experience. From tracking progress to managing symptoms, these utilities provide additional support to complement your rehabilitation program and daily activities.",
      icon: Heart,
      color: "from-btl-600 to-btl-700",
      bgColor: "from-btl-50 to-btl-100",
      borderColor: "border-btl-200",
      count: supportToolsCount,
      onClick: () => setSelectedToolkit({
        title: "Support Tools",
        description: "Recovery support utilities",
        category: "tools",
        count: supportToolsCount
      })
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header with BackToLife gradient */}
      <div className="back-to-life-gradient px-6 py-8 rounded-t-2xl shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center">
          <Wrench className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">Recovery Tools</h1>
          <p className="text-white/90 text-lg">Comprehensive resources to support your recovery journey</p>
        </div>
        <button 
          onClick={() => router.push('/')} 
          className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Patient Summary */}
          {patientLoading ? (
            <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl shadow-lg p-6 border border-btl-200 mb-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600"></div>
                <span className="ml-3 text-gray-600">Loading your personalized program...</span>
              </div>
            </div>
          ) : patientError ? (
            <div className="bg-gradient-to-r from-red-50 to-white rounded-xl shadow-lg p-6 border border-red-200 mb-8">
              <div className="text-center">
                <p className="text-red-600">Error loading patient data. Please try again later.</p>
              </div>
            </div>
          ) : patientData ? (
            <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl shadow-lg p-6 border border-btl-200 mb-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-btl-800 mb-1">Your Personalized Program</h3>
                  <p className="text-btl-600 font-medium">
                    {patientData.phase} Phase • SRS Score: {patientData.srsScore} • Region: {patientData.region}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-btl-500 font-medium">Available Exercises</div>
                  <div className="text-2xl font-bold text-btl-700">{patientExercises.length}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Main Categories - Stacked Layout */}
          <div className="space-y-4 mb-8">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.id}
                  onClick={category.onClick}
                  className={`bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-all duration-200 group`}
                >
                  {/* Header Row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${category.color} text-white shadow-sm`}>
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-btl-800">{category.name}</h3>
                        <p className="text-btl-600 text-sm font-medium">{category.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-btl-500 font-medium">Available</div>
                      <div className="text-2xl font-bold text-btl-700">{category.count}</div>
                    </div>
                  </div>

                  {/* Resource Info */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-btl-600 mb-3">
                      <div className="flex items-center">
                        <Target className="w-4 h-4 mr-1 text-btl-500" />
                        <span className="font-medium">{category.count} resources available</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1 text-btl-500" />
                        <span className="font-medium">Updated regularly</span>
                      </div>
                    </div>
                    <p className="text-btl-700 text-sm leading-relaxed">
                      {category.longDescription}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div className="flex justify-end">
                    <button className={`bg-gradient-to-r ${category.color} text-white py-2 px-6 rounded-full hover:shadow-md transition-all duration-200 font-medium text-sm group-hover:scale-105`}>
                      <div className="flex items-center">
                        <Play className="w-4 h-4 mr-2" />
                        View All
                      </div>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>


        </div>
      </div>

      {/* Exercise Video Modal */}
      <ExerciseVideoModal
        exercise={selectedExercise}
        open={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />

      {/* Toolkit Modal */}
      {selectedToolkit && (
        <ToolkitModal
          toolkit={selectedToolkit}
          onClose={() => setSelectedToolkit(null)}
        />
      )}
    </div>
  )
}
