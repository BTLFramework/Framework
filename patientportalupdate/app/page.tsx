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

const PatientRecoveryDashboard: React.FC = () => {
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [selectedToolkit, setSelectedToolkit] = useState<any>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [patientData, setPatientData] = useState<any>({
    name: "Test Patient Back",
    email: "testback@example.com", 
    score: "2/11",
    phase: "RESET",
    timestamp: null
  })
  const [refreshKey, setRefreshKey] = useState(0) // For triggering re-renders
  const [showMovementDialog, setShowMovementDialog] = useState(false)
  const [showPainDialog, setShowPainDialog] = useState(false)
  const [showMindfulnessDialog, setShowMindfulnessDialog] = useState(false)
  const [showInsightsDialog, setShowInsightsDialog] = useState(false)
  const [tasksData, setTasksData] = useState<any>(null)

  // Function to completely reset portal data
  const resetPortalData = () => {
    console.log('🔄 Resetting portal data to defaults...')
    localStorage.removeItem('btl_patient_data')
    setPatientData({
      name: "Test Patient Back",
      email: "testback@example.com", 
      score: "2/11",
      phase: "RESET",
      timestamp: null
    })
    setRefreshKey(prev => prev + 1)
    console.log('✅ Portal data reset complete')
  }

  // Load patient data from URL parameters or localStorage on component mount
  useEffect(() => {
    try {
      // Clear any old cached data on initial load
      const existingData = localStorage.getItem('btl_patient_data')
      if (existingData) {
        const data = JSON.parse(existingData)
        if (data.email && (data.email.includes('bb@hotmail.com') || data.email.includes('sarah@example.com') || data.email.includes('amorea@123.com') || data.email.includes('bb@123.com'))) {
          console.log('🧹 Clearing old cached data on startup')
          localStorage.removeItem('btl_patient_data')
        }
      }
      // First try to get data from URL parameters
      console.log('🌐 Current URL:', window.location.href)
      console.log('🔍 URL search params:', window.location.search)
      const urlParams = new URLSearchParams(window.location.search)
      const urlPatientData = urlParams.get('patientData')
      console.log('📝 Raw patientData param:', urlPatientData)
      
      if (urlPatientData) {
        const data = JSON.parse(urlPatientData)
        console.log('🔄 Loading patient data from URL:', data)
        console.log('📊 Setting patient data - Name:', data.name, 'Score:', data.score, 'Phase:', data.phase)
        
        // Clear any existing localStorage to ensure fresh start for new patient
        localStorage.removeItem('btl_patient_data')
        
        setPatientData(data)
        
        // Store new patient data in localStorage for future visits
        localStorage.setItem('btl_patient_data', JSON.stringify(data))
        
        // Clean up URL to remove the parameters
        window.history.replaceState({}, document.title, window.location.pathname)
        return
      }
      
      // Fallback to localStorage if no URL parameters
      const storedData = localStorage.getItem('btl_patient_data')
      console.log('🔍 Raw localStorage data:', storedData)
      
      if (storedData) {
        const data = JSON.parse(storedData)
        console.log('📂 Loading patient data from localStorage:', data)
        
        // Check if stored data is valid (not old data)
        if (data.email && (data.email.includes('bb@hotmail.com') || data.email.includes('amorea@123.com') || data.email.includes('bb@123.com'))) {
          console.log('🧹 Clearing old cached data for invalid email:', data.email)
          localStorage.removeItem('btl_patient_data')
          console.log('ℹ️ Using default patient data instead')
        } else {
          setPatientData(data)
        }
      } else {
        console.log('ℹ️ No stored patient data found, using defaults')
      }
    } catch (error) {
      console.error('❌ Error loading patient data:', error)
      // Clear localStorage on error to prevent corruption
      localStorage.removeItem('btl_patient_data')
    }
  }, [])

  // Function to refresh patient data from backend
  const refreshPatientData = async () => {
    try {
      console.log('🔄 Refreshing patient data from backend...')
      
      const response = await fetch(`http://localhost:3001/patients/portal-data/${patientData.email}`)
      if (response.ok) {
        const result = await response.json()
        console.log('📊 Fresh patient data from backend:', result.data)
        
        const updatedData = {
          name: result.data.patient.name,
          email: result.data.patient.email,
          score: `${result.data.srsScore}/11`,
          phase: result.data.phase,
          recoveryPoints: result.data.recoveryPoints,
          lastUpdated: result.data.lastUpdated
        }
        
        setPatientData(updatedData)
        localStorage.setItem('btl_patient_data', JSON.stringify(updatedData))
        
        // Trigger re-render of components
        setRefreshKey(prev => prev + 1)
        
        console.log('✅ Patient data refreshed successfully')
      }
    } catch (error) {
      console.error('❌ Error refreshing patient data:', error)
    }
  }

  // Handle task completion
  const handleTaskComplete = async (taskData: any) => {
    console.log('🎯 Task completed in dashboard:', taskData)
    
    // Update local patient data immediately
    const updatedData = {
      ...patientData,
      score: `${taskData.newSRSScore}/11`,
      phase: taskData.phase,
      lastUpdated: new Date().toISOString()
    }
    
    setPatientData(updatedData)
    localStorage.setItem('btl_patient_data', JSON.stringify(updatedData))
    
    // Close the task modal
    setSelectedTask(null)
    
    // Immediately trigger refresh of components
    setRefreshKey(prev => prev + 1)
    
    // Refresh data from backend to ensure sync
    setTimeout(() => {
      refreshPatientData().catch(error => {
        console.error('Error in delayed refresh:', error);
      });
    }, 1000)
    
    // Record engagement activity
    try {
      await fetch('http://localhost:3001/patients/update-engagement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: patientData.email,
          activityType: 'task_completion',
          data: {
            taskId: taskData.taskId,
            taskTitle: taskData.taskTitle,
            pointsEarned: taskData.pointsEarned
          }
        })
      })
    } catch (error) {
      console.error('Error recording engagement:', error)
    }
  }

  // Record portal visit on mount
  useEffect(() => {
    const recordPortalVisit = async () => {
      try {
        await fetch('http://localhost:3001/patients/update-engagement', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: patientData.email,
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

    if (patientData.email) {
      recordPortalVisit()
    }
  }, [patientData.email])

  // Listen for custom events from Movement Session Dialog
  useEffect(() => {
    const handleOpenRecoveryScore = () => {
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
    if (typeof patientData.score === 'number') {
        return isNaN(patientData.score) ? 7 : patientData.score;
    }
    if (typeof patientData.score === 'string') {
        const scoreStr = patientData.score.split('/')[0] || '7';
        const parsed = parseInt(scoreStr);
        return isNaN(parsed) ? 7 : parsed;
    }
    return 7; // Default fallback
    } catch (error) {
      console.error('Error parsing score:', error);
      return 7; // Safe fallback
    }
  })()

  // Handler for opening the correct dialog based on card id
  const handleTaskDialogOpen = (task: any) => {
    console.log('🎯 Task clicked:', task)
    
    switch (task.id) {
      case "movement-session":
        setShowMovementDialog(true);
        break;
      case "pain-assessment":
        setShowPainDialog(true);
        break;
      case "mindfulness-session":
        setShowMindfulnessDialog(true);
        break;
      case "recovery-insights":
        setShowInsightsDialog(true);
        break;
      default:
        setSelectedTask(task); // fallback for any other tasks
    }
  }

    // Tasks data is handled by TodaysTasksSection component
    // No need to fetch separately here

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-btl-50 to-white">
      <LeftSidebar patientData={patientData} />

      <div className="flex-1 flex flex-col">
        <TopHeader
          patientData={patientData}
          onChatAssistant={() => setShowChatAssistant(true)}
          onBookAppointment={() => window.open("/book-appointment", "_blank")}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Today's Recovery Tasks - Most Important Section */}
            <div data-section="daily-tasks" className="mb-8">
              <TodaysTasksSection 
                key={`tasks-${refreshKey}`} // Force re-render when data updates
                onTaskClick={handleTaskDialogOpen} 
                onTaskComplete={handleTaskComplete}
              />
            </div>

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
                    onClick={() => setShowScoreModal(true)}
                    className="text-btl-600 hover:text-btl-700 text-sm font-medium hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200"
                  >
                    View Breakdown
                  </button>
                </div>
                <RecoveryScoreWheel score={currentScore} maxScore={11} phase={patientData.phase} />
              </div>

              {/* Weekly Points */}
              <WeeklyPointsSection key={`points-${refreshKey}`} patientEmail={patientData.email} refreshKey={refreshKey} />
            </div>

            {/* Recovery Toolkit and Assessments */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              <RecoveryToolkitSection onToolkitClick={setSelectedToolkit} />
              <AssessmentsSection onAssessmentClick={setSelectedAssessment} />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      {showScoreModal && <ScoreBreakdownModal score={currentScore} onClose={() => setShowScoreModal(false)} />}
      {/* Dialog modals for each recovery task */}
      <MovementSessionDialog 
        open={showMovementDialog} 
        onClose={() => setShowMovementDialog(false)} 
        patientId={patientData.email}
        onTaskComplete={handleTaskComplete}
      />
      <PainStressCheckDialog
        open={showPainDialog}
        onOpenChange={setShowPainDialog}
        onComplete={(data: any) => {
          console.log('Pain & stress check-in completed:', data)
          setShowPainDialog(false)
          refreshPatientData()
        }}
        onTaskComplete={handleTaskComplete}
      />
      <MindfulnessSessionDialog
        open={showMindfulnessDialog}
        onOpenChange={setShowMindfulnessDialog}
        onComplete={(points: number) => {
          console.log('Mindfulness completed, points:', points)
          setShowMindfulnessDialog(false)
          refreshPatientData()
        }}
        tracks={tasksData?.tasks?.mindfulness?.tracks || {}}
        defaultTrack={tasksData?.tasks?.mindfulness?.defaultTrack || 'breathwork'}
      />
      <RecoveryInsightDialog
        open={showInsightsDialog}
        onOpenChange={setShowInsightsDialog}
        onComplete={(points: number) => {
          console.log('Recovery insight completed, points:', points)
          setShowInsightsDialog(false)
          refreshPatientData()
        }}
        snapshot={tasksData?.tasks?.recoveryInsight?.snapshot || { pain: 5, stress: 5, risk: 'low' }}
        painDelta={tasksData?.painDelta || 0}
        stressDelta={tasksData?.stressDelta || 0}
        showActionPrompt={tasksData?.tasks?.recoveryInsight?.showActionPrompt || false}
        actionPrompt={tasksData?.tasks?.recoveryInsight?.actionPrompt}
      />
      {/* Fallback for any other tasks (legacy) */}
      {selectedTask && (
        <TaskModal 
          task={selectedTask} 
          onClose={() => setSelectedTask(null)} 
          onTaskComplete={handleTaskComplete}
        />
      )}
      {showChatAssistant && <ChatAssistant onClose={() => setShowChatAssistant(false)} />}
      {selectedToolkit && <ToolkitModal toolkit={selectedToolkit} onClose={() => setSelectedToolkit(null)} />}
      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} onClose={() => setSelectedAssessment(null)} />
      )}
    </div>
  )
}

export default PatientRecoveryDashboard
