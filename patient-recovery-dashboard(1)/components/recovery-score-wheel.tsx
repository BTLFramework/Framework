"use client"

import { useEffect, useState } from "react"

interface RecoveryScoreWheelProps {
  score: number
  maxScore: number
  phase: "RESET" | "EDUCATE" | "REBUILD"
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
  
  const phaseConfig = {
    RESET: { color: "text-red-600", lightBg: "bg-red-50" },
    EDUCATE: { color: "text-primary", lightBg: "bg-primary/10" },
    REBUILD: { color: "text-accent", lightBg: "bg-accent/10" },
    GRADUATE: { color: "text-purple-600", lightBg: "bg-purple-50" },
  }

  const phaseStyles = phaseConfig[phase]

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64">
        <svg className="w-full h-full" viewBox="0 0 200 200">
          {/* Background Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress Circle */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="currentColor"
            strokeWidth="12"
            fill="none"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transform -rotate-90 origin-center"
          />
          {/* Segment Separators */}
          {[0, 90, 180, 270].map((rotation) => (
            <line
              key={rotation}
              x1="100"
              y1="4"
              x2="100"
              y2="16"
              stroke="white"
              strokeWidth="6"
              transform={`rotate(${rotation} 100 100)`}
            />
          ))}
        </svg>

        {/* Hero Score Display */}
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <span className="font-semibold text-8xl text-gray-800">
            {animatedScore}
          </span>
        </div>
      </div>

      {/* Phase and Score Text */}
      <div className="text-center mt-6">
        <p className="text-gray-500 text-lg">
          You scored <span className="font-bold text-gray-700">{score} out of {maxScore}</span>
        </p>
        <div className={`mt-4 inline-block px-6 py-2 rounded-full text-lg font-bold ${phaseStyles.color} ${phaseStyles.lightBg}`}>
          {phase} Phase
        </div>
      </div>
    </div>
  )
}
