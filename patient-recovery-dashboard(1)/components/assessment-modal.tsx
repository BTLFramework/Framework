"use client"

import { X, Clock, Award, ArrowRight, PlayCircle, TrendingUp, Brain, Target, User, MapPin, Activity, Heart, Target as TargetIcon, Zap } from "lucide-react"
import { Dialog, DialogHeader, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface AssessmentModalProps {
  assessment: {
    id?: string
    title: string
    description?: string
    status: string
    date?: string
    scores?: {
      srs: string
      ndi: string
      phase: string
    }
    formData?: {
      patientInfo: {
        name: string
        age: string
        gender: string
        occupation: string
      }
      painRegion: {
        primaryRegion: string
        secondaryRegions: string[]
        painPattern: string
      }
      painScale: {
        currentPain: number
        worstPain: number
        averagePain: number
        painDescription: string
      }
      dailyActivities: {
        difficultyLevel: string
        affectedActivities: string[]
        limitations: string
      }
      beliefs: {
        painUnderstanding: string
        recoveryExpectations: string
        concerns: string
      }
      confidence: {
        confidenceLevel: number
        readinessForChange: string
        goals: string
      }
    }
    timeInfo?: string
    points?: number
    phaseInfo?: {
      title: string
      message: string
      focus?: string
      encouragement?: string
    }
    insights?: string[]
  }
  onClose: () => void
}

export function AssessmentModal({ assessment, onClose }: AssessmentModalProps) {
  const handleStartAssessment = () => {
    // Here you would navigate to the actual assessment
    alert(`Starting ${assessment.title}...`)
    onClose()
  }

  const getCognitiveReframing = (phase: string) => {
    switch (phase) {
      case "RESET":
        return "You're in the RESET phase - this is your foundation for recovery. Focus on understanding your pain and building awareness of your body's signals."
      case "REBUILD":
        return "You're in the REBUILD phase - you're actively strengthening and retraining your body. Each assessment shows your progress in rebuilding function."
      case "RESTORE":
        return "You're in the RESTORE phase - you're returning to the activities you love. Your assessments reflect your growing confidence and capability."
      default:
        return "Your assessment results help guide your recovery journey. Each phase builds upon the last, creating lasting change."
    }
  }

  const isCompleted = assessment.status === "completed"
  const isInitialIntake = assessment.title === "Initial Intake Form"

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-card rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-foreground">{assessment.title}</h2>
              {assessment.date && (
                <p className="text-muted-foreground text-sm mt-1">Completed on {assessment.date}</p>
              )}
            </div>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {isCompleted && assessment.scores ? (
            // Show completed assessment results
            <div className="space-y-6">
              {/* Summary Scores */}
              <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Assessment Summary
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-background rounded-lg border border-border">
                    <div className="text-2xl font-bold text-primary">{assessment.scores.srs}</div>
                    <div className="text-sm text-muted-foreground">Signature Recovery Score</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border border-border">
                    <div className="text-2xl font-bold text-primary">{assessment.scores.ndi}</div>
                    <div className="text-sm text-muted-foreground">Neck Disability Index</div>
                  </div>
                  <div className="text-center p-4 bg-background rounded-lg border border-border">
                    <div className="text-2xl font-bold text-accent">{assessment.scores.phase}</div>
                    <div className="text-sm text-muted-foreground">Current Phase</div>
                  </div>
                </div>
              </div>

              {/* Initial Intake Form Details */}
              {isInitialIntake && assessment.formData && (
                <div className="space-y-4">
                  {/* Patient Info */}
                  <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <User className="w-5 h-5 mr-2 text-primary" />
                      Patient Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted-foreground">Name:</span> <span className="text-foreground font-medium">{assessment.formData.patientInfo.name}</span></div>
                      <div><span className="text-muted-foreground">Age:</span> <span className="text-foreground font-medium">{assessment.formData.patientInfo.age}</span></div>
                      <div><span className="text-muted-foreground">Gender:</span> <span className="text-foreground font-medium">{assessment.formData.patientInfo.gender}</span></div>
                      <div><span className="text-muted-foreground">Occupation:</span> <span className="text-foreground font-medium">{assessment.formData.patientInfo.occupation}</span></div>
                    </div>
                  </div>

                  {/* Pain & Region */}
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/20">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-accent" />
                      Pain & Region
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-muted-foreground">Primary Region:</span> <span className="text-foreground font-medium">{assessment.formData.painRegion.primaryRegion}</span></div>
                      <div><span className="text-muted-foreground">Secondary Regions:</span> <span className="text-foreground font-medium">{assessment.formData.painRegion.secondaryRegions.join(", ")}</span></div>
                      <div><span className="text-muted-foreground">Pain Pattern:</span> <span className="text-foreground font-medium">{assessment.formData.painRegion.painPattern}</span></div>
                    </div>
                  </div>

                  {/* Pain Scale */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <Activity className="w-5 h-5 mr-2 text-primary" />
                      Pain Scale
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                      <div className="text-center p-3 bg-background rounded-lg border border-border">
                        <div className="text-xl font-bold text-primary">{assessment.formData.painScale.currentPain}/10</div>
                        <div className="text-xs text-muted-foreground">Current Pain</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg border border-border">
                        <div className="text-xl font-bold text-primary">{assessment.formData.painScale.worstPain}/10</div>
                        <div className="text-xs text-muted-foreground">Worst Pain</div>
                      </div>
                      <div className="text-center p-3 bg-background rounded-lg border border-border">
                        <div className="text-xl font-bold text-primary">{assessment.formData.painScale.averagePain}/10</div>
                        <div className="text-xs text-muted-foreground">Average Pain</div>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Description:</span> <span className="text-foreground">{assessment.formData.painScale.painDescription}</span>
                    </div>
                  </div>

                  {/* Daily Activities */}
                  <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-6 border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-accent" />
                      Daily Activities
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-muted-foreground">Difficulty Level:</span> <span className="text-foreground font-medium">{assessment.formData.dailyActivities.difficultyLevel}</span></div>
                      <div><span className="text-muted-foreground">Affected Activities:</span> <span className="text-foreground font-medium">{assessment.formData.dailyActivities.affectedActivities.join(", ")}</span></div>
                      <div><span className="text-muted-foreground">Limitations:</span> <span className="text-foreground">{assessment.formData.dailyActivities.limitations}</span></div>
                    </div>
                  </div>

                  {/* Beliefs */}
                  <div className="bg-gradient-to-r from-accent/10 to-primary/10 rounded-xl p-6 border border-accent/20">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <Brain className="w-5 h-5 mr-2 text-accent" />
                      Beliefs
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div><span className="text-muted-foreground">Pain Understanding:</span> <span className="text-foreground">{assessment.formData.beliefs.painUnderstanding}</span></div>
                      <div><span className="text-muted-foreground">Recovery Expectations:</span> <span className="text-foreground">{assessment.formData.beliefs.recoveryExpectations}</span></div>
                      <div><span className="text-muted-foreground">Concerns:</span> <span className="text-foreground">{assessment.formData.beliefs.concerns}</span></div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center">
                      <Zap className="w-5 h-5 mr-2 text-primary" />
                      Confidence
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-muted-foreground">Confidence Level:</span>
                        <div className="flex space-x-1">
                          {[...Array(10)].map((_, i) => (
                            <div
                              key={i}
                              className={`w-3 h-3 rounded-full ${
                                i < (assessment.formData?.confidence.confidenceLevel || 0)
                                  ? 'bg-primary' 
                                  : 'bg-secondary'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-foreground font-medium">({assessment.formData?.confidence.confidenceLevel || 0}/10)</span>
                      </div>
                      <div><span className="text-muted-foreground">Readiness for Change:</span> <span className="text-foreground">{assessment.formData?.confidence.readinessForChange || 'Not specified'}</span></div>
                      <div><span className="text-muted-foreground">Goals:</span> <span className="text-foreground">{assessment.formData?.confidence.goals || 'Not specified'}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Phase Information */}
              <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 rounded-xl p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-accent" />
                  {assessment.phaseInfo?.title || `Your Recovery Phase: ${assessment.scores.phase}`}
                </h3>
                <p className="text-foreground text-sm leading-relaxed mb-3">
                  {assessment.phaseInfo?.message || getCognitiveReframing(assessment.scores.phase)}
                </p>
                {assessment.phaseInfo?.focus && (
                  <div className="bg-background p-3 rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground mb-1">Focus Areas:</p>
                    <p className="text-sm text-foreground font-medium">{assessment.phaseInfo.focus}</p>
                  </div>
                )}
                {assessment.phaseInfo?.encouragement && (
                  <div className="mt-3 p-3 bg-accent/10 rounded-lg border border-accent/20">
                    <p className="text-sm text-accent font-medium">{assessment.phaseInfo.encouragement}</p>
                  </div>
                )}
              </div>

              {/* Personalized Insights */}
              {assessment.insights && assessment.insights.length > 0 && (
                <div className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-xl p-6 border border-primary/20">
                  <h3 className="font-semibold text-foreground mb-4 flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-accent" />
                    Personalized Insights
                  </h3>
                  <div className="space-y-2">
                    {assessment.insights.map((insight, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-foreground text-sm">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Show assessment start information
            <div className="space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <Clock className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">Time Required</p>
                  <p className="text-sm text-muted-foreground">5-7 minutes</p>
                </div>
              </div>

              <div className="bg-secondary/10 rounded-lg p-4">
                <h3 className="font-medium text-foreground mb-2">What to expect:</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Rate your pain levels in different activities</li>
                  <li>• Answer questions about daily functioning</li>
                  <li>• Track your progress over time</li>
                  <li>• Get personalized insights</li>
                </ul>
              </div>

              <Button
                type="button"
                className="w-full bg-gradient-to-r from-primary to-accent hover:from-accent hover:to-primary text-white py-3 px-4 rounded-xl transition-all duration-200 font-semibold shadow-md hover:shadow-lg flex items-center justify-center space-x-2"
                onClick={handleStartAssessment}
              >
                <PlayCircle className="w-5 h-5" />
                <span>Start Assessment</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
