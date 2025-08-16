"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, XCircle, Info, TrendingUp, Target, Heart, Shield, Zap } from "lucide-react"
import { AssessmentDialog, AssessmentDialogContent, AssessmentDialogHeader } from "@/components/ui/assessment-dialog"

// Custom SRS Icon Component
function SRSIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <div className={`${className} flex items-center justify-center bg-gradient-to-br from-btl-500 to-btl-600 rounded-2xl shadow-lg border border-btl-400/30`}>
      <div className="text-center">
        <div className="text-lg font-bold text-white tracking-tight">SRS</div>
        <div className="text-xs text-white/80 font-medium -mt-1">™</div>
      </div>
    </div>
  )
}

interface ScoreBreakdownModalProps {
  score: number
  onClose: () => void
  intakeData?: any // Optional real intake data from backend
}

interface BreakdownItem {
  title: string
  description: string
  points: number
  achieved: boolean
  details: string
  icon: React.ReactNode
  category: 'movement' | 'mindset' | 'progress' | 'assessment'
  helper?: string
}

interface ScoreResult {
  score: number
  breakdown: BreakdownItem[]
  achievedAreas?: BreakdownItem[]
  totalDomains?: number
}

// Patient-friendly SRS Configuration

const recoveryAreas = {
  pain: {
    title: "Pain Level (0-10 scale)",
    description: "Low pain that doesn't limit your daily activities",
    threshold: 2,
    points: 1,
    icon: <Heart className="w-5 h-5" />,
    category: 'assessment' as const
  },
  disability: {
    title: "Disability Index (%)",
    description: "Able to perform daily tasks without difficulty",
    threshold: 20,
    points: 1,
    icon: <Target className="w-5 h-5" />,
    category: 'movement' as const
  },
  function: {
    title: "Patient-Specific Functional Scale (0-10)",
    description: "Confident in your ability to move and function",
    excellent: { threshold: 7, points: 2 },
    good: { threshold: 4, points: 1 },
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'movement' as const
  },
  confidence: {
    title: "Recovery Confidence (0-10 scale)",
    description: "Believe in your ability to recover and improve",
    high: { threshold: 8, points: 2 },
    moderate: { threshold: 5, points: 1 },
    icon: <Shield className="w-5 h-5" />,
    category: 'mindset' as const
  },
  beliefs: {
    title: "Negative Beliefs About Recovery",
    description: "No negative thoughts about your recovery",
    points: 1,
    icon: <Zap className="w-5 h-5" />,
    category: 'mindset' as const
  },
  painBeliefs: {
    title: "Pain Catastrophizing Scale",
    description: "Understand that pain doesn't mean harm",
    threshold: 6,
    points: 1,
    icon: <Heart className="w-5 h-5" />,
    category: 'mindset' as const
  },
  fearAvoidance: {
    title: "Fear of Movement",
    description: "Not afraid to move and be active",
    threshold: 22,
    points: 1,
    icon: <TrendingUp className="w-5 h-5" />,
    category: 'movement' as const
  },
  clinician: {
    milestone: { 
      title: "Recovery Milestone Achievement",
      description: "Met an important recovery goal",
      points: 1,
      icon: <Target className="w-5 h-5" />,
      category: 'progress' as const
    },
    progress: { 
      title: "Objective Progress Measurement",
      description: "Showing clear improvement in function",
      points: 1,
      icon: <TrendingUp className="w-5 h-5" />,
      category: 'progress' as const
    }
  }
}

// Remove the calculateRealSRS function - frontend doesn't calculate SRS anymore
// The backend is the single source of truth for all SRS calculations

// Sample data for demonstration
const sampleIntakeData = {
  vas: "2",
  disability: "15",
  psfs: "7.5",
  confidence: "7",
  negativeBeliefs: "no",
  painCatastrophizing: "5",
      tsk7: "18"
}

