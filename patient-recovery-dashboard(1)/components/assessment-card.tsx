"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

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
          icon: <CheckCircle className="w-5 h-5 text-primary" />,
          text: `Completed ${assessment.completedDate}`,
          color: "text-primary",
        }
      case "due":
        return {
          icon: <AlertCircle className="w-5 h-5 text-red-500" />,
          text: `Due ${assessment.dueDate}`,
          color: "text-red-600",
        }
      default:
        return {
          icon: <Clock className="w-5 h-5 text-accent" />,
          text: `Due ${assessment.dueDate}`,
          color: "text-primary",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-pointer">
      <div className="flex items-start space-x-4 p-4">
        <div className="p-2 bg-accent/10 rounded-lg flex-shrink-0">
          <assessment.icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground mb-1">{assessment.title}</h3>
          <p className="text-gray-600 text-sm mb-2">{assessment.description}</p>
          <div className="flex items-center space-x-2">
            {statusInfo.icon}
            <span className={`text-sm font-medium ${statusInfo.color}`}>{statusInfo.text}</span>
          </div>
        </div>
      </div>
    </Card>
  )
}
