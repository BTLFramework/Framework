"use client"

import { Activity, Heart, Target, Clock, CheckCircle } from "lucide-react"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
}

export function TodaysTasksSection({ onTaskClick }: TodaysTasksSectionProps) {
  const tasks = [
    {
      id: 1,
      title: "Movement",
      description: "Complete your daily exercises",
      icon: Activity,
      badgeClass: "badge-gold",
      iconClass: "text-yellow-600",
      status: "pending",
      timeEstimate: "15 min",
      points: 5,
    },
    {
      id: 2,
      title: "Mindset",
      description: "Daily reflection and mindfulness",
      icon: Heart,
      badgeClass: "badge-silver",
      iconClass: "text-gray-600",
      status: "pending",
      timeEstimate: "10 min",
      points: 3,
    },
    {
      id: 3,
      title: "Confidence",
      description: "Rate your daily confidence",
      icon: Target,
      badgeClass: "badge-bronze",
      iconClass: "text-orange-600",
      status: "completed",
      timeEstimate: "5 min",
      points: 2,
    },
  ]

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Today's Recovery Tasks</h2>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span>1 of 3 completed</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="bg-background rounded-xl shadow-lg p-6 border border-border text-center hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
            onClick={() => onTaskClick(task)}
          >
            {task.status === "completed" && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </div>
            )}

            <div className={`w-16 h-16 ${task.badgeClass} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
              <task.icon className={`w-8 h-8 ${task.iconClass}`} />
            </div>

            <h3 className="font-bold text-foreground mb-2 text-lg">{task.title}</h3>
            <p className="text-muted-foreground text-sm mb-4">{task.description}</p>

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {task.timeEstimate}
              </span>
              <span className={`px-2 py-1 rounded-full font-medium text-xs ${task.badgeClass}`}>
                +{task.points} pts
              </span>
            </div>

            <button
              className="w-full px-4 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 bg-gradient-to-r from-primary to-accent text-white"
              disabled={task.status === "completed"}
            >
              {task.status === "completed" ? "Completed" : "Start Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
