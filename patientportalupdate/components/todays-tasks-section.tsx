"use client"

import { Clock, CheckCircle, Dumbbell, Heart, Brain } from "lucide-react"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
  onTaskComplete?: (taskData: any) => void
}

export function TodaysTasksSection({ onTaskClick, onTaskComplete }: TodaysTasksSectionProps) {
  const tasks = [
    {
      id: 1,
      title: "Morning Movement",
      description: "Complete your daily mobility routine with gentle stretches",
      icon: Dumbbell,
      iconBg: "bg-gradient-to-br from-btl-400 to-btl-600",
      iconColor: "text-white",
      status: "pending",
      timeEstimate: "15 min",
      category: "Exercise",
      points: 8,
      badgeClass: "badge-gold"
    },
    {
      id: 2,
      title: "Pain Assessment",
      description: "Rate your current pain levels and track patterns",
      icon: Heart,
      iconBg: "bg-gradient-to-br from-rose-400 to-rose-600",
      iconColor: "text-white", 
      status: "completed",
      timeEstimate: "3 min",
      category: "Assessment",
      points: 3,
      badgeClass: "badge-bronze"
    },
    {
      id: 3,
      title: "Mindfulness Session",
      description: "Complete guided breathing exercise for mental wellness",
      icon: Brain,
      iconBg: "bg-gradient-to-br from-purple-400 to-purple-600",
      iconColor: "text-white",
      status: "pending", 
      timeEstimate: "10 min",
      category: "Mental Health",
      points: 5,
      badgeClass: "badge-silver"
    }
  ]

  const completedTasks = tasks.filter(task => task.status === "completed").length

  const handleTaskClick = (task: any) => {
    // Pass the complete task data including points
    onTaskClick({
      ...task,
      onTaskComplete: (taskData: any) => {
        console.log('🎯 Task completed in section:', taskData)
        if (onTaskComplete) {
          onTaskComplete(taskData)
        }
        // You could also update local state here to refresh the UI
        // For now, we'll rely on the parent component to handle updates
      }
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Today's Recovery Tasks</h2>
        <div className="flex items-center space-x-2 text-sm text-charcoal-600">
          <Clock className="w-4 h-4" />
          <span>{completedTasks} of {tasks.length} completed</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 text-center hover:card-hover-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
            onClick={() => handleTaskClick(task)}
          >
            {task.status === "completed" && (
              <div className="absolute top-4 right-4">
                <CheckCircle className="w-5 h-5 text-btl-600" />
              </div>
            )}

            <div
              className={`w-16 h-16 ${task.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}
            >
              <task.icon className={`w-8 h-8 ${task.iconColor}`} />
            </div>

            <h3 className="font-bold text-charcoal-900 mb-2 text-lg">{task.title}</h3>
            <p className="text-charcoal-600 text-sm mb-4">{task.description}</p>

            <div className="flex items-center justify-between text-xs text-charcoal-500 mb-4">
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {task.timeEstimate}
              </span>
              <span className={`px-3 py-1 rounded-full font-bold text-xs ${task.badgeClass} transform hover:scale-105 transition-transform duration-200`}>
                +{task.points} pts
              </span>
            </div>

            <div className="text-xs text-charcoal-400 uppercase tracking-wider font-medium">
              {task.category}
            </div>

            {task.status === "completed" && (
              <div className="mt-3 text-xs text-emerald-600 font-medium">
                ✓ Completed Today
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-btl-50 to-white rounded-xl border border-btl-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-btl-100 rounded-full flex items-center justify-center">
              <span className="text-btl-600 font-bold text-lg">{completedTasks}</span>
            </div>
            <div>
              <h4 className="font-semibold text-charcoal-900">Daily Progress</h4>
              <p className="text-sm text-charcoal-600">
                {completedTasks === tasks.length 
                  ? "All tasks completed! Great work!" 
                  : `${tasks.length - completedTasks} tasks remaining`
                }
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-charcoal-500">Today's Points</div>
            <div className="text-xl font-bold text-btl-600">
              {tasks.filter(t => t.status === "completed").reduce((sum, t) => sum + t.points, 0)} pts
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
