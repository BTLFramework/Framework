"use client";

import { useState } from "react";
import { LeftSidebar } from "@/components/left-sidebar";
import { TopHeader } from "@/components/top-header";
import { RecoveryScoreWheel } from "@/components/recovery-score-wheel";
import { WeeklyPointsSection } from "@/components/weekly-points-section";
import { TodaysTasksSection } from "@/components/todays-tasks-section";
import { RecoveryToolkitSection } from "@/components/recovery-toolkit-section";
import { AssessmentsSection } from "@/components/assessments-section";
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal";
import { TaskModal } from "@/components/task-modal";
import { ChatAssistant } from "@/components/chat-assistant";
import { ToolkitModal } from "@/components/toolkit-modal";
import { AssessmentModal } from "@/components/assessment-modal";

export default function PatientRecoveryDashboard() {
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showChatAssistant, setShowChatAssistant] = useState(false);
  const [selectedToolkit, setSelectedToolkit] = useState<any>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [currentScore] = useState(7);

  return (
    <div className="flex min-h-screen bg-gradient-page">
      <LeftSidebar />

      <div className="flex-1 flex flex-col">
        <TopHeader
          onChatAssistant={() => setShowChatAssistant(true)}
          onBookAppointment={() => window.open("/book-appointment", "_blank")}
        />

        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Today's Recovery Tasks - MOVED TO TOP */}
            <div className="mb-8">
              <TodaysTasksSection onTaskClick={setSelectedTask} />
            </div>

            {/* Top Section - Score and Weekly Points Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Recovery Score with Wheel */}
              <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">Signature Recovery Score™</h2>
                    <p className="text-muted-foreground text-sm mt-1">Your personalized recovery metric</p>
                  </div>
                  <button
                    onClick={() => setShowScoreModal(true)}
                    className="text-primary hover:text-accent text-sm font-medium hover:bg-primary/5 px-3 py-1 rounded-lg transition-all duration-200"
                  >
                    View Breakdown
                  </button>
                </div>
                <RecoveryScoreWheel score={currentScore} maxScore={11} phase="REBUILD" />
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
  );
}
