"use client"

import React, { useState, useEffect } from "react"
import { ArrowLeft, TrendingUp, Award, Info, CheckCircle, XCircle, Shield, Target, Heart, Zap } from "lucide-react"
import { useRouter } from "next/navigation"
import { RecoveryScoreWheel } from "@/components/recovery-score-wheel"
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal"

type BreakdownItem = {
  title: string;
  description: string;
  points: number;
  achieved: boolean;
  details: string;
  icon: React.ReactElement;
  category: string;
  helper?: string;
};

// Extracted ScoreBreakdownSection (non-modal, always visible)
function ScoreBreakdownSection({ score, intakeData }: { score: number; intakeData?: any }) {
  const [calculatedScore, setCalculatedScore] = useState<{ score: number; breakdown: BreakdownItem[]; achievedAreas: BreakdownItem[]; totalDomains: number }>({ score: 0, breakdown: [], achievedAreas: [], totalDomains: 0 })
  
  useEffect(() => {
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
    ];
    
    setCalculatedScore({ score, breakdown: displayBreakdown, achievedAreas: [], totalDomains: displayBreakdown.length })
  }, [score, intakeData])
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Score Breakdown</h2>
      {/* Full breakdown table (static for now) */}
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${item.achieved ? 'bg-btl-500 text-white' : 'bg-gray-300 text-gray-600'}`}>
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
  )
}

// Helper to get current phase from score
function getPhase(score: number) {
  if (score <= 3) return 'RESET';
  if (score <= 7) return 'EDUCATE';
  return 'REBUILD';
}

export default function RecoveryScorePage() {
  const router = useRouter()
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [currentScore, setCurrentScore] = useState(7)
  const [amyIntakeData, setAmyIntakeData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [scoreHistory, setScoreHistory] = useState<any[]>([])
  const [nextAssessmentLabel, setNextAssessmentLabel] = useState<string>('in 4 weeks')

  // Fetch Amy's real intake data and progress history on component mount
  useEffect(() => {
    const fetchAmyData = async () => {
      try {
        console.log('🔍 Fetching Amy\'s real data for Recovery Score Details...')
        
        // Fetch Amy's portal data (intake information)
        const portalResponse = await fetch('https://framework-production-92f5.up.railway.app/patients/portal-data/amy@123.com')
        
        // Fetch Amy's progress history
        const progressResponse = await fetch('/api/patients/progress-history/amy@123.com')
        
        let intakeData = null;
        let progressData = [];

        // Process portal data
        if (portalResponse.ok) {
          const portalResult = await portalResponse.json()
          console.log('📊 Amy\'s portal data:', portalResult.data)
          
          // Extract intake data from the portal response
          intakeData = {
            vas: portalResult.data.vas || 3,
            disability: portalResult.data.disability || 15,
            psfs: portalResult.data.psfs || 7.0,
            confidence: portalResult.data.confidence || 6,
            negativeBeliefs: portalResult.data.negativeBeliefs || 'no',
            pcs4: portalResult.data.pcs4 || 5,
            tsk7: portalResult.data.tsk7 || 18,
            milestoneAchieved: portalResult.data.milestoneAchieved || 'no',
            objectiveProgress: portalResult.data.objectiveProgress || 'no',
            ndi: portalResult.data.ndi || [],
            beliefStatus: portalResult.data.beliefStatus || 'Positive'
          }
          
          setCurrentScore(portalResult.data.srsScore || 7)
          console.log('✅ Amy\'s intake data loaded:', intakeData)

          // Calculate next assessment date
          const intakeDateStr = portalResult.data.intakeDate || portalResult.data.patient?.intakeDate;
          const intakeDate = intakeDateStr ? new Date(intakeDateStr) : null;
          const nextAssessmentDate = intakeDate ? new Date(intakeDate.getTime() + 28 * 24 * 60 * 60 * 1000) : null;
          setNextAssessmentLabel(
            nextAssessmentDate
              ? nextAssessmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
              : 'in 4 weeks'
          );
        }

        // Process progress history
        if (progressResponse.ok) {
          const progressResult = await progressResponse.json()
          console.log('📈 Amy\'s progress history:', progressResult.data)
          
          progressData = progressResult.data.progressHistory.map((entry: any) => ({
            date: new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            score: entry.score,
            phase: entry.phase,
            formType: entry.formType
          }))
          
          console.log('✅ Progress history processed:', progressData)
        } else {
          console.log('⚠️ Could not fetch progress history, using fallback data')
          // Fallback to sample data if progress history fails
          progressData = [
            { date: "Dec 1", score: 3, phase: "RESET", formType: "Intake" },
            { date: "Dec 8", score: 5, phase: "EDUCATE", formType: "Follow-Up" },
            { date: "Dec 15", score: 7, phase: "EDUCATE", formType: "Follow-Up" },
            { date: "Dec 22", score: 7, phase: "EDUCATE", formType: "Follow-Up" },
          ]
        }

        // Set state with fetched or fallback data
        setAmyIntakeData(intakeData || {
          vas: 3,
          disability: 15,
          psfs: 7.0,
          confidence: 6,
          negativeBeliefs: 'no',
          pcs4: 5,
          tsk11: 18,
          milestoneAchieved: 'no',
          objectiveProgress: 'no',
          ndi: [],
          beliefStatus: 'Positive'
        })

        setScoreHistory(progressData)
        
      } catch (error) {
        console.error('❌ Error fetching Amy\'s data:', error)
        // Use fallback data on error
        setAmyIntakeData({
          vas: 3,
          disability: 15,
          psfs: 7.0,
          confidence: 6,
          negativeBeliefs: 'no',
          pcs4: 5,
          tsk11: 18,
          milestoneAchieved: 'no',
          objectiveProgress: 'no',
          ndi: [],
          beliefStatus: 'Positive'
        })
        
        setScoreHistory([
          { date: "Dec 1", score: 3, phase: "RESET", formType: "Intake" },
          { date: "Dec 8", score: 5, phase: "EDUCATE", formType: "Follow-Up" },
          { date: "Dec 15", score: 7, phase: "EDUCATE", formType: "Follow-Up" },
          { date: "Dec 22", score: 7, phase: "EDUCATE", formType: "Follow-Up" },
        ])
        setNextAssessmentLabel('in 4 weeks')
      } finally {
        setLoading(false)
      }
    }

    fetchAmyData()
  }, [])

  const milestones = [
    { score: 4, title: "Foundation Built", description: "Basic recovery habits established", achieved: true },
    { score: 7, title: "REBUILD Ready", description: "Ready for strength building phase", achieved: true },
    { score: 9, title: "Graduation Ready", description: "Independent recovery management", achieved: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-gradient-to-r from-[#155e75] via-[#0891b2] to-[#06b6d4] px-6 py-6 rounded-t-2xl shadow-md flex items-center gap-4">
        <img src="/SRS-icon.png" alt="Signature Recovery Score Logo" className="w-20 h-20 object-contain" />
        <div>
          <h1 className="text-2xl font-bold text-white">Recovery Score Details</h1>
          <p className="text-white/80">Track your personalized recovery progress</p>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-btl-600"></div>
              <span className="ml-4 text-btl-600 font-medium">Loading Amy's recovery data...</span>
            </div>
          ) : (
            <>
              {/* Main content grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Left column: Recovery Score Wheel */}
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-center">
                    <RecoveryScoreWheel score={currentScore} maxScore={11} phase={getPhase(currentScore)} />
                  </div>
                </div>

                {/* Right column: Progress Trend and Phases Legend */}
                <div className="flex flex-col gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                    <div className="flex items-center space-x-2 mb-6">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Progress Trend</h2>
                    </div>
                    
                    {scoreHistory.length <= 1 ? (
                      <div className="space-y-6">
                        {/* Single assessment display */}
                        {scoreHistory.length === 1 && (
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">{scoreHistory[0].date}</span>
                              <div className="flex items-center space-x-2">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-gradient-to-r from-btl-500 to-btl-600 h-2 rounded-full"
                                    style={{ width: `${(scoreHistory[0].score / 11) * 100}%` }}
                                  ></div>
                                </div>
                                <span className="font-semibold text-btl-600 w-8">{scoreHistory[0].score}</span>
                              </div>
                            </div>
                            <div className="text-xs text-gray-500 flex items-center space-x-1">
                              <span className="w-2 h-2 bg-btl-500 rounded-full"></span>
                              <span>Initial Assessment ({scoreHistory[0].formType})</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Future assessment placeholder */}
                        <div className="flex items-center justify-between opacity-60 border-t pt-4">
                          <span className="text-gray-400">Next assessment</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-32 bg-gray-100 rounded-full h-2"></div>
                            <span className="text-sm text-gray-400">{nextAssessmentLabel}</span>
                          </div>
                        </div>
                        
                        {/* Encouraging message */}
                        <div className="bg-gradient-to-br from-btl-50 to-white rounded-lg p-4 border border-btl-200 mt-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-btl-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900 mb-1">Your Progress Journey Starts Here</h4>
                              <p className="text-xs text-gray-600">
                                Your trend will develop as you complete follow-up assessments. Next check-in builds your recovery story.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Multiple assessments - show full trend
                      <div className="space-y-4">
                        {scoreHistory.map((entry, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <span className="text-gray-600">{entry.date}</span>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
                                  style={{ width: `${(entry.score / 11) * 100}%` }}
                                ></div>
                              </div>
                              <span className="font-semibold text-teal-600 w-8">{entry.score}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* Recovery Phases Legend below Progress Trend - vertical, full-width text, pill style, YOU ARE HERE badge */}
                  <div className="flex flex-col items-stretch bg-white rounded-2xl shadow-lg p-7 border border-btl-100 min-h-[340px] min-w-[260px] justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-teal-600" />
                      <h2 className="text-xl font-semibold text-gray-900">Recovery Phases</h2>
                    </div>
                    {(() => {
                      const phase = getPhase(currentScore);
                      return (
                        <>
                          {/* RESET */}
                          <div className={`flex items-start gap-3 mb-4 w-full rounded-xl transition-all duration-200 relative
                            ${phase === 'RESET' ? 'bg-gradient-to-r from-[#155e75] via-[#0891b2] to-[#06b6d4] text-white shadow-lg border-l-8 border-[#06b6d4]' : 'bg-white text-gray-900 border border-gray-200'}
                            p-3
                          `} style={phase === 'RESET' ? { boxShadow: '0 4px 16px rgba(21,94,117,0.10)' } : {}}>
                            <span className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 border-2 ${phase === 'RESET' ? 'bg-white border-[#0891b2]' : 'bg-btl-400 border-btl-400'}`}></span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`font-bold text-base ${phase === 'RESET' ? 'text-white' : 'text-btl-700'}`}>RESET <span className={`font-bold ${phase === 'RESET' ? 'text-white/80' : 'text-black'}`}>Phase</span></span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Focus on rest, recovery, and gentle movement.
                              </p>
                            </div>
                          </div>
                          {/* EDUCATE */}
                          <div className={`flex items-start gap-3 mb-4 w-full rounded-xl transition-all duration-200 relative
                            ${phase === 'EDUCATE' ? 'bg-gradient-to-r from-[#155e75] via-[#0891b2] to-[#06b6d4] text-white shadow-lg border-l-8 border-[#06b6d4]' : 'bg-white text-gray-900 border border-gray-200'}
                            p-3
                          `} style={phase === 'EDUCATE' ? { boxShadow: '0 4px 16px rgba(21,94,117,0.10)' } : {}}>
                            <span className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 border-2 ${phase === 'EDUCATE' ? 'bg-white border-[#0891b2]' : 'bg-btl-400 border-btl-400'}`}></span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`font-bold text-base ${phase === 'EDUCATE' ? 'text-white' : 'text-btl-700'}`}>EDUCATE <span className={`font-bold ${phase === 'EDUCATE' ? 'text-white/80' : 'text-black'}`}>Phase</span></span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Learn about recovery, pain management, and self-care.
                              </p>
                            </div>
                          </div>
                          {/* REBUILD */}
                          <div className={`flex items-start gap-3 mb-4 w-full rounded-xl transition-all duration-200 relative
                            ${phase === 'REBUILD' ? 'bg-gradient-to-r from-[#155e75] via-[#0891b2] to-[#06b6d4] text-white shadow-lg border-l-8 border-[#06b6d4]' : 'bg-white text-gray-900 border border-gray-200'}
                            p-3
                          `} style={phase === 'REBUILD' ? { boxShadow: '0 4px 16px rgba(21,94,117,0.10)' } : {}}>
                            <span className={`w-4 h-4 rounded-full mt-1 flex-shrink-0 border-2 ${phase === 'REBUILD' ? 'bg-white border-[#0891b2]' : 'bg-btl-400 border-btl-400'}`}></span>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`font-bold text-base ${phase === 'REBUILD' ? 'text-white' : 'text-btl-700'}`}>REBUILD <span className={`font-bold ${phase === 'REBUILD' ? 'text-white/80' : 'text-black'}`}>Phase</span></span>
                              </div>
                              <p className="text-xs text-gray-600">
                                Focus on strength building and functional recovery.
                              </p>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
              {/* Score Breakdown as full-width section below the cards */}
              <ScoreBreakdownSection score={currentScore} intakeData={amyIntakeData} />
            </>
          )}
        </div>
      </div>

      {showBreakdown && <ScoreBreakdownModal score={currentScore} onClose={() => setShowBreakdown(false)} />}
    </div>
  )
}