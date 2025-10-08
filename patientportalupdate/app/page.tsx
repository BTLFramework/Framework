"use client"

import React, { useState, useEffect } from "react"
import { LeftSidebar } from "@/components/left-sidebar"
import { TopHeader } from "@/components/top-header"
import { RecoveryScoreWheel } from "@/components/recovery-score-wheel"
import { WeeklyPointsSection } from "@/components/weekly-points-section"
import { TodaysTasksSection } from "@/components/todays-tasks-section"
import { RecoveryToolkitSection } from "@/components/recovery-toolkit-section"
import { AssessmentsSection } from "@/components/assessments-section"
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal"
import { TaskModal } from "@/components/task-modal"
import { ChatAssistant } from "@/components/chat-assistant"
import { ToolkitModal } from "@/components/toolkit-modal"
import { AssessmentModal } from "@/components/assessment-modal"
import { MovementSessionDialog } from "@/components/MovementSessionDialog"
import { PainStressCheckDialog } from "@/components/PainStressCheckDialog"
import { MindfulnessSessionDialog } from "@/components/MindfulnessSessionDialog"
import { RecoveryInsightDialog } from "@/components/RecoveryInsightDialog"
import { useAuth } from "@/hooks/useAuth"
import { LoginForm } from "@/components/LoginForm"
import { BUILD_TAG, BUILD_HINT } from "@/lib/buildInfo"

