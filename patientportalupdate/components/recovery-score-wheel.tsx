"use client"

import { useEffect, useState } from "react"

interface RecoveryScoreWheelProps {
  score: number
  maxScore: number
  phase: string
}

export function RecoveryScoreWheel({ score, maxScore, phase }: RecoveryScoreWheelProps) {
  const [animatedScore, setAnimatedScore] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score)
    }, 500)
    return () => clearTimeout(timer)
  }, [score])

  // Ensure we have valid numeric values
  const validScore = typeof animatedScore === 'number' && !isNaN(animatedScore) ? animatedScore : 0
  const validMaxScore = typeof maxScore === 'number' && !isNaN(maxScore) && maxScore > 0 ? maxScore : 11
  
  const percentage = (validScore / validMaxScore) * 100
  const circumference = 2 * Math.PI * 90
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference
  
  // Ensure strokeDashoffset is a valid number
  const validStrokeDashoffset = typeof strokeDashoffset === 'number' && !isNaN(strokeDashoffset) 
    ? strokeDashoffset 
    : circumference

  const getPhaseColor = (currentPhase: string, targetPhase: string) => {
    const phases = ["RESET", "EDUCATE", "REBUILD"]
    const currentIndex = phases.indexOf(currentPhase)
    const targetIndex = phases.indexOf(targetPhase)

    if (targetIndex <= currentIndex) {
      return "text-btl-600"
    }
    return "text-charcoal-400"
  }

  const getScoreStatus = () => {
    if (validScore >= 9) return { text: "GRADUATION READY!", color: "text-emerald-600" }
    if (validScore >= 7) return { text: "REBUILD READY", color: "text-btl-600" }
    if (validScore >= 4) return { text: "MAKING PROGRESS", color: "text-btl-500" }
    return { text: "ENTERING RESET", color: "text-btl-700" }
  }

  const status = getScoreStatus()
  
  // Ensure percentage is valid for progress bar
  const validPercentage = typeof percentage === 'number' && !isNaN(percentage) ? percentage : 0

  const getPhaseInfo = (currentPhase: string) => {
    const phases = {
      "RESET": { 
        title: "RESET", 
        subtitle: "Calm. Decompress. Stabilize.",
        description: "Evidence-based chiropractic care and targeted decompression techniques restore space for safe, efficient movement.",
        color: "text-btl-700",
        bgColor: "bg-btl-50",
        borderColor: "border-btl-200"
      },
      "EDUCATE": { 
        title: "EDUCATE", 
        subtitle: "Retrain. Rebuild Trust. Restore Confidence.",
        description: "We restore trust in movement by rebuilding strong, sustainable patterns — using education, reinforcement, and graded progression.",
        color: "text-btl-600",
        bgColor: "bg-btl-100",
        borderColor: "border-btl-300"
      },
      "REBUILD": { 
        title: "REBUILD", 
        subtitle: "Strengthen. Sustain. Thrive.",
        description: "Functional integration, strength progression, and resilience training — built to last beyond the clinic.",
        color: "text-btl-800",
        bgColor: "bg-gradient-to-br from-btl-50 to-btl-100",
        borderColor: "border-btl-400"
      }
    }
    return phases[currentPhase as keyof typeof phases] || phases["RESET"]
  }

  const currentPhaseInfo = getPhaseInfo(phase)

  const getPhaseProgressInfo = () => {
    const phases = ["RESET", "EDUCATE", "REBUILD"]
    const currentIndex = phases.indexOf(phase)

    if (currentIndex === 0) {
      // RESET: 0-4 points to complete
      const phaseProgress = Math.min(validScore, 4)
      return {
        label: "RESET COMPLETE",
        min: 0,
        max: 4,
        current: phaseProgress,
        percentage: (phaseProgress / 4) * 100
      }
    } else if (currentIndex === 1) {
      // EDUCATE: 4-7 points to complete (show as 0-3 progress)
      const phaseProgress = Math.min(Math.max(validScore - 4, 0), 3)
      return {
        label: "EDUCATE COMPLETE", 
        min: 0,
        max: 3,
        current: phaseProgress,
        percentage: (phaseProgress / 3) * 100
      }
    } else {
      // REBUILD: 7-11 points to complete (show as 0-4 progress)
      const phaseProgress = Math.min(Math.max(validScore - 7, 0), 4)
      return {
        label: "REBUILD COMPLETE",
        min: 0,
        max: 4,
        current: phaseProgress,
        percentage: (phaseProgress / 4) * 100
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        {/* Background Circle */}
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-charcoal-200"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={validStrokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          {/* Gradient Definition - Exact Logo Match */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#155e75" />
              <stop offset="20%" stopColor="#0891b2" />
              <stop offset="40%" stopColor="#06b6d4" />
              <stop offset="70%" stopColor="#22d3ee" />
              <stop offset="100%" stopColor="#67e8f9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score Display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline justify-center space-x-1 mb-2">
            <div className="text-5xl font-bold text-charcoal-900">{validScore}</div>
            <div className="text-3xl text-charcoal-600">/ {validMaxScore}</div>
          </div>
          <div className={`text-base font-bold ${status.color} mb-3`}>{status.text}</div>
        </div>
      </div>

      {/* Phase Milestone Progress Bar - Below Wheel */}
      <div className="flex flex-col items-center mt-4 w-full max-w-xs">
        {/* Phase Milestone Label */}
        <div className="text-xs text-charcoal-500 mb-2 text-center uppercase tracking-wide">
          {getPhaseProgressInfo().label}
        </div>
        
        {/* Progress Bar */}
        <div className="flex items-center justify-center w-full space-x-2">
          <span className="text-xs text-charcoal-400">{getPhaseProgressInfo().min}</span>
          <div className="flex-1 h-2 bg-charcoal-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-btl-500 to-btl-600 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${getPhaseProgressInfo().percentage}%`,
                transitionDelay: '0.5s'
              }}
            />
          </div>
          <span className="text-xs text-charcoal-400">{getPhaseProgressInfo().max}</span>
        </div>
        
        {/* Progress Text */}
        <div className="text-xs text-charcoal-500 mt-2 text-center">
          {getPhaseProgressInfo().current} of {getPhaseProgressInfo().max} points
        </div>
      </div>

      {/* Current Phase Display */}
      <div className="mt-6 w-full max-w-sm">
        <div className={`p-4 rounded-xl border-2 ${currentPhaseInfo.borderColor} ${currentPhaseInfo.bgColor} shadow-lg`}>
          <div className="text-center mb-3">
            <h3 className={`text-xl font-bold ${currentPhaseInfo.color} tracking-wide`}>
              {currentPhaseInfo.title}
            </h3>
            <p className="text-charcoal-500 text-xs font-medium uppercase tracking-wider mt-1">
              {currentPhaseInfo.subtitle}
            </p>
          </div>
          <p className="text-charcoal-600 text-sm leading-relaxed text-center">
            {currentPhaseInfo.description}
          </p>
          
          {/* Removed Phase Progress Dots for cleaner design */}
        </div>
      </div>

      {/* Removed external progress bar - now integrated inside the wheel */}
    </div>
  )
}
