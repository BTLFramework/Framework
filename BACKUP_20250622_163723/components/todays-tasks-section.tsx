"use client"

import { Activity, Heart, Target, Clock, CheckCircle } from "lucide-react"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
}

export function TodaysTasksSection({ onTaskClick }: TodaysTasksSectionProps) {
  // Function to get badge class based on points
  const getBadgeClass = (points: number) => {
    if (points >= 5) return "badge-gold";
    if (points >= 3) return "badge-silver"; 
    return "badge-bronze";
  };

  const tasks = [
    {
      id: 1,
      title: "Movement",
      description: "Complete your daily exercises",
      icon: Activity,
      iconBg: "bg-gradient-to-br from-btl-100 to-btl-200",
      iconColor: "text-btl-600",
      buttonText: "Start Now",
      buttonStyle: "btn-primary-gradient",
      status: "pending",
      timeEstimate: "15 min",
      points: 5,
      badgeClass: "badge-gold"
    },
    {
      id: 2,
      title: "Mindset",
      description: "Daily reflection and mindfulness",
      icon: Heart,
      iconBg: "bg-gradient-to-br from-btl-100 to-btl-300",
      iconColor: "text-btl-700",
      buttonText: "Begin Session",
      buttonStyle: "btn-primary-gradient",
      status: "pending",
      timeEstimate: "10 min",
      points: 3,
      badgeClass: "badge-silver"
    },
    {
      id: 3,
      title: "Confidence",
      description: "Rate your daily confidence",
      icon: Target,
      iconBg: "bg-gradient-to-br from-btl-50 to-btl-200",
      iconColor: "text-btl-600",
      buttonText: "Rate Now",
      buttonStyle: "btn-primary-gradient",
      status: "completed",
      timeEstimate: "5 min",
      points: 2,
      badgeClass: "badge-bronze"
    },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold gradient-text">Today's Recovery Tasks</h2>
        <div className="flex items-center space-x-2 text-sm text-charcoal-600">
          <Clock className="w-4 h-4" />
          <span>1 of 3 completed</span>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 text-center hover:card-hover-gradient hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer relative"
            onClick={() => onTaskClick(task)}
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

            <button
              className={`w-full px-4 py-3 rounded-xl font-semibold text-white transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 ${task.buttonStyle} ${
                task.status === "completed" ? "opacity-75 cursor-not-allowed" : ""
              }`}
              disabled={task.status === "completed"}
            >
              {task.status === "completed" ? "✓ Completed" : task.buttonText}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
