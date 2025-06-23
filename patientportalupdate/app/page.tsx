"use client"

import { useState, useEffect } from "react"
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

export default function PatientRecoveryDashboard() {
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [showChatAssistant, setShowChatAssistant] = useState(false)
  const [selectedToolkit, setSelectedToolkit] = useState<any>(null)
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [patientData, setPatientData] = useState<any>({
    name: "Sarah Johnson",
    email: "sarah@example.com", 
    score: "7/11",
    phase: "REBUILD",
    timestamp: null
  })

  // Load patient data from URL parameters or localStorage on component mount
  useEffect(() => {
    try {
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
        setPatientData(data)
        
        // Also store in localStorage for future visits
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
        console.log('🔄 Loading patient data from localStorage:', data)
        console.log('📊 Setting patient data - Name:', data.name, 'Score:', data.score, 'Phase:', data.phase)
        setPatientData(data)
      } else {
        console.log('❌ No patient data found in URL or localStorage')
      }
    } catch (error) {
      console.error('Error loading patient data:', error)
    }
  }, [])

  // Extract numeric score for components that need it
  const currentScore = parseInt(patientData.score?.split('/')[0] || '7')
  
  // Debug: Log current patient data state
  console.log('🎯 Current patientData state:', patientData)
  console.log('🔢 Current score:', currentScore)

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
              <TodaysTasksSection onTaskClick={setSelectedTask} />
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
              <WeeklyPointsSection />
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
      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {showChatAssistant && <ChatAssistant onClose={() => setShowChatAssistant(false)} />}
      {selectedToolkit && <ToolkitModal toolkit={selectedToolkit} onClose={() => setSelectedToolkit(null)} />}
      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} onClose={() => setSelectedAssessment(null)} />
      )}
    </div>
  )
}