export function ScoreBreakdownModal({ score, onClose, intakeData }: ScoreBreakdownModalProps) {
  const [calculatedScore, setCalculatedScore] = useState<ScoreResult>({ score: 0, breakdown: [] })
  const [expanded, setExpanded] = useState(false) // Tiered reveal state

  useEffect(() => {
    // Use the score passed from the backend (main dashboard)
    // Create a breakdown display using Amy's real data for transparency
    try {
      console.log('📊 Using backend SRS score:', score)
      console.log('📊 Backend intake data:', intakeData)
      
      // Create breakdown structure based on Amy's actual data
      const displayBreakdown: BreakdownItem[] = [
        {
          title: "Pain Level (0-10 scale)",
          description: "Low pain that doesn't limit your daily activities",
          points: (intakeData && intakeData.vas <= 2) ? 1 : 0,
          achieved: intakeData && intakeData.vas <= 2,
          details: intakeData ? `Your score: ${intakeData.vas || 0}/10` : "Assessment data loading...",
          icon: <Heart className="w-5 h-5" />,
          category: 'assessment'
        },
        {
          title: "Disability Index (%)",
          description: "Able to perform daily tasks without difficulty",
          points: (() => {
            if (!intakeData) return 0;
            // Calculate NDI percentage (each item 0-5, total /50 * 100)
            if (intakeData.ndi && Array.isArray(intakeData.ndi)) {
              const ndiTotal = intakeData.ndi.reduce((sum: number, score: number) => sum + score, 0);
              const ndiPercentage = (ndiTotal / 50) * 100;
              return ndiPercentage <= 20 ? 1 : 0;
            }
            return 0;
          })(),
          achieved: (() => {
            if (!intakeData) return false;
            if (intakeData.ndi && Array.isArray(intakeData.ndi)) {
              const ndiTotal = intakeData.ndi.reduce((sum: number, score: number) => sum + score, 0);
              const ndiPercentage = (ndiTotal / 50) * 100;
              return ndiPercentage <= 20;
            }
            return false;
          })(),
          details: (() => {
            if (!intakeData || !intakeData.ndi || !Array.isArray(intakeData.ndi)) return "Assessment data loading...";
            const ndiTotal = intakeData.ndi.reduce((sum: number, score: number) => sum + score, 0);
            const ndiPercentage = Math.round((ndiTotal / 50) * 100);
            return `Your score: ${ndiPercentage}%`;
          })(),
          icon: <Target className="w-5 h-5" />,
          category: 'movement'
        },
        {
          title: "Patient-Specific Functional Scale (0-10)",
          description: "Confident in your ability to move and function",
          points: (() => {
            if (!intakeData || !intakeData.psfs || !Array.isArray(intakeData.psfs)) return 0;
            const avgScore = intakeData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / intakeData.psfs.length;
            return avgScore >= 7 ? 2 : avgScore >= 4 ? 1 : 0;
          })(),
          achieved: (() => {
            if (!intakeData || !intakeData.psfs || !Array.isArray(intakeData.psfs)) return false;
            const avgScore = intakeData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / intakeData.psfs.length;
            return avgScore >= 4;
          })(),
          details: (() => {
            if (!intakeData || !intakeData.psfs || !Array.isArray(intakeData.psfs)) return "Assessment data loading...";
            const avgScore = (intakeData.psfs.reduce((sum: number, item: any) => sum + (item.score || 0), 0) / intakeData.psfs.length).toFixed(1);
            return `Your score: ${avgScore}/10`;
          })(),
          icon: <Zap className="w-5 h-5" />,
          category: 'movement'
        },
        {
          title: "Recovery Confidence (0-10 scale)",
          description: "Feeling confident about your recovery journey",
          points: (intakeData && intakeData.confidence >= 8) ? 2 : (intakeData && intakeData.confidence >= 5) ? 1 : 0,
          achieved: intakeData && intakeData.confidence >= 5,
          details: intakeData ? `Your score: ${intakeData.confidence || 0}/10` : "Assessment data loading...",
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'mindset'
        },
        {
          title: "Negative Beliefs About Recovery",
          description: "Maintaining positive outlook on recovery",
          points: (intakeData && intakeData.beliefStatus === "Positive") ? 1 : 0,
          achieved: intakeData && intakeData.beliefStatus === "Positive",
          details: intakeData ? `Your outlook: ${intakeData.beliefStatus || "Not assessed"}` : "Assessment data loading...",
          icon: <Shield className="w-5 h-5" />,
          category: 'mindset'
        },
        {
          title: "Pain Catastrophizing Scale",
          description: "Managing thoughts about pain in healthy ways",
          points: (() => {
            if (!intakeData || !intakeData.pcs4) return 0;
            const pcsTotal = Object.values(intakeData.pcs4).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
            return pcsTotal <= 6 ? 1 : 0;
          })(),
          achieved: (() => {
            if (!intakeData || !intakeData.pcs4) return false;
            const pcsTotal = Object.values(intakeData.pcs4).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
            return pcsTotal <= 6;
          })(),
          details: (() => {
            if (!intakeData || !intakeData.pcs4) return "Assessment data loading...";
            const pcsTotal = Object.values(intakeData.pcs4).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
            return `Your score: ${pcsTotal}/16`;
          })(),
          icon: <Heart className="w-5 h-5" />,
          category: 'mindset'
        },
        {
          title: "Fear of Movement",
          description: "Feeling comfortable with physical activity",
          points: (() => {
              if (!intakeData || !intakeData.tsk7) return 0;
  const tskTotal = Object.values(intakeData.tsk7).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  return tskTotal <= 8 ? 1 : 0; // TSK-7 threshold: ≤8 points (30% of 28)
          })(),
          achieved: (() => {
              if (!intakeData || !intakeData.tsk7) return false;
  const tskTotal = Object.values(intakeData.tsk7).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  return tskTotal <= 8; // TSK-7 threshold: ≤8 points (30% of 28)
          })(),
          details: (() => {
              if (!intakeData || !intakeData.tsk7) return "Assessment data loading...";
  const tskTotal = Object.values(intakeData.tsk7).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0);
  return `Your score: ${tskTotal}/28`;
          })(),
          icon: <Zap className="w-5 h-5" />,
          category: 'movement'
        },
        {
          title: "Recovery Milestone Achievement",
          description: "Met a meaningful goal in your recovery",
        points: 0,
        achieved: false,
          details: "Not yet assessed",
          icon: <Target className="w-5 h-5" />,
          category: 'progress',
          helper: "Your therapist will update this during your treatment sessions."
        },
        {
          title: "Objective Progress Measurement",
          description: "Shows clear, measurable improvement in your function",
          points: 0,
          achieved: false,
          details: "Not yet assessed", 
          icon: <TrendingUp className="w-5 h-5" />,
          category: 'progress',
          helper: "Your therapist will track and update this based on your progress."
        }
      ]

      // Filter achieved areas for Tier 1 display
      const achievedAreas = displayBreakdown.filter(item => item.achieved)
      const totalDomains = displayBreakdown.length

      // Set the calculated score for display
      setCalculatedScore({ 
        score: score, // Use backend score (single source of truth)
        breakdown: displayBreakdown,
        achievedAreas: achievedAreas,
        totalDomains: totalDomains
      })
      
    } catch (error) {
      console.error('Error processing SRS breakdown data:', error)
      setCalculatedScore({ score: score, breakdown: [] })
    }
  }, [score, intakeData])

  const getPhase = (score: number) => {
    if (score <= 3) return "RESET"
    if (score <= 7) return "EDUCATE"
    return "REBUILD"
  }

  const currentPhase = getPhase(calculatedScore.score)

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'movement': return 'from-btl-500 to-btl-600'
      case 'mindset': return 'from-btl-400 to-btl-500'
      case 'progress': return 'from-btl-600 to-btl-700'
      case 'assessment': return 'from-btl-300 to-btl-400'
      default: return 'from-btl-500 to-btl-600'
    }
  }

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'movement': return 'Movement & Function'
      case 'mindset': return 'Mindset & Beliefs'
      case 'progress': return 'Progress Tracking'
      case 'assessment': return 'Initial Assessment'
      default: return 'Other'
    }
  }

  return (
    <AssessmentDialog open={true} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-4xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        {/* Header */}
        <AssessmentDialogHeader className="px-8 py-6 bg-gradient-to-r from-btl-600 to-btl-500 text-white relative">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="flex items-center space-x-2">
            <img src="/SRS-icon.png" alt="SRS Logo" className="w-24 h-24 object-contain" />
            <div>
              <div className="text-2xl font-bold leading-tight">SRS Score Breakdown</div>
              <div className="text-btl-100 text-base font-medium">Understanding your recovery progress</div>
            </div>
          </div>
        </AssessmentDialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          
            {/* About Your Score Info */}
          <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-btl-50 to-btl-100 rounded-xl border border-btl-200">
            <Info className="w-6 h-6 text-btl-600 mt-0.5 flex-shrink-0" />
              <div>
              <p className="font-bold text-btl-900 mb-1">About Your Recovery Score</p>
              <p className="text-sm text-btl-800">
                Your Signature Recovery Score™ is a personalized snapshot of your recovery—tracking real progress across pain, movement, mindset, and clinical milestones. It helps guide your recovery phase and shows what's working, what's holding you back, and when you're ready to move forward.
                </p>
              </div>
            </div>

            {/* Score Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="text-center p-6 bg-gradient-to-br from-btl-50 to-btl-100 rounded-xl border border-btl-200">
              <h3 className="font-semibold text-btl-900 mb-2">Your Current Score</h3>
              <div className="text-4xl font-bold text-btl-700 mb-1">
                  {calculatedScore.score}/11
              </div>
              <p className="text-sm text-btl-600">Signature Recovery Score™</p>
                </div>
            
            <div className="text-center p-6 bg-gradient-to-br from-btl-50 to-btl-100 rounded-xl border border-btl-200">
              <h3 className="font-semibold text-btl-900 mb-2">Your Progress</h3>
              <div className="text-4xl font-bold text-btl-700 mb-1">
                {getPhase(calculatedScore.score)}
              </div>
              <p className="text-sm text-btl-600">Current recovery phase</p>
              </div>
            </div>

          {/* Tiered Content */}
          {!expanded ? (
            /* Tier 1: Wins-only view */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Your Strengths ({calculatedScore.achievedAreas?.length || 0} / {calculatedScore.totalDomains} domains met)
              </h3>
                <button
                  onClick={() => setExpanded(true)}
                  className="text-btl-600 hover:text-btl-700 text-sm font-medium flex items-center space-x-1 hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  <span>See all domains</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              {calculatedScore.achievedAreas && calculatedScore.achievedAreas.length > 0 ? (
              <div className="space-y-3">
                  {calculatedScore.achievedAreas.map((item, index) => (
                  <div
                    key={index}
                      className="p-4 rounded-xl border-2 bg-gradient-to-r from-btl-50 to-btl-100 border-btl-200 shadow-sm"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-btl-500 to-btl-600 text-white">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-btl-900">{item.title}</h4>
                          <p className="text-sm text-btl-700 mt-1">{item.details}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p className="mb-2">No domains met yet - this is normal at the start of your recovery journey!</p>
                  <p className="text-sm">Your therapist will help you work on these areas.</p>
                </div>
              )}
            </div>
          ) : (
            /* Tier 2: Full breakdown table */
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Complete Breakdown</h3>
                <button
                  onClick={() => setExpanded(false)}
                  className="text-btl-600 hover:text-btl-700 text-sm font-medium flex items-center space-x-1 hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                  <span>Hide details</span>
                </button>
              </div>

              {/* Full breakdown table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gradient-to-r from-btl-50 to-btl-100 border-b border-btl-200">
                      <th className="text-left p-3 font-semibold text-btl-900">Domain</th>
                      <th className="text-left p-3 font-semibold text-btl-900">Your Score</th>
                      <th className="text-center p-3 font-semibold text-btl-900">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculatedScore.breakdown.map((item, index) => (
                      <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              item.achieved ? 'bg-btl-500 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                              {item.icon}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{item.title}</div>
                              {item.helper && (
                                <div className="text-xs text-btl-600 mt-1">{item.helper}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-3 text-gray-700">{item.details}</td>
                        <td className="p-3 text-center">
                          {item.achieved ? (
                            <span className="inline-flex items-center text-btl-700">
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Met
                            </span>
                          ) : item.details === "Not yet assessed" ? (
                            <span className="inline-flex items-center text-gray-500">
                              <span className="w-4 h-4 mr-1">—</span>
                              Not assessed
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-gray-600">
                              <XCircle className="w-4 h-4 mr-1" />
                              Not yet
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
            </div>

              {/* Legend */}
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Legend:</span> ✓ Met threshold · ✗ Not yet · — Not assessed
              </p>
            </div>
          </div>
          )}

        </div>
      </AssessmentDialogContent>
    </AssessmentDialog>
  )
}

