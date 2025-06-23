"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface AssessmentCardProps {
  assessment: {
    title: string
    description: string
    icon: any
    status: "pending" | "completed" | "due"
    dueDate?: string
    completedDate?: string
  }
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const getStatusInfo = () => {
    switch (assessment.status) {
      case "completed":
        return {
          icon: <CheckCircle className="w-5 h-5 text-emerald-500" />,
          text: `Completed ${assessment.completedDate}`,
          color: "text-emerald-600",
        }
      case "due":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          text: `Due ${assessment.dueDate}`,
          color: "text-red-600",
        }
      default:
        return {
          icon: <Clock className="w-5 h-5 text-blue-500" />,
          text: `Due ${assessment.dueDate}`,
          color: "text-blue-600",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <div className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-teal-200 hover:shadow-sm transition-all duration-200 cursor-pointer">
      <div className="p-2 bg-teal-100 rounded-lg flex-shrink-0">
        <assessment.icon className="w-5 h-5 text-teal-600" />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 mb-1">{assessment.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
        <div className="flex items-center space-x-2">
          {statusInfo.icon}
          <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
        </div>
      </div>
    </div>
  )
}
