"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Card } from "@/components/ui/card"

interface TaskCardProps {
  task: {
    id: number
    title: string
    description: string
    icon: any
    status: "pending" | "completed" | "overdue" | "missed"
    timeEstimate: string
    category: string
  }
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case "missed":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusStyles = () => {
    switch (task.status) {
      case "completed":
        return "border-green-300 bg-green-50"
      case "missed":
        return "border-red-300 bg-red-50"
      default:
        return "border-border bg-card hover:border-primary/50 hover:shadow-md"
    }
  }

  return (
    <Card className={`transition-all duration-200 group ${getStatusStyles()}`}>
      <div className="p-4 flex items-start space-x-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          <task.icon className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1">
          <p className="font-semibold text-foreground">{task.title}</p>
          <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>
        </div>
        {getStatusIcon()}
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{task.timeEstimate}</span>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{task.category}</span>
      </div>
    </Card>
  )
}
