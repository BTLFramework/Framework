"use client"

import { Activity, Heart, Target, Calendar, ArrowRight, Clock, CheckCircle, AlertTriangle, FileText, Bell, CalendarDays } from "lucide-react"
import { processIntakeForm } from "@/helpers/assessmentProcessor"

interface AssessmentsSectionProps {
  onAssessmentClick: (assessment: any) => void
}

export function AssessmentsSection({ onAssessmentClick }: AssessmentsSectionProps) {
  // Sample form data that would come from the actual intake form
  const sampleFormData = {
    patientInfo: {
      name: "Sarah Johnson",
      age: "34",
      gender: "Female",
      occupation: "Office Manager"
    },
    painRegion: {
      primaryRegion: "Neck",
      secondaryRegions: ["Shoulders", "Upper Back"],
      painPattern: "Constant with flare-ups"
    },
    painScale: {
      currentPain: 6,
      worstPain: 8,
      averagePain: 5,
      painDescription: "Sharp, burning pain that radiates to shoulders"
    },
    dailyActivities: {
      difficultyLevel: "Moderate",
      affectedActivities: ["Driving", "Computer work", "Sleeping"],
      limitations: "Difficulty turning head, trouble sleeping on affected side"
    },
    beliefs: {
      painUnderstanding: "I think it's from poor posture and stress",
      recoveryExpectations: "I hope to return to normal activities without pain",
      concerns: "Worried about long-term damage and chronic pain"
    },
    confidence: {
      confidenceLevel: 7,
      readinessForChange: "Very ready to try new approaches",
      goals: "Return to yoga, improve sleep quality, reduce pain medications"
    }
  };

  // Process the form data automatically
  const processedData = processIntakeForm(sampleFormData);

  const assessments = [
    {
      id: "initial-intake",
      title: "Initial Intake Form",
      date: processedData.assessmentDate,
      status: "completed",
      statusIcon: CheckCircle,
      statusColor: "text-green-600 bg-green-100 border-green-200",
      scores: processedData.scores,
      formData: processedData.formData,
      phaseInfo: processedData.phaseInfo,
      insights: processedData.insights,
      actionButton: null,
    },
    {
      id: "4-week-reassessment",
      title: "4 Week Reassessment",
      date: processedData.followUpDate,
      status: "due",
      statusIcon: Bell,
      statusColor: "text-orange-600 bg-orange-100 border-orange-200",
      scores: null,
      actionButton: "Start Follow-Up Form",
    },
    {
      id: "8-week-reassessment",
      title: "8 Week Check-In",
      date: "August 1",
      status: "upcoming",
      statusIcon: CalendarDays,
      statusColor: "text-muted-foreground bg-secondary border-border",
      scores: null,
      actionButton: null,
    },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4" />
      case "due":
        return <Bell className="w-4 h-4" />
      case "upcoming":
        return <CalendarDays className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  return (
    <div className="bg-card rounded-xl shadow-lg p-6 border border-border hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-foreground">Assessments</h2>
        </div>
        <button className="flex items-center space-x-1 text-primary hover:text-accent text-sm font-medium hover:bg-primary/5 px-3 py-1 rounded-lg transition-all duration-200">
          <span>View all</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={assessment.id}
            className={`border border-border rounded-xl p-4 transition-all duration-200 hover:shadow-md group ${
              assessment.status === 'due' ? 'bg-primary/5 border-primary/20 cursor-pointer' : 
              assessment.status === 'completed' ? 'bg-background cursor-pointer' : 'bg-background'
            }`}
            onClick={() => (assessment.status === 'due' || assessment.status === 'completed') ? onAssessmentClick(assessment) : null}
          >
            <div className="flex items-start space-x-4">
              <div className={`p-3 rounded-xl shadow-md ${assessment.statusColor}`}>
                {getStatusIcon(assessment.status)}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {assessment.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{assessment.date}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${assessment.statusColor}`}>
                      {assessment.status === 'completed' ? 'Completed' : 
                       assessment.status === 'due' ? 'Due' : 'Upcoming'}
                    </span>
                    {(assessment.status === 'due' || assessment.status === 'completed') && (
                      <ArrowRight className="w-4 h-4 text-primary group-hover:text-accent transition-colors" />
                    )}
                  </div>
                </div>

                {assessment.scores && (
                  <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/20">
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-primary font-medium">SRS: {assessment.scores.srs}</span>
                      <span className="text-primary font-medium">NDI: {assessment.scores.ndi}</span>
                      <span className="text-primary font-medium">Phase: {assessment.scores.phase}</span>
                    </div>
                  </div>
                )}

                {assessment.actionButton && (
                  <div className="mt-3">
                    <button className="bg-gradient-to-r from-primary to-accent text-white px-4 py-2 rounded-lg font-medium hover:from-accent hover:to-primary transition-all duration-200 shadow-md hover:shadow-lg">
                      {assessment.actionButton}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

