"use client"

import { useState } from "react"
import { ArrowLeft, TrendingUp, Award, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { RecoveryScoreWheel } from "@/components/recovery-score-wheel"
import { ScoreBreakdownModal } from "@/components/score-breakdown-modal"

export default function RecoveryScorePage() {
  const router = useRouter()
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [currentScore] = useState(7)

  const scoreHistory = [
    { date: "Dec 1", score: 3 },
    { date: "Dec 8", score: 5 },
    { date: "Dec 15", score: 7 },
    { date: "Dec 22", score: 7 },
  ]

  const milestones = [
    { score: 4, title: "Foundation Built", description: "Basic recovery habits established", achieved: true },
    { score: 7, title: "REBUILD Ready", description: "Ready for strength building phase", achieved: true },
    { score: 9, title: "Graduation Ready", description: "Independent recovery management", achieved: false },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recovery Score Details</h1>
            <p className="text-gray-600">Track your personalized recovery progress</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Current Score */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Current Score</h2>
                <button
                  onClick={() => setShowBreakdown(true)}
                  className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium hover:bg-teal-50 px-3 py-1 rounded-lg transition-all duration-200"
                >
                  <Info className="w-4 h-4" />
                  <span>View Breakdown</span>
                </button>
              </div>
              <RecoveryScoreWheel score={currentScore} maxScore={11} phase="REBUILD" />
            </div>

            {/* Score Trend */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h2 className="text-xl font-semibold text-gray-900">Progress Trend</h2>
              </div>
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
            </div>
          </div>

          {/* Recovery Milestones */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center space-x-2 mb-6">
              <Award className="w-5 h-5 text-teal-600" />
              <h2 className="text-xl font-semibold text-gray-900">Recovery Milestones</h2>
            </div>
            <div className="space-y-4">
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    milestone.achieved ? "border-emerald-200 bg-emerald-50" : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className={`font-semibold ${milestone.achieved ? "text-emerald-900" : "text-gray-700"}`}>
                        Score {milestone.score}: {milestone.title}
                      </h3>
                      <p className={`text-sm ${milestone.achieved ? "text-emerald-700" : "text-gray-600"}`}>
                        {milestone.description}
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.achieved ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      {milestone.achieved && <Award className="w-4 h-4 text-white" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {showBreakdown && <ScoreBreakdownModal score={currentScore} onClose={() => setShowBreakdown(false)} />}
    </div>
  )
}
