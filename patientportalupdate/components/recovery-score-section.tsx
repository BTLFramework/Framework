"use client"

interface RecoveryScoreSectionProps {
  score: number
  onViewBreakdown: () => void
}

export function RecoveryScoreSection({ score, onViewBreakdown }: RecoveryScoreSectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="text-center">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Signature Recovery Score™</h2>

        <div className="mb-6">
          <div className="text-5xl font-bold text-blue-600 mb-2">{score}/11</div>
          <div className="w-24 h-1 bg-blue-600 rounded-full mx-auto"></div>
        </div>

        <button onClick={onViewBreakdown} className="text-blue-600 hover:text-blue-700 font-medium text-sm">
          View Breakdown
        </button>
      </div>
    </div>
  )
}
