"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Search, Play, Download, BookOpen, Dumbbell, Target, Clock } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { usePatientRecoveryData } from "@/hooks/usePatientData"
import { useExercises } from "@/hooks/useExercises"
import { exercises as allExercises } from "@/lib/exerciseLibrary"
import { ExerciseVideoModal } from "@/components/exercise-video-modal"

export default function RecoveryToolsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedExercise, setSelectedExercise] = useState<any>(null)
  const [patientId, setPatientId] = useState<string>("")

  // Get URL parameters for filtering
  const phaseFilter = searchParams.get('phase')
  const regionFilter = searchParams.get('region')

  // Fetch patient data via SWR
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId, "patient", !!patientId)
  
  // Get patient's personalized exercises from the centralized library
  const patientExercises = patientData ? useExercises(patientData.region, patientData.phase) : []

  // Load patient data and exercises
  useEffect(() => {
    const loadPatientData = () => {
      try {
        const stored = localStorage.getItem('btl_patient_data')
        if (stored) {
          const data = JSON.parse(stored)
          setPatientId(data.email || "test@example.com")
        }
      } catch (error) {
        console.error('Error loading patient data:', error)
        setPatientId("test@example.com")
      }
    }

    loadPatientData()
  }, [])

  // Set initial category based on URL parameters
  useEffect(() => {
    if (phaseFilter || regionFilter) {
      setActiveCategory("videos")
    }
  }, [phaseFilter, regionFilter])

  // Group exercises by region for better organization
  const groupExercisesByRegion = (exercises: any[]) => {
    const grouped: { [key: string]: any[] } = {}
    exercises.forEach(exercise => {
      const region = (exercise as any).region || (exercise as any).exerciseData?.region || 'Other'
      if (!grouped[region]) {
        grouped[region] = []
      }
      grouped[region].push(exercise)
    })
    return grouped
  }

  const categories = [
    { id: "all", name: "All Tools", count: 24 + patientExercises.length + allExercises.length },
    { id: "exercises", name: "My Exercises", count: patientExercises.length },
    { id: "videos", name: "Exercise Videos", count: 12 + allExercises.length },
    { id: "guides", name: "Recovery Guides", count: 8 },
    { id: "tools", name: "Support Tools", count: 4 },
  ]

  const tools = [
    {
      id: 1,
      title: "Morning Mobility Routine",
      description: "Start your day with gentle movements to improve flexibility",
      category: "videos",
      duration: "15 min",
      difficulty: "Beginner",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "video",
    },
    {
      id: 2,
      title: "Core Strengthening Series",
      description: "Build core stability with progressive exercises",
      category: "videos",
      duration: "20 min",
      difficulty: "Intermediate",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "video",
    },
    {
      id: 3,
      title: "Understanding Your Recovery",
      description: "Comprehensive guide to the recovery process",
      category: "guides",
      pages: "12 pages",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "guide",
    },
    {
      id: 4,
      title: "Pain Management Strategies",
      description: "Evidence-based techniques for managing discomfort",
      category: "guides",
      pages: "8 pages",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "guide",
    },
    {
      id: 5,
      title: "Progress Tracking Journal",
      description: "Digital tool to monitor your daily recovery metrics",
      category: "tools",
      features: "Charts & Analytics",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "tool",
    },
    {
      id: 6,
      title: "Breathing Exercise Timer",
      description: "Guided breathing sessions with customizable timing",
      category: "tools",
      features: "Audio Guidance",
      difficulty: "All Levels",
      thumbnail: "/placeholder.svg?height=120&width=200",
      type: "tool",
    },
  ]

  // Convert exercises to tool format
  const exerciseTools = patientExercises.map((exercise, index) => ({
    id: `exercise-${index}`,
    title: exercise.name,
    description: exercise.description,
    category: "exercises",
    duration: exercise.duration,
    difficulty: exercise.difficulty,
    points: exercise.points,
    phase: exercise.phase,
    region: exercise.region,
    type: "exercise",
    exerciseData: exercise
  }))

  // Add ALL exercises to video library with placeholders
  const allExerciseVideos = allExercises.map((exercise, index) => ({
    id: `video-${exercise.videoId}`,
    title: exercise.name,
    description: exercise.description,
    category: "videos",
    duration: exercise.duration,
    difficulty: exercise.difficulty,
    phase: exercise.phase,
    region: exercise.region,
    srsRange: "4-7", // Default range since we don't have SRS in new library
    thumbnail: "/placeholder.svg?height=120&width=200",
    type: "video",
    exerciseData: exercise
  }))

  // Combine regular tools with exercises and videos
  const allTools = [...exerciseTools, ...allExerciseVideos, ...tools]

  const filteredTools = allTools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    // Apply URL parameter filters
    const matchesPhase = !phaseFilter || (tool as any).phase === phaseFilter
    const matchesRegion = !regionFilter || (tool as any).region === regionFilter
    
    return matchesCategory && matchesSearch && matchesPhase && matchesRegion
  })

  // Group filtered tools by region for exercise videos
  const groupedExerciseVideos = groupExercisesByRegion(
    filteredTools.filter(tool => tool.category === "videos" && (tool as any).exerciseData)
  )

  const getIcon = (type: string) => {
    switch (type) {
      case "video":
        return Play
      case "guide":
        return BookOpen
      case "tool":
        return Download
      default:
        return FileText
    }
  }

  const getActionText = (type: string) => {
    switch (type) {
      case "video":
        return "Watch"
      case "guide":
        return "Read"
      case "tool":
        return "Use"
      default:
        return "Open"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recovery Tools</h1>
              <p className="text-gray-600">Videos, guides, and tools to support your recovery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tools, videos, and guides..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>
              <div className="flex space-x-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      activeCategory === category.id
                        ? "bg-teal-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {category.name} ({category.count})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Status */}
          {(phaseFilter || regionFilter) && (
            <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl shadow-lg p-6 border border-btl-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Filtered Results</h3>
                  <p className="text-gray-600">
                    {phaseFilter && `Phase: ${phaseFilter}`}
                    {phaseFilter && regionFilter && " • "}
                    {regionFilter && `Region: ${regionFilter}`}
                  </p>
                </div>
                <button
                  onClick={() => {
                    router.push('/recovery-tools')
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Patient Summary */}
          {patientLoading ? (
            <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl shadow-lg p-6 border border-btl-200 mb-6">
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600"></div>
                <span className="ml-3 text-gray-600">Loading your personalized program...</span>
              </div>
            </div>
          ) : patientError ? (
            <div className="bg-gradient-to-r from-red-50 to-white rounded-xl shadow-lg p-6 border border-red-200 mb-6">
              <div className="text-center">
                <p className="text-red-600">Error loading patient data. Please try again later.</p>
              </div>
            </div>
          ) : patientData ? (
            <div className="bg-gradient-to-r from-btl-50 to-white rounded-xl shadow-lg p-6 border border-btl-200 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">Your Personalized Program</h3>
                  <p className="text-gray-600">
                    {patientData.phase} Phase • SRS Score: {patientData.srsScore} • Region: {patientData.region}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500">Available Exercises</div>
                  <div className="text-2xl font-bold text-btl-600">{patientExercises.length}</div>
                </div>
              </div>
            </div>
          ) : null}

          {/* Tools Grid */}
          {activeCategory === "videos" ? (
            // Grouped Exercise Videos by Region
            <div className="space-y-8">
              {Object.entries(groupedExerciseVideos).map(([region, exercises]) => (
                <div key={region} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                    <h3 className="text-xl font-semibold text-gray-900">{region}</h3>
                    <p className="text-gray-600 text-sm">{Array.isArray(exercises) ? exercises.length : 0} exercises available</p>
                  </div>
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.isArray(exercises) && exercises.length > 0 ? (
                        exercises.map((tool) => (
                          <div
                            key={tool.id}
                            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                          >
                            <div className="relative">
                              <img
                                src={(tool as any).thumbnail || "/placeholder.svg"}
                                alt={tool.title}
                                className="w-full h-32 object-cover"
                              />
                              <div className="absolute top-2 right-2">
                                <div className="bg-white bg-opacity-90 rounded-full p-2 border-2 border-teal-600">
                                  <Play className="w-4 h-4 text-teal-600" />
                                </div>
                              </div>
                              <div className="absolute top-2 left-2">
                                <span className="text-xs bg-btl-600 text-white px-2 py-1 rounded-full font-medium">
                                  {(tool as any).phase} Phase
                                </span>
                              </div>
                            </div>

                            <div className="p-4">
                              <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                              <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>

                              <div className="mb-3 p-2 bg-gray-50 rounded-xl text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="text-gray-600 px-2 py-0.5 rounded-full bg-gray-200">SRS: {(tool as any).srsRange}</span>
                                  <span className="text-gray-600 px-2 py-0.5 rounded-full bg-gray-200">{(tool as any).region}</span>
                                </div>
                              </div>

                              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                <span className="px-2 py-0.5 rounded-full bg-gray-100">{tool.duration}</span>
                                <span className="bg-gray-100 px-2 py-1 rounded-full">{tool.difficulty}</span>
                              </div>

                              <button 
                                onClick={() => setSelectedExercise(tool.exerciseData || tool)}
                                className="w-full bg-gradient-to-r from-btl-600 to-btl-700 text-white py-2 px-4 rounded-xl hover:from-btl-700 hover:to-btl-800 transition-all duration-200 font-medium"
                              >
                                Watch Video
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center text-gray-500 py-8">No exercises found for this region.</div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Regular Grid Layout for other categories
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTools.map((tool) => {
                const IconComponent = getIcon(tool.type)
                return (
                  <div
                    key={tool.id}
                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                  >
                    {/* Exercise vs Regular Tool Rendering */}
                    {tool.type === "exercise" ? (
                      <>
                        {/* Exercise Header */}
                        <div className="relative bg-gradient-to-br from-btl-50 to-btl-100 p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="bg-btl-600 rounded-full p-2">
                                <Dumbbell className="w-4 h-4 text-white" />
                              </div>
                                                           <span className="text-xs font-medium text-btl-700 bg-btl-200 px-2 py-1 rounded-full">
                               {(tool as any).phase} Phase
                             </span>
                           </div>
                           <div className="text-right">
                             <div className="flex items-center space-x-1 text-btl-600">
                               <Target className="w-3 h-3" />
                               <span className="text-xs font-medium">+{(tool as any).points} pts</span>
                             </div>
                            </div>
                          </div>
                          <div className="text-center py-4">
                            <div className="w-12 h-12 mx-auto bg-btl-600 rounded-full flex items-center justify-center mb-2 border-2 border-btl-600">
                              <Play className="w-6 h-6 text-white ml-0.5" />
                            </div>
                            <p className="text-xs text-btl-600 font-medium">Personalized Exercise</p>
                          </div>
                        </div>

                        {/* Exercise Content */}
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-3 h-3" />
                              <span>{tool.duration}</span>
                            </div>
                            <span className="bg-btl-100 text-btl-700 px-2 py-1 rounded-full font-medium">
                              {tool.difficulty}
                            </span>
                          </div>

                          <button 
                            onClick={() => setSelectedExercise(tool)}
                            className="w-full bg-gradient-to-r from-btl-600 to-btl-700 text-white py-2 px-4 rounded-xl hover:from-btl-700 hover:to-btl-800 transition-all duration-200 font-medium"
                          >
                            Start Exercise
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* Regular Tool Rendering */}
                        <div className="relative">
                          <img
                            src={(tool as any).thumbnail || "/placeholder.svg"}
                            alt={tool.title}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <div className="bg-white bg-opacity-90 rounded-full p-2 border-2 border-teal-600">
                              <IconComponent className="w-4 h-4 text-teal-600" />
                            </div>
                          </div>
                        </div>

                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>

                                                     <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                             <span className="px-2 py-0.5 rounded-full bg-gray-100">{tool.duration || (tool as any).pages || (tool as any).features}</span>
                             <span className="bg-gray-100 px-2 py-1 rounded-full">{tool.difficulty}</span>
                           </div>

                          <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-xl hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium">
                            {getActionText(tool.type)}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {filteredTools.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tools found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </div>

      {/* Exercise Video Modal */}
      <ExerciseVideoModal
        exercise={selectedExercise}
        open={!!selectedExercise}
        onClose={() => setSelectedExercise(null)}
      />
    </div>
  )
}
