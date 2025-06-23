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

  const percentage = (animatedScore / maxScore) * 100
  const circumference = 2 * Math.PI * 90
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

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
    if (score >= 9) return { text: "Graduation Ready!", color: "text-emerald-600" }
    if (score >= 7) return { text: "REBUILD Ready", color: "text-btl-600" }
    if (score >= 4) return { text: "Making Progress", color: "text-btl-500" }
    return { text: "Getting Started", color: "text-charcoal-600" }
  }

  const status = getScoreStatus()

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
            strokeDashoffset={strokeDashoffset}
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
          <div className="text-4xl font-bold text-charcoal-900 mb-1">{animatedScore}</div>
          <div className="text-lg text-charcoal-600 mb-2">/ {maxScore}</div>
          <div className={`text-sm font-medium ${status.color}`}>{status.text}</div>
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
          
          {/* Phase Progress Dots */}
          <div className="flex justify-center items-center mt-4 space-x-2">
            <div className={`w-2 h-2 rounded-full ${phase === "RESET" ? "bg-btl-600" : "bg-charcoal-300"}`}></div>
            <div className={`w-2 h-2 rounded-full ${phase === "EDUCATE" ? "bg-btl-600" : "bg-charcoal-300"}`}></div>
            <div className={`w-2 h-2 rounded-full ${phase === "REBUILD" ? "bg-btl-600" : "bg-charcoal-300"}`}></div>
          </div>
        </div>
      </div>

      {/* Clean Progress Indicator */}
      <div className="flex items-center justify-center w-full max-w-xs mt-4 space-x-2">
        <span className="text-xs text-charcoal-500">0</span>
        <div className="flex-1 h-2 bg-charcoal-200 rounded-full overflow-hidden">
          <div 
            className="h-full back-to-life-gradient rounded-full transition-all duration-1000 ease-out"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-charcoal-500">11</span>
      </div>
    </div>
  )
}