const PatientRecoveryDashboard: React.FC = () => {
  // Use proper authentication
  const { patient, loading: authLoading, isAuthenticated } = useAuth()
  
  console.log('🎯 Dashboard render state:', { patient, authLoading, isAuthenticated })
  console.log('🧩 Build marker:', { BUILD_TAG, BUILD_HINT })
  
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [selectedToolkit, setSelectedToolkit] = useState<any>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [refreshKey, setRefreshKey] = useState(0) // For triggering re-renders
  const [showMovementDialog, setShowMovementDialog] = useState(false)
  const [showPainDialog, setShowPainDialog] = useState(false)
  const [showMindfulnessDialog, setShowMindfulnessDialog] = useState(false)
  const [showInsightsDialog, setShowInsightsDialog] = useState(false)
  const [tasksData, setTasksData] = useState<any>(null)
  const [currentSnapshot, setCurrentSnapshot] = useState({ pain: 5, stress: 5, risk: 'low' })
  const [amyIntakeData, setAmyIntakeData] = useState<any>(null) // Store Amy's real intake data
  const [loading, setLoading] = useState(true) // New state for loading

  // Function to completely reset portal data
  const resetPortalData = () => {
    console.log('🔄 Resetting portal data to defaults...')
    localStorage.removeItem('btl_patient_data')
    // This function is no longer needed as patient data is managed by useAuth
  }

  // Function to fetch current pain/stress snapshot
  const fetchCurrentSnapshot = async () => {
    if (!patient?.email) return

    try {
      // Get baseline data
              const portalResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/portal-data/${patient.email}`)
      if (!portalResponse.ok) return

      const portalData = await portalResponse.json()
      const baselineVAS = portalData.data.vas || 5
      
      // Get current daily data
              const dailyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/daily-data/${patient.email}`)
      let currentPain = baselineVAS
      let currentStress = 2 // Default stress level
      
      if (dailyResponse.ok) {
        const dailyData = await dailyResponse.json()
        if (dailyData.success && dailyData.data) {
          // Convert 0-100 scale back to 0-10
          currentPain = Math.round((dailyData.data.pain / 100) * 10)
          currentStress = Math.round((dailyData.data.psychLoad / 100) * 10)
        }
      }

      // Determine risk level based on pain and stress
      let riskLevel = 'low'
      if (currentPain >= 7 || currentStress >= 7) {
        riskLevel = 'high'
      } else if (currentPain >= 5 || currentStress >= 5) {
        riskLevel = 'moderate'
      }

      const newSnapshot = {
        pain: currentPain,
        stress: currentStress,
        risk: riskLevel
      }

      setCurrentSnapshot(newSnapshot)
      console.log('📊 Updated recovery snapshot:', newSnapshot)

    } catch (error) {
      console.error('❌ Error fetching snapshot data:', error)
    }
  }

  // Load patient data from URL parameters or localStorage on component mount
  useEffect(() => {
    try {
      // Clear any old cached data on initial load
      const existingData = localStorage.getItem('btl_patient_data')
      if (existingData) {
        const data = JSON.parse(existingData)
        if (data.email && (data.email.includes('bb@hotmail.com') || data.email.includes('sarah@example.com') || data.email.includes('amorea@123.com') || data.email.includes('bb@123.com'))) {
          localStorage.removeItem('btl_patient_data')
        }
      }
      // First try to get data from URL parameters
      const urlParams = new URLSearchParams(window.location.search)
      const urlPatientData = urlParams.get('patientData')
      if (urlPatientData) {
        const data = JSON.parse(urlPatientData)
        localStorage.removeItem('btl_patient_data')
        // This block is no longer needed as patient data is managed by useAuth
        // setPatientData(data)
        // localStorage.setItem('btl_patient_data', JSON.stringify(data))
        window.history.replaceState({}, document.title, window.location.pathname)
        return
      }
      // Fallback to localStorage if no URL parameters
      const storedData = localStorage.getItem('btl_patient_data')
      if (storedData) {
        const data = JSON.parse(storedData)
        if (data.email && (data.email.includes('bb@hotmail.com') || data.email.includes('amorea@123.com') || data.email.includes('bb@123.com'))) {
          localStorage.removeItem('btl_patient_data')
        } else {
          // This block is no longer needed as patient data is managed by useAuth
          // setPatientData(data)
        }
      }
    } catch (error) {
      localStorage.removeItem('btl_patient_data')
    }
  }, [])

  // Fetch current snapshot when patient data changes
  useEffect(() => {
    if (patient?.email) {
      fetchCurrentSnapshot()
    }
  }, [patient])

  // Function to refresh patient data from backend
  const refreshPatientData = async () => {
    if (!patient?.email) {
      console.log('ℹ️ No patient email available for refresh')
      return
    }

    try {
      setLoading(true)
      console.log('🔄 Refreshing patient data from backend...')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/portal-data/${patient.email}`)
      if (response.ok) {
        const result = await response.json()
        
        if (result.success && result.data) {
          const updatedData = {
            ...patient,
            ...result.data.patient,
            score: result.data.srsScore ?? result.data.patient?.srsScore ?? patient.score,
            phase: result.data.phase ?? result.data.srsScore?.phase ?? result.data.patient?.phase ?? patient.phase,
            lastUpdated: new Date().toISOString()
          }
          
          // Patient data is now managed by useAuth, so we don't need to update it here
          console.log('✅ Patient data refreshed:', updatedData)
        }
      }
    } catch (error) {
      console.error('❌ Error refreshing patient data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Function to handle task completion
  const handleTaskComplete = async (taskData: any) => {
    if (!patient?.email) {
      console.log('ℹ️ No patient email available for task completion')
      return
    }

    console.log('🎯 Task completed:', taskData)
    
    try {
      // Update local patient data immediately (but don't persist since useAuth manages it)
      const updatedData = {
        ...patient,
        score: `${taskData.newSRSScore}/11`,
        phase: taskData.phase,
        lastUpdated: new Date().toISOString()
      }
      
      console.log('📊 Updated patient data locally:', updatedData)
      
      // Trigger refresh
      setRefreshKey(prev => prev + 1)
      
      // Optional: Record activity in backend
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/activity`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: patient.email,
            activityType: 'task_completion',
            data: {
              taskType: taskData.taskType,
              newSRSScore: taskData.newSRSScore,
              phase: taskData.phase
            }
          })
        })
      } catch (activityError) {
        console.log('ℹ️ Could not record activity (non-critical):', activityError)
      }
      
    } catch (error) {
      console.error('❌ Error handling task completion:', error)
    }
  }

  // Record portal visit on mount
  useEffect(() => {
    const recordPortalVisit = async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/update-engagement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: patient?.email, // Use patient data directly
            activityType: 'portal_visit',
            data: {
              timestamp: new Date().toISOString(),
              page: 'dashboard'
            }
          })
        })
      } catch (error) {
        console.error('Error recording portal visit:', error)
      }
    }

    if (patient?.email) {
      recordPortalVisit()
    }
  }, [patient?.email])

  // Listen for custom events from Movement Session Dialog
  useEffect(() => {
    const handleOpenRecoveryScore = async () => {
      // Fetch patient's real intake data before opening the modal
      await fetchPatientIntakeData()
      setShowScoreModal(true)
    }

    const handleOpenExerciseVideos = (event: any) => {
      // Open the toolkit modal with exercise videos
      setSelectedToolkit({
        title: "Exercise Videos",
        description: "Comprehensive exercise library with video demonstrations",
        category: "videos",
        count: 50
      });
    }

    window.addEventListener('openRecoveryScore', handleOpenRecoveryScore)
    window.addEventListener('openExerciseVideos', handleOpenExerciseVideos)

    return () => {
      window.removeEventListener('openRecoveryScore', handleOpenRecoveryScore)
      window.removeEventListener('openExerciseVideos', handleOpenExerciseVideos)
    }
  }, [])

  // Extract current score number for the wheel
  const currentScore = (() => {
    try {
      if (!patient) return 0; // Safety check
      if (typeof patient.score === 'number') {
        return isNaN(patient.score) ? 0 : patient.score;
      }
      if (typeof patient.score === 'string') {
        const scoreStr = patient.score.split('/')[0] || '0';
        const parsed = parseInt(scoreStr);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0; // Default fallback (unknown)
    } catch (error) {
      console.error('Error parsing score:', error);
      return 0; // Safe fallback
    }
  })()

  // Handler for opening the correct dialog based on card id
  const handleTaskDialogOpen = (task: any) => {
    console.log('🎯 Task clicked:', task)
    console.log('🎯 Task ID:', task.id)
    console.log('🎯 Current dialog states:', { 
      showMovementDialog, 
      showPainDialog, 
      showMindfulnessDialog, 
      showInsightsDialog 
    })
    
    switch (task.id) {
      case "movement-session":
        console.log('🎯 Opening movement dialog')
        setShowMovementDialog(true);
        break;
      case "pain-assessment":
        console.log('🎯 Opening pain dialog')
        setShowPainDialog(true);
        break;
      case "mindfulness-session":
        console.log('🎯 Opening mindfulness dialog')
        setShowMindfulnessDialog(true);
        break;
      case "recovery-insights":
        console.log('🎯 Opening insights dialog')
        setShowInsightsDialog(true);
        break;
      default:
        console.log('🎯 No matching task ID, using fallback')
        setSelectedTask(task); // fallback for any other tasks
    }
  }

    // Tasks data is handled by TodaysTasksSection component
    // No need to fetch separately here

  // Function to fetch current patient's real intake data for SRS breakdown
  const fetchPatientIntakeData = async () => {
    try {
      if (!patient?.email) {
        console.log('⚠️ No patient email available, using sample data')
        setAmyIntakeData({
          vas: 3,
          disability: 15,
          psfs: 7.0,
          confidence: 6,
          negativeBeliefs: 'no',
          pcs4: 5,
          tsk11: 18,
          milestoneAchieved: 'no',
          objectiveProgress: 'no'
        })
        return
      }

      console.log('🔍 Fetching patient intake data for SRS breakdown...')
      
      // Fetch current patient's portal data which includes intake information
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://framework-production-92f5.up.railway.app'}/patients/portal-data/${patient.email}`)
      if (response.ok) {
        const result = await response.json()
        console.log('📊 Patient portal data:', result.data)
        
        // Extract intake data from the portal response
        const intakeData = {
          vas: result.data.vas || 3,
          disability: result.data.disability || 15,
          psfs: result.data.psfs || 7.0,
          confidence: result.data.confidence || 6,
          negativeBeliefs: result.data.negativeBeliefs || 'no',
          pcs4: result.data.pcs4 || 5,
          tsk11: result.data.tsk11 || 18,
          milestoneAchieved: result.data.milestoneAchieved || 'no',
          objectiveProgress: result.data.objectiveProgress || 'no'
        }
        
        setAmyIntakeData(intakeData)
        console.log('✅ Patient intake data loaded for SRS breakdown:', intakeData)
      } else {
        console.log('⚠️ Could not fetch patient data, using sample data')
        // Fallback to sample data if fetch fails
        setAmyIntakeData({
          vas: 3,
          disability: 15,
          psfs: 7.0,
          confidence: 6,
          negativeBeliefs: 'no',
          pcs4: 5,
          tsk11: 18,
          milestoneAchieved: 'no',
          objectiveProgress: 'no'
        })
      }
    } catch (error) {
      console.error('❌ Error fetching patient intake data:', error)
      // Fallback to sample data on error
      setAmyIntakeData({
        vas: 3,
        disability: 15,
        psfs: 7.0,
        confidence: 6,
        negativeBeliefs: 'no',
        pcs4: 5,
        tsk11: 18,
        milestoneAchieved: 'no',
        objectiveProgress: 'no'
      })
    }
  }

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
          <p className="text-btl-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to login page if not authenticated
  if (!authLoading && (!isAuthenticated || !patient)) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
      return null
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex">
      <div className="fixed inset-y-0 left-0 z-50">
        <LeftSidebar patientData={patient} />
      </div>
      
      {/* Main Content */}
      <div className="flex-1 pl-64 flex flex-col min-h-screen">
        <TopHeader 
          patientData={patient || { name: 'Loading...', email: '' }}
          onChatAssistant={() => setShowChatAssistant(true)}
          onBookAppointment={() => window.open("/book-appointment", "_blank")}
        />
        
        {/* Pass authenticated patient data to components */}
        {patient && (
          <TodaysTasksSection 
            onTaskClick={handleTaskDialogOpen} 
            onTaskComplete={(taskData) => {
              console.log('Task completed:', taskData)
              setRefreshKey(prev => prev + 1)
            }}
            refreshKey={refreshKey}
          />
        )}
        
        {/* Score and Weekly Points Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Recovery Score with Wheel */}
          <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 hover:card-hover-gradient hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold gradient-text">Signature Recovery Score™</h2>
                <p className="text-charcoal-600 text-sm mt-1">Your personalized recovery metric</p>
              </div>
              <button
                onClick={async () => {
                  await fetchPatientIntakeData()
                  setShowScoreModal(true)
                }}
                className="text-btl-600 hover:text-btl-700 text-sm font-medium hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200"
              >
                View Breakdown
              </button>
            </div>
            <RecoveryScoreWheel score={currentScore} maxScore={11} phase={patient?.phase || patient?.currentPhase || 'RESET'} />
          </div>

          {/* Weekly Points */}
          {patient && (
            <WeeklyPointsSection key={`points-${refreshKey}`} patientEmail={patient.email} refreshKey={refreshKey} />
          )}
        </div>

        {/* Recovery Toolkit and Assessments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <RecoveryToolkitSection onToolkitClick={setSelectedToolkit} />
          <AssessmentsSection onAssessmentClick={setSelectedAssessment} />
        </div>
      </div>

      {/* Modals */}
      {/* Dialog modals for each recovery task */}
      {patient && (
        <>
          {console.log('🎯 Rendering MovementSessionDialog, open:', showMovementDialog)}
          <MovementSessionDialog 
            open={showMovementDialog} 
            onClose={() => setShowMovementDialog(false)} 
            patientId={patient.email}
            onTaskComplete={handleTaskComplete}
          />
        </>
      )}
              {patient && (
          <PainStressCheckDialog
            open={showPainDialog}
            onOpenChange={setShowPainDialog}
            patientId={patient.email}
            onComplete={(data: any) => {
              console.log('Pain & stress check-in completed:', data)
              setShowPainDialog(false)
              refreshPatientData()
            }}
            onTaskComplete={handleTaskComplete}
          />
        )}
              {patient && (
          <MindfulnessSessionDialog
            open={showMindfulnessDialog}
            onOpenChange={setShowMindfulnessDialog}
            patientId={patient.email}
            onComplete={(data: any) => {
              console.log('Mindfulness completed:', data)
              setShowMindfulnessDialog(false)
              refreshPatientData()
            }}
            onTaskComplete={handleTaskComplete}
          />
        )}
              {patient && (
          <RecoveryInsightDialog
            open={showInsightsDialog}
            onOpenChange={setShowInsightsDialog}
            patientId={patient.email}
            onComplete={(data: any) => {
              console.log('Recovery insight completed:', data)
              setShowInsightsDialog(false)
              refreshPatientData()
            }}
            onTaskComplete={handleTaskComplete}
            snapshot={currentSnapshot}
            painDelta={0}
            stressDelta={0}
            showActionPrompt={false}
            actionPrompt={{ title: "", action: "", buttonText: "" }}
          />
        )}
      {/* Fallback for any other tasks (legacy) */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onTaskComplete={handleTaskComplete}
        />
      )}
      {showChatAssistant && <ChatAssistant onClose={() => setShowChatAssistant(false)} />}
      {selectedToolkit && (
        <ToolkitModal 
          toolkit={selectedToolkit} 
          onClose={() => setSelectedToolkit(null)} 
          patientId={patient?.id?.toString() || patient?.email || "1"}
        />
      )}
      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} onClose={() => setSelectedAssessment(null)} />
      )}
      {showScoreModal && (
        <ScoreBreakdownModal 
          score={currentScore} 
          onClose={() => setShowScoreModal(false)}
          intakeData={amyIntakeData} // Pass Amy's real intake data
        />
      )}
    </div>
  )
}

export default PatientRecoveryDashboard
