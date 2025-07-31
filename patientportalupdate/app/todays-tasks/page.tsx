"use client"

import { useState } from "react"
import { TodaysTasksSection } from "@/components/todays-tasks-section"
import { MovementSessionDialog } from "@/components/MovementSessionDialog"
import { PainAssessmentDialog } from "@/components/PainAssessmentDialog"
import { MindfulnessSessionDialog } from "@/components/MindfulnessSessionDialog"
import { RecoveryInsightDialog } from "@/components/RecoveryInsightDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function TodaysTasksPage() {
  const { toast } = useToast()
  const { patient, isAuthenticated } = useAuth()
  const [completedTasks, setCompletedTasks] = useState<any[]>([])
  
  // Drawer states
  const [movementDrawerOpen, setMovementDrawerOpen] = useState(false)
  const [painDrawerOpen, setPainDrawerOpen] = useState(false)
  const [mindfulnessDrawerOpen, setMindfulnessDrawerOpen] = useState(false)
  const [insightsDrawerOpen, setInsightsDrawerOpen] = useState(false)
  
  // Get patient ID from auth context
  const patientId = patient?.email || ""

  const handleTaskClick = (task: any) => {
    console.log('🎯 Task clicked:', task)
    
    // Open appropriate drawer based on task ID
    switch (task.id) {
      case "movement-session":
        setMovementDrawerOpen(true)
        break
      case "pain-assessment":
        setPainDrawerOpen(true)
        break
      case "mindfulness-session":
        setMindfulnessDrawerOpen(true)
        break
      case "recovery-insights":
        setInsightsDrawerOpen(true)
        break
      default:
        // Fallback toast for unknown tasks
        toast({
          title: "Task Started",
          description: `Starting ${task.title}...`,
        })
    }
  }

  const handleTaskComplete = (taskData: any) => {
    console.log('🎯 Task completed:', taskData)
    
    // Add to completed tasks
    setCompletedTasks(prev => [...prev, taskData])
    
    // Show success toast
    toast({
      title: "Task Completed!",
      description: `Great work! You earned ${taskData.pointsEarned || taskData.points} points.`,
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold gradient-text mb-2">Today's Recovery Tasks</h1>
          <p className="text-gray-600">
            Complete your daily recovery activities to track progress and earn points
          </p>
        </div>
        
        <TodaysTasksSection 
          onTaskClick={handleTaskClick}
          onTaskComplete={handleTaskComplete}
        />
      </div>

      {/* Drawers */}
      <MovementSessionDialog
        open={movementDrawerOpen}
        onClose={() => setMovementDrawerOpen(false)}
        patientId={patientId}
      />
      
      <PainAssessmentDialog
        open={painDrawerOpen}
        onClose={() => setPainDrawerOpen(false)}
        patientId={patientId}
        onTaskComplete={handleTaskComplete}
      />
      
      <MindfulnessSessionDialog
        open={mindfulnessDrawerOpen}
        onOpenChange={setMindfulnessDrawerOpen}
        patientId={patientId}
        onComplete={(data) => {
          handleTaskComplete({ id: 'mindfulness-session', pointsEarned: data.pointsEarned });
        }}
        onTaskComplete={handleTaskComplete}
      />
      
      <RecoveryInsightDialog
        open={insightsDrawerOpen}
        onOpenChange={setInsightsDrawerOpen}
        patientId={patientId}
        onComplete={(data) => {
          handleTaskComplete({ id: 'recovery-insights', pointsEarned: data.pointsEarned });
        }}
        onTaskComplete={handleTaskComplete}
        snapshot={{ pain: 5, stress: 5, risk: 'low' }}
        painDelta={0}
        stressDelta={0}
        showActionPrompt={false}
      />
    </div>
  )
} 