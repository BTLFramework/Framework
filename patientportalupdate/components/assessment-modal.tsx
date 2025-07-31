"use client"

import { X, ArrowRight, CheckCircle, Calendar, FileText } from "lucide-react"

// Utility function for missing data badge
function MissingBadge() {
  return (
    <span className="inline-block px-2 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-semibold ml-2">
      Not completed
    </span>
  );
}

interface IntakeFormData {
  patientName: string
  region: string
  vas: number
  confidence: number
  disabilityPercentage: number
  psfs: Array<{ activity: string; score: number }>
  beliefs: string[]
  srsScore: number
  groc?: number
  pcs4: { [key: number]: number }
  tsk7: { [key: number]: number }
}

interface AssessmentModalProps {
  assessment: {
    id: string
    title: string
    description: string
    status: "completed" | "due" | "upcoming"
    date: string
    completedDate?: string
    formData?: IntakeFormData
    actionButton?: string
  }
  onClose: () => void
}

export function AssessmentModal({ assessment, onClose }: AssessmentModalProps) {
  const handleStartAssessment = () => {
    // Here you would navigate to the actual assessment form
    alert(`Starting ${assessment.title}...`)
    onClose()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPhaseByScore = (score: number) => {
    if (score <= 3) return { label: "RESET", color: "text-btl-600 bg-btl-100" }
    if (score <= 6) return { label: "EDUCATE", color: "text-btl-700 bg-btl-100" }
    return { label: "REBUILD", color: "text-btl-800 bg-btl-50" }
  }

  const isCompleted = assessment.status === "completed"
  const phase = assessment.formData ? getPhaseByScore(assessment.formData.srsScore) : null

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        {/* Blue gradient header - cloned from MindfulnessSessionDialog */}
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 relative rounded-t-2xl">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white hover:bg-white/20 focus:bg-white/30 transition-all duration-200 hover:scale-110 focus:scale-110"
            aria-label="Close"
            type="button"
          >
            <X className="w-6 h-6" />
            <span className="sr-only">Close</span>
          </button>
          <div className="flex items-center gap-8">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <FileText className="w-12 h-12 text-white opacity-90" />
            </div>
            <h2 className="text-3xl font-bold text-white">
              {assessment.title}
            </h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            {assessment.description}
          </p>
        </div>

        <div className="p-8">
          {isCompleted && assessment.formData ? (
            <div className="space-y-8">
              {/* Completion info */}
              <div className="flex items-center space-x-3 p-4 bg-btl-50 rounded-xl border border-btl-200">
                <CheckCircle className="w-6 h-6 text-btl-600" />
                <div>
                  <p className="font-medium text-btl-900">Form Completed</p>
                  <p className="text-sm text-btl-700">
                    Completed on {formatDate(assessment.completedDate || assessment.date)}
                  </p>
                </div>
              </div>

              {/* SRS Score and Phase */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-btl-50 rounded-xl border border-btl-200">
                  <h3 className="font-semibold text-btl-900 mb-2">Signature Recovery Score™</h3>
                  <div className="text-3xl font-bold text-btl-700 mb-1">
                    {assessment.formData.srsScore}/11
                  </div>
                  <p className="text-sm text-btl-600">Your personalized recovery metric</p>
                </div>
                <div className="p-4 bg-btl-50 rounded-xl border border-btl-200">
                  <h3 className="font-semibold text-btl-900 mb-2">Recovery Phase</h3>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${phase?.color}`}>
                    {phase?.label}
                  </div>
                  <p className="text-sm text-btl-600 mt-1">Current recovery stage</p>
                </div>
              </div>

              {/* Assessment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-btl-900 border-b border-btl-200 pb-2">
                  Assessment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-btl-50 rounded-xl">
                    <h4 className="font-bold text-btl-700 mb-2">Pain Assessment</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">Pain Level (VAS):</span>
                        <span className="font-semibold text-btl-900">{assessment.formData.vas}/10</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">Region:</span>
                        <span className="font-semibold text-btl-900">{assessment.formData.region}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">Disability Index:</span>
                        <span className="font-semibold text-btl-900">{assessment.formData.disabilityPercentage}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-btl-50 rounded-xl">
                    <h4 className="font-bold text-btl-700 mb-2">Confidence & Function</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">Confidence Level:</span>
                        <span className="font-semibold text-btl-900">{assessment.formData.confidence}/10</span>
                      </div>
                      {assessment.formData.groc && (
                        <div className="flex justify-between">
                          <span className="text-sm text-btl-700">Global Rating of Change:</span>
                          <span className="font-semibold text-btl-900">+{assessment.formData.groc}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-btl-50 rounded-xl">
                  <h4 className="font-bold text-btl-700 mb-3">Functional Activities (PSFS)</h4>
                  <div className="space-y-2">
                    {assessment.formData.psfs.map((activity, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-sm text-btl-700">{activity.activity}:</span>
                        <span className="font-semibold text-btl-900">{activity.score}/10</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-4 bg-btl-50 rounded-xl">
                  <h4 className="font-bold text-btl-700 mb-2">Beliefs Assessment</h4>
                  <div className="space-y-1">
                    {assessment.formData.beliefs.length > 0 ? (
                      assessment.formData.beliefs.map((belief, index) => (
                        <p key={index} className="text-sm text-btl-700">• {belief}</p>
                      ))
                    ) : (
                      <p className="text-sm text-btl-700">No concerning beliefs identified</p>
                    )}
                  </div>
                </div>
                
                {/* PCS-4 Assessment */}
                <div className="p-4 bg-btl-50 rounded-xl">
                  <h4 className="font-bold text-btl-700 mb-2">Pain Catastrophizing (PCS-4)</h4>
                  <div className="space-y-2">
                    {assessment.formData.pcs4 && Object.keys(assessment.formData.pcs4).length === 4 ? (
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">PCS-4 Total:</span>
                        <span className="font-semibold text-btl-900">
                          {Object.values(assessment.formData.pcs4).reduce((sum: any, val: any) => sum + (parseInt(val) || 0), 0)}/16
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-btl-700">PCS-4 Total:</span>
                        <MissingBadge />
                      </div>
                    )}
                  </div>
                </div>
                
                {/* TSK-7 Assessment */}
                <div className="p-4 bg-btl-50 rounded-xl">
                  <h4 className="font-bold text-btl-700 mb-2">Fear-Avoidance (TSK-7)</h4>
                  <div className="space-y-2">
                    {assessment.formData.tsk7 && Object.keys(assessment.formData.tsk7).length === 7 ? (
                      <div className="flex justify-between">
                        <span className="text-sm text-btl-700">TSK-7 Total:</span>
                        <span className="font-semibold text-btl-900">
                          {/* Calculate with reverse scoring for items 2, 6, 7 */}
                          {(() => {
                            const reverseScoredItems = [2, 6, 7];
                            let total = 0;
                            for (let i = 1; i <= 7; i++) {
                              const response = assessment.formData.tsk7[i];
                              if (response !== undefined && response >= 0 && response <= 4) {
                                if (reverseScoredItems.includes(i)) {
                                  total += (4 - response);
                                } else {
                                  total += response;
                                }
                              }
                            }
                            return total;
                          })()}/28
                        </span>
                      </div>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-btl-700">TSK-7 Total:</span>
                        <MissingBadge />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center space-x-3 p-4 bg-btl-50 rounded-xl border border-btl-200">
                <Calendar className="w-6 h-6 text-btl-600" />
                <div>
                  <p className="font-medium text-btl-900">Assessment {assessment.status === "due" ? "Due" : "Upcoming"}</p>
                  <p className="text-sm text-btl-700">
                    {assessment.status === "due"
                      ? "This assessment is ready to complete"
                      : `This assessment will be available on ${formatDate(assessment.date)}`}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-btl-50 rounded-xl border border-btl-200">
                  <span className="font-medium text-btl-900">Estimated Time</span>
                  <span className="text-sm text-btl-700">10-15 minutes</span>
                </div>
                <div className="bg-btl-50 rounded-xl p-4">
                  <h3 className="font-medium text-btl-900 mb-2">What to expect:</h3>
                  <ul className="text-sm text-btl-700 space-y-1">
                    <li>• Rate your pain levels in different activities</li>
                    <li>• Answer questions about daily functioning</li>
                    <li>• Track your progress over time</li>
                    <li>• Get personalized insights and recommendations</li>
                  </ul>
                </div>
                {assessment.status === "due" && (
                  <button
                    onClick={handleStartAssessment}
                    className="w-full bg-gradient-to-r from-btl-600 to-btl-700 text-white py-3 px-4 rounded-xl hover:from-btl-700 hover:to-btl-800 transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                  >
                    <span>Start Assessment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
                {assessment.status === "upcoming" && (
                  <button
                    disabled
                    className="w-full bg-btl-100 text-btl-400 py-3 px-4 rounded-xl font-semibold flex items-center justify-center space-x-2 cursor-not-allowed"
                  >
                    <span>Locked until {formatDate(assessment.date)}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
