"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Search, Play, Download, BookOpen } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RecoveryToolsPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const categories = [
    { id: "all", name: "All Tools", count: 24 },
    { id: "videos", name: "Exercise Videos", count: 12 },
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

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCategory === "all" || tool.category === activeCategory
    const matchesSearch =
      tool.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recovery Tools</h1>
            <p className="text-gray-600">Videos, guides, and tools to support your recovery</p>
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

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => {
              const IconComponent = getIcon(tool.type)
              return (
                <div
                  key={tool.id}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
                >
                  <div className="relative">
                    <img
                      src={tool.thumbnail || "/placeholder.svg"}
                      alt={tool.title}
                      className="w-full h-32 object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <div className="bg-white bg-opacity-90 rounded-full p-2">
                        <IconComponent className="w-4 h-4 text-teal-600" />
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tool.description}</p>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>{tool.duration || tool.pages || tool.features}</span>
                      <span className="bg-gray-100 px-2 py-1 rounded-full">{tool.difficulty}</span>
                    </div>

                    <button className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 px-4 rounded-lg hover:from-teal-700 hover:to-teal-800 transition-all duration-200 font-medium">
                      {getActionText(tool.type)}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>

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
    </div>
  )
}
