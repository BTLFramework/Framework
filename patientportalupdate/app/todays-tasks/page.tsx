"use client"

import { useEffect, useState } from "react"
import { TodaysTasksSection } from "@/components/todays-tasks-section"
import { MovementSessionDialog } from "@/components/MovementSessionDialog"
import { PainStressCheckDialog } from "@/components/PainStressCheckDialog"
import { MindfulnessSessionDialog } from "@/components/MindfulnessSessionDialog"
import { RecoveryInsightDialog } from "@/components/RecoveryInsightDialog"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'

export default function TodaysTasksPage() {
  const { toast } = useToast()
  const { patient } = useAuth()
  const [taskRefreshKey, setTaskRefreshKey] = useState(0)
  const [currentSnapshot, setCurrentSnapshot] = useState<{
    pain: number | null
    stress: number | null
    risk: string | null
  }>({ pain: null, stress: null, risk: null })
  const [currentClinical, setCurrentClinical] = useState<{
    srsScore: number | null
    phase: string | null
    region: string | null
  }>({ srsScore: null, phase: null, region: null })

  // Drawer states
  const [movementDrawerOpen, setMovementDrawerOpen] = useState(false)
  const [painDrawerOpen, setPainDrawerOpen] = useState(false)
  const [mindfulnessDrawerOpen, setMindfulnessDrawerOpen] = useState(false)
  const [insightsDrawerOpen, setInsightsDrawerOpen] = useState(false)

  // Get patient ID from auth context
  const patientId = patient?.email || ""

  useEffect(() => {
    const loadRecoverySnapshot = async () => {
      if (!patientId) return

      try {
        const response = await fetch(
          `/api/patients/${encodeURIComponent(patientId)}/recovery/snapshot`,
          { cache: 'no-store' }
        )
        if (!response.ok) throw new Error('Failed to load recovery snapshot')

        const result = await response.json()
        setCurrentSnapshot(result.snapshot ?? { pain: null, stress: null, risk: null })
        setCurrentClinical(result.clinical ?? { srsScore: null, phase: null, region: null })
      } catch (error) {
        console.error('Failed to load recovery snapshot:', error)
        setCurrentSnapshot({ pain: null, stress: null, risk: null })
        setCurrentClinical({ srsScore: null, phase: null, region: null })
      }
    }

    loadRecoverySnapshot()
  }, [patientId, taskRefreshKey])

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

    const taskId =
      taskData.taskId === 'recovery-insight' ? 'recovery-insights' :
      taskData.taskId ||
      taskData.id ||
      (typeof taskData.pain === 'number' ? 'pain-assessment' : null)

    if (patient?.email && taskId) {
      const today = new Date().toISOString().slice(0, 10)
      localStorage.setItem(`dailyTaskCompleted_${patient.email}_${today}_${taskId}`, 'true')
      setTaskRefreshKey((key) => key + 1)
    }

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
          refreshKey={taskRefreshKey}
        />
      </div>

      {/* Drawers */}
      <MovementSessionDialog
        open={movementDrawerOpen}
        onClose={() => setMovementDrawerOpen(false)}
        patientId={patientId}
        onTaskComplete={handleTaskComplete}
      />

      <PainStressCheckDialog
        open={painDrawerOpen}
        onOpenChange={setPainDrawerOpen}
        patientId={patientId}
        onComplete={() => setPainDrawerOpen(false)}
        onTaskComplete={handleTaskComplete}
      />

      <MindfulnessSessionDialog
        open={mindfulnessDrawerOpen}
        onOpenChange={setMindfulnessDrawerOpen}
        patientId={patientId}
        onTaskComplete={handleTaskComplete}
      />

      <RecoveryInsightDialog
        open={insightsDrawerOpen}
        onOpenChange={setInsightsDrawerOpen}
        patientId={patientId}
        onTaskComplete={handleTaskComplete}
        snapshot={currentSnapshot}
        clinical={currentClinical}
        painDelta={0}
        stressDelta={0}
        showActionPrompt={false}
      />
    </div>
  )
}
