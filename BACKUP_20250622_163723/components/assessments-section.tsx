"use client"

import { Activity, Heart, Target, Calendar, ArrowRight, Clock, CheckCircle, AlertTriangle } from "lucide-react"

interface AssessmentsSectionProps {
  onAssessmentClick: (assessment: any) => void
}

export function AssessmentsSection({ onAssessmentClick }: AssessmentsSectionProps) {
  const assessments = [
    {
      title: "Pain and Disability Index (PDI)",
      description: "Measures impact of pain on daily activities",
      icon: Activity,
      status: "Pending",
      statusColor: "text-btl-600 bg-btl-100 border-btl-200",
      statusIcon: Clock,
      timeInfo: "5-7 minutes • Due today",
      points: 3,
    },
    {
      title: "Oswestry Disability Index",
      description: "Evaluates back pain-related disability",
      icon: Heart,
      status: "Completed",
      statusColor: "text-btl-700 bg-btl-50 border-btl-200",
      statusIcon: CheckCircle,
      timeInfo: "Completed 2 days ago",
      points: 3,
    },
    {
      title: "Roland Morris Disability Questionnaire",
      description: "Evaluates back pain-related disability",
      icon: Target,
      status: "Overdue",
      statusColor: "text-btl-800 bg-btl-100 border-btl-300",
      statusIcon: AlertTriangle,
      timeInfo: "Past due by 1 day",
      points: 3,
    },
  ]

  return (
    <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 hover:card-hover-gradient hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Your Assessments</h2>
        <button className="flex items-center space-x-1 text-btl-600 hover:text-btl-700 text-sm font-medium hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200">
          <Calendar className="w-4 h-4" />
          <span>Schedule All</span>
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={index}
            className="border border-btl-200 rounded-xl p-4 hover:border-btl-300 cursor-pointer transition-all duration-200 hover:shadow-md group hover:bg-btl-50"
            onClick={() => onAssessmentClick(assessment)}
          >
            <div className="flex items-start space-x-4">
              <div className="bg-gradient-to-br from-btl-100 to-btl-200 p-3 rounded-xl shadow-md">
                <assessment.icon className="w-5 h-5 text-btl-600" />
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-charcoal-900 group-hover:text-btl-700 transition-colors">
                    {assessment.title}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${assessment.statusColor}`}>
                      {assessment.status}
                    </span>
                    <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-btl-600 transition-colors" />
                  </div>
                </div>
                <p className="text-charcoal-600 text-sm mb-2">{assessment.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-xs text-charcoal-500">
                    <assessment.statusIcon className="w-3 h-3" />
                    <span>{assessment.timeInfo}</span>
                  </div>
                  <span className="text-xs font-semibold text-btl-600 bg-btl-100 px-2 py-1 rounded-full">
                    +{assessment.points} pts
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
