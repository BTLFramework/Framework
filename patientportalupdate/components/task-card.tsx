"use client"

import { CheckCircle, Clock, AlertCircle } from "lucide-react"

interface TaskCardProps {
  task: {
    id: number
    title: string
    description: string
    icon: any
    status: "pending" | "completed" | "overdue"
    timeEstimate: string
    category: string
  }
  onClick: () => void
  iconBg?: string
  iconColor?: string
}

export function TaskCard({ task, onClick, iconBg, iconColor }: TaskCardProps) {
  const getStatusIcon = () => {
    switch (task.status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-emerald-500" />
      case "overdue":
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusColor = () => {
    switch (task.status) {
      case "completed":
        return "border-emerald-200 bg-emerald-50"
      case "overdue":
        return "border-red-200 bg-red-50"
      default:
        return "border-gray-200 bg-white hover:border-teal-200 hover:shadow-md"
    }
  }

  return (
    <div
      onClick={onClick}
      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${getStatusColor()}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${iconBg ? iconBg : 'bg-teal-100'}`}>
          <task.icon className={`w-5 h-5 ${iconColor ? iconColor : 'text-teal-600'}`} />
        </div>
        {getStatusIcon()}
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{task.title}</h3>
      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{task.description}</p>

      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500">{task.timeEstimate}</span>
        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full">{task.category}</span>
      </div>
    </div>
  )
}
