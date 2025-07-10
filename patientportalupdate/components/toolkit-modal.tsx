"use client"

import { X, Play, Download, BookOpen, Search, Filter, Target, Activity } from "lucide-react"
import { useState } from "react"
import { exercises as allExercises } from "@/lib/exerciseLibrary"
import { ExerciseVideoModal } from "@/components/exercise-video-modal"

interface ToolkitModalProps {
  toolkit: {
    title: string
    description: string
    category: string
    count: number
  }
  onClose: () => void
}

export function ToolkitModal({ toolkit, onClose }: ToolkitModalProps) {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedPhase, setSelectedPhase] = useState("all")

  const getContent = () => {
    switch (toolkit.category) {
      case "videos":
        // Filter exercises based on search and filters
        let filteredExercises = allExercises.filter(exercise => {
          const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesRegion = selectedRegion === "all" || exercise.region === selectedRegion
          const matchesPhase = selectedPhase === "all" || exercise.phase === selectedPhase
          return matchesSearch && matchesRegion && matchesPhase
        })

        // Group exercises by region
        const grouped: { [key: string]: any[] } = {}
        filteredExercises.forEach(exercise => {
          const region = exercise.region || 'Other'
          if (!grouped[region]) {
            grouped[region] = []
          }
          grouped[region].push(exercise)
        })

        // Sort exercises within each region by phase (Reset -> Educate -> Rebuild)
        Object.keys(grouped).forEach(region => {
          grouped[region].sort((a, b) => {
            const phaseOrder = { "Reset": 1, "Educate": 2, "Rebuild": 3 }
            return (phaseOrder[a.phase as keyof typeof phaseOrder] || 0) - (phaseOrder[b.phase as keyof typeof phaseOrder] || 0)
          })
        })

        return grouped
      case "guides":
        return [
          { title: "Understanding Your Recovery", pages: "12 pages", type: "guide" },
          { title: "Pain Management Strategies", pages: "8 pages", type: "guide" },
          { title: "Exercise Safety Guidelines", pages: "6 pages", type: "guide" },
          { title: "Nutrition for Recovery", pages: "10 pages", type: "guide" },
        ]
      case "tools":
        return [
          { title: "Pain Tracking Journal", description: "Daily pain monitoring", type: "tool" },
          { title: "Breathing Exercise Timer", description: "Guided breathing sessions", type: "tool" },
          { title: "Progress Photo Tracker", description: "Visual recovery tracking", type: "tool" },
          { title: "Medication Reminder", description: "Never miss a dose", type: "tool" },
        ]
      default:
        return []
    }
  }

  const content = getContent()

  // Get unique regions and phases for filters
  const regions = ["all", ...Array.from(new Set(allExercises.map(ex => ex.region)))]
  const phases = ["all", "Reset", "Educate", "Rebuild"]

  // Type guard for exercises
  const isExercise = (item: any): item is { name: string; duration: string; difficulty: string; region: string } => {
    return item && typeof item.name === 'string' && typeof item.duration === 'string';
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Reset": return "bg-[#D0F6FB] text-[#005F75] border-[#D0F6FB]" // Light teal with dark text
      case "Educate": return "bg-[#00C7E3] text-white border-[#00C7E3]" // Medium teal with white text
      case "Rebuild": return "bg-[#005F75] text-white border-[#005F75]" // Dark teal with white text
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 rounded-t-xl relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 hover:bg-white/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-white/60">
            <X className="w-6 h-6 text-white opacity-80" />
          </button>
          <div className="flex items-center gap-8">
            <Play className="w-12 h-12 text-white opacity-90" />
            <h2 className="text-3xl font-bold text-white">{toolkit.title}</h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">{toolkit.description}</p>
        </div>
        {/* Filters */}
        {toolkit.category === "videos" && (
          <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-btl-500 focus:border-transparent"
              />
            </div>
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {/* Region Filter */}
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </option>
                  ))}
                </select>
              </div>
              {/* Phase Filter */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                >
                  {phases.map(phase => (
                    <option key={phase} value={phase}>
                      {phase === "all" ? "All Phases" : phase}
                    </option>
                  ))}
                </select>
              </div>
              {/* Clear Filters */}
              {(searchTerm || selectedRegion !== "all" || selectedPhase !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("all")
                    setSelectedPhase("all")
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {toolkit.category === "videos" ? (
            // Grouped Exercise Videos by Region
            <div className="space-y-8">
              {Object.entries(content as { [key: string]: any[] }).map(([region, exercises]) => (
                <div key={region} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                    <h3 className="text-xl font-semibold text-gray-900">{region}</h3>
                    <p className="text-gray-600 text-sm">{Array.isArray(exercises) ? exercises.length : 0} exercises available</p>
                  </div>
                  <div className="p-6">
                    {Array.isArray(exercises) && exercises.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group exercises by phase */}
                        {["Reset", "Educate", "Rebuild"].map(phase => {
                          const phaseExercises = exercises.filter((exercise: any) => exercise.phase === phase)
                          if (phaseExercises.length === 0) return null
                          
                          return (
                            <div key={phase} className="space-y-3">
                              {/* Phase Sub-header */}
                              <div className="flex items-center space-x-3">
                                <h4 className={`text-lg font-semibold px-3 py-1 rounded-full border ${getPhaseColor(phase)}`}>
                                  {phase} Phase
                                </h4>
                                <span className="text-sm text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                                  {phaseExercises.length} exercise{phaseExercises.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              
                              {/* Exercises Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {phaseExercises.map((exercise: any, index: number) => (
                                  <div
                                    key={typeof exercise.id === 'string' ? exercise.id : index}
                                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-btl-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() => setSelectedExercise(exercise)}
                                  >
                                    <div className="p-2 bg-btl-100 rounded-full border-2 border-btl-600">
                                      <Play className="w-5 h-5 text-btl-600" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                                      <p className="text-sm text-gray-600">
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{exercise.duration}</span>
                                        <span className="mx-2">•</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{exercise.difficulty}</span>
                                      </p>
                                    </div>
                                    <button className="px-3 py-1 bg-btl-600 text-white text-sm rounded-full hover:bg-btl-700 transition-colors">
                                      Watch
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">No exercises found for this region.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // Regular Grid Layout for other categories
            <div className="grid gap-4">
              {(content as any[]).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-teal-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="p-2 bg-teal-100 rounded-full border-2 border-teal-600">
                    {item.type === "video" && <Play className="w-5 h-5 text-teal-600" />}
                    {item.type === "guide" && <BookOpen className="w-5 h-5 text-teal-600" />}
                    {item.type === "tool" && <Download className="w-5 h-5 text-teal-600" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 inline-block">{item.duration || item.pages || item.description}</span>
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full hover:bg-teal-700 transition-colors">
                    {item.type === "video" ? "Watch" : item.type === "guide" ? "Read" : "Use"}
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedExercise && isExercise(selectedExercise) && (
            <ExerciseVideoModal
              exercise={selectedExercise}
              open={!!selectedExercise}
              onClose={() => setSelectedExercise(null)}
            />
          )}
        </div>
      </div>
    </div>
  )
}
