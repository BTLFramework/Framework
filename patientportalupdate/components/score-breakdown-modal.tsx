"use client"

import { useState, useEffect } from "react"
import { X, CheckCircle, XCircle, Info } from "lucide-react"

interface ScoreBreakdownModalProps {
  score: number
  onClose: () => void
}

interface BreakdownItem {
  description: string
  points: number
  achieved: boolean
  details: string
}

interface ScoreResult {
  score: number
  breakdown: BreakdownItem[]
}

// SRS Configuration - matches backend logic
const intakeRules = {
  pain: {
    threshold: 2,
    points: 1,
    description: "Pain (VAS ≤2)"
  },
  disability: {
    threshold: 20,
    points: 1,
    description: "Disability (≤20%)"
  },
  function: {
    excellent: { threshold: 7, points: 2 },
    good: { threshold: 4, points: 1 },
    description: "Task Function (PSFS)"
  },
  confidence: {
    high: { threshold: 8, points: 2 },
    moderate: { threshold: 5, points: 1 },
    description: "Confidence"
  },
  beliefs: {
    points: 1,
    description: "No negative beliefs"
  },
  clinician: {
    milestone: { points: 1, description: "Recovery Milestone Met" },
    progress: { points: 1, description: "Objective Progress" }
  }
}

const calculateRealSRS = (formData: any): ScoreResult => {
  let points = 0
  const breakdown: BreakdownItem[] = []

  if (!formData) {
    return { score: 0, breakdown: [{ description: "No intake data available", points: 0, achieved: false, details: "Please complete intake form" }] }
  }

  // 1. Pain Assessment
  const vas = parseInt(formData.vas) || 0
  if (vas <= intakeRules.pain.threshold) {
    points += intakeRules.pain.points
    breakdown.push({
      description: intakeRules.pain.description,
      points: intakeRules.pain.points,
      achieved: true,
      details: `VAS Pain Score: ${vas}/10`
    })
  } else {
    breakdown.push({
      description: intakeRules.pain.description,
      points: 0,
      achieved: false,
      details: `VAS Pain Score: ${vas}/10 (needs ≤${intakeRules.pain.threshold})`
    })
  }

  // 2. Disability Assessment
  const disabilityPercentage = formData.disabilityPercentage || 0
  if (disabilityPercentage <= intakeRules.disability.threshold) {
    points += intakeRules.disability.points
    breakdown.push({
      description: intakeRules.disability.description,
      points: intakeRules.disability.points,
      achieved: true,
      details: `Disability Index: ${disabilityPercentage}%`
    })
  } else {
    breakdown.push({
      description: intakeRules.disability.description,
      points: 0,
      achieved: false,
      details: `Disability Index: ${disabilityPercentage}% (needs ≤${intakeRules.disability.threshold}%)`
    })
  }

  // 3. Task Function (PSFS)
  if (formData.psfs && formData.psfs.length > 0) {
    const psfaScores = formData.psfs.map((item: any) => item.score || 0)
    const avgPSFS = psfaScores.reduce((sum: number, score: number) => sum + score, 0) / psfaScores.length
    
    if (avgPSFS >= intakeRules.function.excellent.threshold) {
      points += intakeRules.function.excellent.points
      breakdown.push({
        description: intakeRules.function.description,
        points: intakeRules.function.excellent.points,
        achieved: true,
        details: `Average PSFS: ${avgPSFS.toFixed(1)}/10 (Excellent)`
      })
    } else if (avgPSFS >= intakeRules.function.good.threshold) {
      points += intakeRules.function.good.points
      breakdown.push({
        description: intakeRules.function.description,
        points: intakeRules.function.good.points,
        achieved: true,
        details: `Average PSFS: ${avgPSFS.toFixed(1)}/10 (Good)`
      })
    } else {
      breakdown.push({
        description: intakeRules.function.description,
        points: 0,
        achieved: false,
        details: `Average PSFS: ${avgPSFS.toFixed(1)}/10 (needs ≥${intakeRules.function.good.threshold})`
      })
    }
  } else {
    breakdown.push({
      description: intakeRules.function.description,
      points: 0,
      achieved: false,
      details: "No functional tasks assessed"
    })
  }

  // 4. Confidence Assessment
  const confidence = parseInt(formData.confidence) || 0
  if (confidence >= intakeRules.confidence.high.threshold) {
    points += intakeRules.confidence.high.points
    breakdown.push({
      description: intakeRules.confidence.description,
      points: intakeRules.confidence.high.points,
      achieved: true,
      details: `Confidence: ${confidence}/10 (High)`
    })
  } else if (confidence >= intakeRules.confidence.moderate.threshold) {
    points += intakeRules.confidence.moderate.points
    breakdown.push({
      description: intakeRules.confidence.description,
      points: intakeRules.confidence.moderate.points,
      achieved: true,
      details: `Confidence: ${confidence}/10 (Moderate)`
    })
  } else {
    breakdown.push({
      description: intakeRules.confidence.description,
      points: 0,
      achieved: false,
      details: `Confidence: ${confidence}/10 (needs ≥${intakeRules.confidence.moderate.threshold})`
    })
  }

  // 5. Belief Assessment
  const beliefs = Array.isArray(formData.beliefs) ? formData.beliefs : []
  const hasNegativeBeliefs = beliefs.some((belief: string) => 
    belief && belief.trim() !== "" && belief !== "None of these apply"
  )
  
  if (!hasNegativeBeliefs || beliefs.length === 0) {
    points += intakeRules.beliefs.points
    breakdown.push({
      description: intakeRules.beliefs.description,
      points: intakeRules.beliefs.points,
      achieved: true,
      details: "No limiting beliefs identified"
    })
  } else {
    breakdown.push({
      description: intakeRules.beliefs.description,
      points: 0,
      achieved: false,
      details: `${beliefs.length} limiting belief(s) identified`
    })
  }

  // 6. Clinician Assessments (typically 0 for initial intake)
  breakdown.push({
    description: intakeRules.clinician.milestone.description,
    points: 0,
    achieved: false,
    details: "Assessed during clinical visits"
  })

  breakdown.push({
    description: intakeRules.clinician.progress.description,
    points: 0,
    achieved: false,
    details: "Verified by clinician during treatment"
  })

  return { score: points, breakdown }
}

