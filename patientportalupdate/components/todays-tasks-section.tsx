"use client"

import { useState, useEffect } from "react"
import { Clock, CheckCircle, Heart, Brain, Target } from "lucide-react"
import { MovementSessionCard } from "./MovementSessionCard"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
  onTaskComplete?: (taskData: any) => void
}

export function TodaysTasksSection({ onTaskClick, onTaskComplete }: TodaysTasksSectionProps) {
  const [personalizedTasks, setPersonalizedTasks] = useState<any[]>([])
  const [patientData, setPatientData] = useState<any>(null)
  const [patientId, setPatientId] = useState<string>("")

  // Load patient data and generate personalized tasks
  useEffect(() => {
    const loadPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/tasks/${patientId}`)
        const data = await response.json()
        
        setPatientData(data)
        setPatientId(data.email || "test@example.com")
        
      } catch (error) {
        console.error('Error loading patient data:', error)
        // Fallback to default data
        setPatientData({ score: "7", phase: "Educate", region: "Low Back / SI Joint" })
        setPatientId("test@example.com")
      }
    }

    loadPatientData()
  }, [])

  // Define metallic pill classes
  const metallicPills = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow border border-yellow-500',
    silver: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow border border-gray-400',
    bronze: 'bg-gradient-to-r from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142]',
  };

  // Define the remaining three cards (excluding movement-session)
  const tasks = [
    {
      id: "pain-assessment",
      title: "Pain Assessment",
      description: "Rate your current pain levels and track patterns",
      icon: Heart,
      iconBg: "bg-btl-600",
      iconColor: "text-white",
      label: `Daily check-in • ${patientData?.phase?.toUpperCase() || 'EDUCATE'} phase`,
      points: 3,
      pointsPill: metallicPills.bronze,
      time: "3 min",
      link: "#",
      linkText: "Begin Session",
      status: "pending"
    },
    {
      id: "mindfulness-session",
      title: "Mindfulness Session",
      description: "Complete guided breathing exercise for mental wellness",
      icon: Brain,
      iconBg: "bg-btl-600",
      iconColor: "text-white",
      label: `Breathwork • ${patientData?.phase?.toUpperCase() || 'EDUCATE'} phase`,
      points: 5,
      pointsPill: metallicPills.silver,
      time: "10 min",
      link: "#",
      linkText: "Begin Session",
      status: "pending"
    },
    {
      id: "recovery-insights",
      title: "Recovery Insights",
      description: "View your risk profile and recovery progress",
      icon: Target,
      iconBg: "bg-btl-600",
      iconColor: "text-white",
      label: `Progress review • ${patientData?.phase?.toUpperCase() || 'RESET'} phase`,
      points: 2,
      pointsPill: metallicPills.bronze,
      time: "2 min",
      link: "#",
      linkText: "Begin Session",
      status: "pending",
      textClass: "text-black"
    }
  ];

  const completedTasks = tasks.filter(task => task.status === "completed").length;

  const handleTaskClick = (task: any) => {
    onTaskClick({
      ...task,
      onTaskComplete: (taskData: any) => {
        console.log('🎯 Task completed in section:', taskData)
        if (onTaskComplete) {
          onTaskComplete(taskData)
        }
      }
    })
  }

  const handleMovementSessionClick = () => {
    onTaskClick({
      id: "movement-session",
      title: "Movement Session",
      onTaskComplete: (taskData: any) => {
        console.log('🎯 Movement session completed in section:', taskData)
        if (onTaskComplete) {
          onTaskComplete(taskData)
        }
      }
    })
  }

  // Helper function to get badge colors
  const getBadgeColor = (badgeClass: string) => {
    switch (badgeClass) {
      case "badge-gold":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 shadow-md border border-yellow-600"
      case "badge-silver":
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-md border border-gray-500"
      case "badge-bronze":
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 shadow-md border border-orange-600"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getBadgeText = (badgeClass: string, points: number) => {
    switch (badgeClass) {
      case "badge-gold":
        return `🥇 +${points}`
      case "badge-silver":
        return `🥈 +${points}`
      case "badge-bronze":
        return `🥉 +${points}`
      default:
        return `+${points}`
    }
  }

  return (
    <div className="bg-btl-50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold gradient-text">Today's Recovery Tasks</h2>
        <div className="flex items-center space-x-3 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-btl-600 rounded-full"></div>
            <span className="text-btl-600 font-medium">{completedTasks} completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-btl-200 rounded-full"></div>
            <span className="text-btl-600/60">{tasks.length + 1 - completedTasks} remaining</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <MovementSessionCard 
          patientId={patientId} 
          onClick={handleMovementSessionClick} 
        />
        
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex flex-col items-center bg-white rounded-2xl shadow-lg p-7 border border-btl-100 hover:shadow-xl hover:border-btl-200 transition-all duration-200 cursor-pointer relative group min-h-[340px] min-w-[260px]"
            onClick={() => handleTaskClick(task)}
          >
            <div className={`w-14 h-14 ${task.iconBg} rounded-xl flex items-center justify-center mb-4 mt-1 shadow-md`}>
              <task.icon className={`w-8 h-8 ${task.iconColor}`} />
            </div>
            <h3 className={`font-bold text-lg mb-1 text-center text-black`}>{task.title}</h3>
            <p className={`text-[15px] mb-3 text-center text-black`}>{task.description}</p>
            <span className="inline-block px-4 py-1 text-xs font-semibold rounded-full bg-btl-100 text-btl-600 mb-3 text-center whitespace-nowrap">{task.label}</span>
            <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full ${task.pointsPill} mb-2`}>+{task.points} pts</span>
            <a href={task.link} className="text-btl-600 font-semibold text-sm underline flex items-center gap-1 mb-2 hover:text-btl-700">
              {task.linkText}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </a>
            <div className="flex items-center justify-center text-xs text-btl-600/70 mt-auto">
              <Clock className="w-4 h-4 mr-1" />
              {task.time}
            </div>
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
                {completedTasks === tasks.length + 1
                  ? "All tasks completed! Great work!" 
                  : `${tasks.length + 1 - completedTasks} tasks remaining`
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

