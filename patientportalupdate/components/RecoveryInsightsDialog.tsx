import { LineChart, AlertCircle, CheckCircle } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { useRecoveryInsights } from "@/hooks/useRecoveryInsights";
import type { RecoveryInsight, RecoveryMetric } from "@/types/recovery";
import InsightDialog from "./InsightDialog";
import { useState, useEffect } from "react";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogProgress,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";

interface RecoveryInsightsDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

export function RecoveryInsightsDialog({ open, onClose, patientId }: RecoveryInsightsDialogProps) {
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId);
  const [refreshKey, setRefreshKey] = useState(0);
  const insights: RecoveryInsight[] = patientData ? useRecoveryInsights(patientData, refreshKey) : [];
  const [selectedInsight, setSelectedInsight] = useState<RecoveryInsight | null>(null);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const [dailyCompletedInsights, setDailyCompletedInsights] = useState<number>(0);
  
  console.log('🎯 RecoveryInsightsDialog insights:', insights.map(i => ({ id: i.id, title: i.title, completed: i.completed })));

  const viewedInsights = insights.filter(insight => insight.viewed).length;
  const totalInsights = insights.length;

  // Load daily completed insights from localStorage
  useEffect(() => {
    let email = patientId;
    try {
      const stored = localStorage.getItem('btl_patient_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) email = parsed.email;
      }
    } catch {}
    
    const today = new Date().toISOString().slice(0, 10);
    const key = `dailyInsightsCompleted_${email}_${today}`;
    const completed = localStorage.getItem(key);
    const completedCount = completed ? parseInt(completed) : 0;
    setDailyCompletedInsights(completedCount);
  }, [patientId]);

  // Only show skeleton while data is truly undefined
  if (patientData === undefined) {
    return (
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent>
          <AssessmentDialogHeader>
            <AssessmentDialogTitle className="flex items-center gap-2">
              <LineChart className="w-8 h-8 text-white" />
              Recovery Insights
            </AssessmentDialogTitle>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div className="animate-pulse flex flex-col items-center py-16">
              <div className="w-14 h-14 bg-btl-200 rounded-xl mb-4 mt-1"></div>
              <div className="h-6 bg-btl-200 rounded mb-1 w-32"></div>
              <div className="h-4 bg-btl-200 rounded mb-3 w-48"></div>
              <div className="h-5 bg-btl-200 rounded mb-3 w-24"></div>
              <div className="h-5 bg-btl-200 rounded mb-2 w-16"></div>
              <div className="h-4 bg-btl-200 rounded mb-2 w-20"></div>
              <div className="h-4 bg-btl-200 rounded mt-auto w-16"></div>
            </div>
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  if (patientError) {
    return (
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent>
          <AssessmentDialogHeader>
            <AssessmentDialogTitle className="flex items-center gap-2">
              <LineChart className="w-8 h-8 text-white" />
              Recovery Insights
            </AssessmentDialogTitle>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div className="text-center text-red-500 py-8">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              Error loading patient data.
            </div>
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  return (
    <>
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <AssessmentDialogTitle className="sr-only">Recovery Insights</AssessmentDialogTitle>
          <AssessmentDialogDescription className="sr-only">
            Track your recovery progress and understand key patterns in your healing journey.
          </AssessmentDialogDescription>
          
          {/* Header with gradient background */}
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
            <div className="flex items-center gap-8 items-center">
              <LineChart className="w-12 h-12 text-white opacity-90" />
              <h2 className="text-3xl font-bold text-white">Recovery Insights</h2>
            </div>
            <p className="mt-2 text-btl-100 text-sm">
              Track your recovery progress and understand key patterns in your healing journey.
            </p>
          </div>

          {/* Daily Progress Bar */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-btl-700">Daily Progress</span>
              <span className="text-sm font-medium text-btl-600">{dailyCompletedInsights} of 7 completed</span>
            </div>
            <div className="w-full bg-btl-200 rounded-full h-3">
              <div
                className="bg-btl-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((dailyCompletedInsights / 7) * 100, 100)}%` }}
              />
            </div>
          </div>

          <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
          {insights.length === 0 && (
            <div className="text-center text-btl-600">No recovery insights available yet.</div>
          )}
          {insights.length > 0 && (
            <div className="space-y-4">
              {insights.map((insight: RecoveryInsight, idx: number) => (
                <div key={insight.id || idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
                  {/* Completion indicator */}
                  {insight.completed && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-semibold text-gray-900">{insight.title}</h3>
                    </div>
                    <div className="text-sm font-medium text-btl-600">+{insight.points} pts</div>
                  </div>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Category: {insight.category}</span>
                    <span>Date: {new Date(insight.date).toLocaleDateString()}</span>
                  </div>
                  {insight.metrics && insight.metrics.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      {insight.metrics.map((metric: RecoveryMetric, i: number) => (
                        <div key={i} className="bg-gradient-to-br from-white to-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
                          <div className="text-sm font-medium text-gray-800 mb-1">{metric.name}</div>
                          <div className="text-2xl font-bold text-gray-900">{metric.value} {metric.unit}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-btl-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex text-sm text-gray-700">
                                <span className="mr-2 text-btl-500">&bull;</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setSelectedInsight(insight);
                      setShowInsightDialog(true);
                    }}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                      insight.completed
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-btl-600 text-white hover:bg-btl-700"
                    }`}
                  >
                    {insight.completed ? "Completed" : "Take Quiz"}
                  </button>
                </div>
              ))}
            </div>
          )}
          </AssessmentDialogBody>

          {/* Footer with Action Buttons */}
          <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              Close Insights
            </button>
          </AssessmentDialogFooter>
        </AssessmentDialogContent>
    </AssessmentDialog>

    {/* Individual Insight Dialog */}
    {selectedInsight && showInsightDialog && (
      <InsightDialog
        insightId={parseInt(selectedInsight.id) || 1}
        isOpen={showInsightDialog}
        onClose={() => {
          setShowInsightDialog(false);
          setSelectedInsight(null);
        }}
        patientId={patientId}
        onComplete={(insightId, points) => {
          console.log('🎯 Insight completed:', { insightId, points });
          
          // Update daily completed insights count
          const newCompletedCount = Math.min(dailyCompletedInsights + 1, 7);
          setDailyCompletedInsights(newCompletedCount);
          
          // Save to localStorage
          let email = patientId;
          try {
            const stored = localStorage.getItem('btl_patient_data');
            if (stored) {
              const parsed = JSON.parse(stored);
              if (parsed.email) email = parsed.email;
            }
          } catch {}
          
          const today = new Date().toISOString().slice(0, 10);
          const key = `dailyInsightsCompleted_${email}_${today}`;
          localStorage.setItem(key, newCompletedCount.toString());
          
          // Refresh insights to show updated completion status
          setRefreshKey(prev => prev + 1);
        }}
      />
    )}
  </>
  );
} 