export function ScoreBreakdownModal({ score, onClose }: ScoreBreakdownModalProps) {
  const [intakeData, setIntakeData] = useState<any>(null)
  const [calculatedScore, setCalculatedScore] = useState({ score: 0, breakdown: [] })

  useEffect(() => {
    // Load intake form data from localStorage
    try {
      const storedIntake = localStorage.getItem('btl_intake_data')
      if (storedIntake) {
        const data = JSON.parse(storedIntake)
        console.log('📊 Loaded intake data for score breakdown:', data)
        setIntakeData(data)
        
        // Calculate real SRS based on intake data
        const realScore = calculateRealSRS(data)
        setCalculatedScore(realScore)
      } else {
        console.log('ℹ️ No intake data found in localStorage')
        setCalculatedScore({
          score: 0,
          breakdown: [{
            description: "Complete intake assessment",
            points: 0,
            achieved: false,
            details: "No intake data available"
          }]
        })
      }
    } catch (error) {
      console.error('❌ Error loading intake data:', error)
    }
  }, [])

  const getPhase = (score: number) => {
    if (score <= 3) return "RESET"
    if (score <= 7) return "EDUCATE"
    return "REBUILD"
  }

  const currentPhase = getPhase(calculatedScore.score)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-btl-600 to-btl-700 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Recovery Score Breakdown</h2>
              <p className="text-btl-100 text-sm">Based on your intake assessment</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-btl-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          
          {/* Score Summary */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold">{calculatedScore.score}/11</div>
              <div className="text-btl-100">
                <div className="text-sm">Current Phase</div>
                <div className="font-semibold">{currentPhase}</div>
              </div>
            </div>
            <div className="text-right text-sm text-btl-100">
              <div>Baseline Score</div>
              <div>(0-9 baseline, 0-11 follow-up)</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">About Your Score</p>
                  <p>This is your baseline score from intake assessment. Scores increase with follow-up assessments as you progress through treatment.</p>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Score Components</h3>
            
            {calculatedScore.breakdown.map((item: any, index: number) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-2 ${
                  item.achieved 
                    ? "bg-green-50 border-green-200" 
                    : "bg-gray-50 border-gray-200"
                }`}
              >
                  <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      item.achieved ? "bg-green-600" : "bg-gray-400"
                    }`}>
                      {item.achieved ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.description}</h4>
                      <p className="text-sm text-gray-600">{item.details}</p>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                    item.achieved 
                      ? "bg-green-600 text-white" 
                      : "bg-gray-300 text-gray-600"
                  }`}>
                    +{item.points} pt{item.points !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Phase Information */}
          <div className="mt-6 p-4 bg-btl-50 border border-btl-200 rounded-lg">
            <h4 className="font-semibold text-btl-800 mb-2">Your Current Phase: {currentPhase}</h4>
            <p className="text-sm text-btl-700">
              {currentPhase === "RESET" && "Focus on education, pain understanding, and establishing baseline function."}
              {currentPhase === "EDUCATE" && "Progressive strengthening, movement retraining, and confidence building."}
              {currentPhase === "REBUILD" && "Advanced recovery strategies and return-to-activity planning."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
