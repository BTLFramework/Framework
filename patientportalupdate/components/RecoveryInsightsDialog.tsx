import { LineChart, AlertCircle } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { useRecoveryInsights } from "@/hooks/useRecoveryInsights";
import type { RecoveryInsight, RecoveryMetric } from "@/types/recovery";
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
  const insights: RecoveryInsight[] = patientData ? useRecoveryInsights(patientData) : [];

  const viewedInsights = insights.filter(insight => insight.viewed).length;
  const totalInsights = insights.length;

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
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent>
        <AssessmentDialogHeader>
          <AssessmentDialogTitle className="flex items-center gap-2">
            <LineChart className="w-8 h-8 text-white" />
            Recovery Insights
          </AssessmentDialogTitle>
          <AssessmentDialogDescription>
            Track your recovery progress and understand key patterns in your healing journey.
          </AssessmentDialogDescription>
          <AssessmentDialogProgress 
            step={viewedInsights} 
            totalSteps={totalInsights} 
          />
        </AssessmentDialogHeader>
        <AssessmentDialogBody>
          {insights.length === 0 && (
            <div className="text-center text-btl-600">No recovery insights available yet.</div>
          )}
          {insights.length > 0 && (
            <div className="space-y-4">
              {insights.map((insight: RecoveryInsight, idx: number) => (
                <div key={insight.id || idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
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
                        <div key={i} className="bg-cyan-50 p-4 rounded-xl border border-cyan-200">
                          <div className="text-sm font-medium text-cyan-800 mb-1">{metric.label}</div>
                          <div className="text-2xl font-bold text-cyan-900">{metric.value}</div>
                          {metric.change && (
                            <div className={`text-sm font-medium mt-1 ${
                              metric.change > 0 ? "text-green-600" : "text-red-600"
                            }`}>
                              {metric.change > 0 ? "+" : ""}{metric.change}%
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {insight.recommendations && insight.recommendations.length > 0 && (
                    <div className="mt-4 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-cyan-800 mb-2">Recommendations:</h4>
                          <ul className="space-y-2">
                            {insight.recommendations.map((rec: string, i: number) => (
                              <li key={i} className="flex text-sm text-cyan-700">
                                <span className="mr-2 text-cyan-500">&bull;</span>
                                <span>{rec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={() => {/* TODO: Implement insight view tracking */}}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                      insight.viewed
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-btl-600 text-white hover:bg-btl-700"
                    }`}
                  >
                    {insight.viewed ? "Viewed" : "Mark as Viewed"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </AssessmentDialogBody>
        <AssessmentDialogFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close Insights
          </button>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 