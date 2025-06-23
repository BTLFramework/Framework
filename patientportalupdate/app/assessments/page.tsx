"use client"

import { useState } from "react"
import { ArrowLeft, FileText, Clock, CheckCircle, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"
import { AssessmentModal } from "@/components/assessment-modal"

export default function AssessmentsPage() {
  const router = useRouter()
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("pending")

  const assessments = [
    {
      id: 1,
      title: "Pain and Disability Index (PDI)",
      description: "Measures how pain affects your daily activities and quality of life",
      status: "pending",
      dueDate: "Today",
      estimatedTime: "5-7 minutes",
      points: 3,
      category: "Pain Assessment",
      lastCompleted: null,
    },
    {
      id: 2,
      title: "Patient-Specific Functional Scale (PSFS)",
      description: "Rate your ability to perform activities important to you",
      status: "pending",
      dueDate: "Tomorrow",
      estimatedTime: "3-5 minutes",
      points: 2,
      category: "Functional Assessment",
      lastCompleted: "2 weeks ago",
    },
    {
      id: 3,
      title: "Oswestry Disability Index",
      description: "Evaluates how back pain affects your daily activities",
      status: "completed",
      completedDate: "2 days ago",
      estimatedTime: "8-10 minutes",
      points: 3,
      category: "Disability Assessment",
      lastCompleted: "2 days ago",
      score: "24% disability",
    },
    {
      id: 4,
      title: "Global Rating of Change (GROC)",
      description: "Rate your overall improvement since starting treatment",
      status: "completed",
      completedDate: "1 week ago",
      estimatedTime: "2 minutes",
      points: 1,
      category: "Progress Assessment",
      lastCompleted: "1 week ago",
      score: "+6 (Much better)",
    },
    {
      id: 5,
      title: "Roland Morris Disability Questionnaire",
      description: "Assesses back pain-related disability in daily activities",
      status: "overdue",
      dueDate: "2 days ago",
      estimatedTime: "5 minutes",
      points: 3,
      category: "Disability Assessment",
      lastCompleted: "1 month ago",
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle
      case "overdue":
        return AlertTriangle
      default:
        return Clock
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-emerald-600 bg-emerald-100 border-emerald-200"
      case "overdue":
        return "text-red-600 bg-red-100 border-red-200"
      default:
        return "text-orange-600 bg-orange-100 border-orange-200"
    }
  }

  const filteredAssessments = assessments.filter((assessment) => {
    if (activeTab === "all") return true
    return assessment.status === activeTab
  })

  const tabs = [
    { id: "pending", name: "Pending", count: assessments.filter((a) => a.status === "pending").length },
    { id: "completed", name: "Completed", count: assessments.filter((a) => a.status === "completed").length },
    { id: "overdue", name: "Overdue", count: assessments.filter((a) => a.status === "overdue").length },
    { id: "all", name: "All", count: assessments.length },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
            <p className="text-gray-600">Complete forms to track your recovery progress</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {assessments.filter((a) => a.status === "pending").length}
              </div>
              <div className="text-gray-600 text-sm">Pending</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {assessments.filter((a) => a.status === "completed").length}
              </div>
              <div className="text-gray-600 text-sm">Completed</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-red-600 mb-1">
                {assessments.filter((a) => a.status === "overdue").length}
              </div>
              <div className="text-gray-600 text-sm">Overdue</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-200 text-center">
              <div className="text-2xl font-bold text-teal-600 mb-1">
                {assessments.filter((a) => a.status === "completed").reduce((sum, a) => sum + a.points, 0)}
              </div>
              <div className="text-gray-600 text-sm">Points Earned</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? "border-teal-500 text-teal-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {tab.name} ({tab.count})
                  </button>
                ))}
              </nav>
            </div>

            {/* Assessment List */}
            <div className="p-6">
              <div className="space-y-4">
                {filteredAssessments.map((assessment) => {
                  const StatusIcon = getStatusIcon(assessment.status)
                  return (
                    <div
                      key={assessment.id}
                      className="border border-gray-200 rounded-lg p-4 hover:border-teal-200 cursor-pointer transition-all duration-200 hover:shadow-md"
                      onClick={() => setSelectedAssessment(assessment)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="bg-gradient-to-br from-teal-100 to-teal-200 p-3 rounded-xl">
                          <FileText className="w-5 h-5 text-teal-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-semibold text-gray-900">{assessment.title}</h3>
                            <div className="flex items-center space-x-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}
                              >
                                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                              </span>
                              <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                                +{assessment.points} pts
                              </span>
                            </div>
                          </div>

                          <p className="text-gray-600 text-sm mb-3">{assessment.description}</p>

                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center space-x-4">
                              <span className="flex items-center">
                                <Clock className="w-3 h-3 mr-1" />
                                {assessment.estimatedTime}
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded-full">{assessment.category}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <StatusIcon className="w-3 h-3" />
                              <span>
                                {assessment.status === "completed"
                                  ? `Completed ${assessment.completedDate}`
                                  : assessment.status === "overdue"
                                    ? `Due ${assessment.dueDate}`
                                    : `Due ${assessment.dueDate}`}
                              </span>
                            </div>
                          </div>

                          {assessment.score && (
                            <div className="mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200">
                              <span className="text-emerald-700 text-sm font-medium">
                                Latest Score: {assessment.score}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredAssessments.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No assessments found</h3>
                  <p className="text-gray-600">No assessments match the current filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} onClose={() => setSelectedAssessment(null)} />
      )}
    </div>
  )
}
