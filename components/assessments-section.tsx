"use client"

import React from "react"
import { Activity, Heart, Target, Calendar, ArrowRight, Clock, CheckCircle, AlertTriangle, FileText, Bell, CalendarDays } from "lucide-react"
import { processIntakeForm, simulateDualPortalSubmission } from "../helpers/assessmentProcessor"

interface AssessmentsSectionProps {
  onAssessmentClick: (assessment: any) => void
}

export function AssessmentsSection({ onAssessmentClick }: AssessmentsSectionProps) {
  // Sample initial intake form data (baseline)
  const initialIntakeData = {
    patientName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    date: "2024-01-15",
    formType: "Intake",
    region: "Neck",
    ndi: [2, 1, 2, 1, 3, 2, 1, 2, 2, 1], // NDI scores (0-5 each, total 18/50 = 36%)
    vas: 6, // Pain level
    psfs: [
      { activity: "Computer work", score: 3 },
      { activity: "Driving", score: 4 },
      { activity: "Sleeping", score: 2 }
    ],
    beliefs: [
      "I'm worried this pain will never go away",
      "I think I've damaged something serious"
    ],
    confidence: 4,
    disabilityPercentage: 36
  };

  // Sample follow-up data (showing improvement)
  const followUpData = {
    patientName: "Sarah Johnson", 
    email: "sarah.johnson@email.com",
    date: "2024-02-12",
    formType: "Follow-Up",
    region: "Neck",
    ndi: [1, 0, 1, 0, 2, 1, 0, 1, 1, 0], // Improved NDI scores (7/50 = 14%)
    vas: 3, // Reduced pain (6 to 3 = 3 point reduction ≥ 2, scores +1)
    psfs: [
      { activity: "Computer work", score: 7 }, // Improved +4
      { activity: "Driving", score: 8 }, // Improved +4  
      { activity: "Sleeping", score: 6 } // Improved +4
    ], // Total improvement = 12 points (≥ 4, scores +2)
    beliefs: ["None of these apply"], // Beliefs resolved (+1 point)
    confidence: 8, // Improved from 4 to 8 (+4, ≥ 3, scores +2)
    groc: 6, // GROC +6 (≥ +5, scores +1)
    disabilityPercentage: 14, // 22% improvement (≥ 10%, scores +1)
    clinicalProgressVerified: true // Clinician verified (+1 point)
    // Total SRS: 1+2+1+2+1+1+1 = 9/11 (REBUILD phase)
  };

  // Process both assessments
  const { patientPortalData: baselineData } = simulateDualPortalSubmission(initialIntakeData);
  const { patientPortalData: followUpDataProcessed, clinicianPortalData } = simulateDualPortalSubmission(followUpData, {
    scores: baselineData.scores,
    formData: baselineData.formData
  });

  const assessments = [
    {
      id: "initial-intake",
      title: "Initial Intake Form",
      date: baselineData.assessmentDate,
      status: "completed",
      statusIcon: CheckCircle,
      statusColor: "text-emerald-600 bg-emerald-100 border-emerald-200",
      scores: baselineData.scores,
      formData: baselineData.formData,
      phaseInfo: baselineData.phaseInfo,
      insights: baselineData.insights,
      isBaseline: true,
      actionButton: null,
    },
    {
      id: "4-week-reassessment",
      title: "4 Week Reassessment",
      date: followUpDataProcessed.assessmentDate,
      status: "completed", 
      statusIcon: CheckCircle,
      statusColor: "text-emerald-600 bg-emerald-100 border-emerald-200",
      scores: followUpDataProcessed.scores,
      formData: followUpDataProcessed.formData,
      phaseInfo: followUpDataProcessed.phaseInfo,
      insights: followUpDataProcessed.insights,
      isBaseline: false,
      clinicalFlags: clinicianPortalData.clinicalFlags,
      actionButton: null,
    },
    {
      id: "8-week-reassessment",
      title: "8 Week Check-In",
      date: "March 12, 2024",
      status: "due",
      statusIcon: Bell,
      statusColor: "text-orange-600 bg-orange-100 border-orange-200",
      scores: null,
      actionButton: "Start Assessment",
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

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "RESET":
        return "text-cyan-600 bg-cyan-100"
      case "EDUCATE": 
        return "text-blue-600 bg-blue-100"
      case "REBUILD":
        return "text-purple-600 bg-purple-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">Assessments</h2>
        <div className="text-sm text-muted-foreground">
          Track your recovery progress
        </div>
      </div>

      <div className="space-y-4">
        {assessments.map((assessment, index) => (
          <div
            key={assessment.id}
            className={`rounded-xl border transition-all duration-200 ${
              assessment.status === 'due' ? 'bg-primary/5 border-primary/20 cursor-pointer hover:bg-primary/10' :
              assessment.status === 'completed' ? 'bg-background cursor-pointer hover:bg-secondary/50' : 'bg-background'
            }`}
            onClick={() => (assessment.status === 'due' || assessment.status === 'completed') ? onAssessmentClick(assessment) : null}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-xl shadow-md ${assessment.statusColor}`}>
                    {getStatusIcon(assessment.status)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-foreground">
                        {assessment.title}
                      </h3>
                      {assessment.isBaseline && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Baseline
                        </span>
                      )}
                      {assessment.clinicalFlags?.requiresReview && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                          Clinical Review
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{assessment.date}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${assessment.statusColor}`}>
                    {assessment.status === 'completed' ? 'Completed' :
                     assessment.status === 'due' ? 'Due' : 'Upcoming'}
                  </span>
                  {(assessment.status === 'due' || assessment.status === 'completed') && (
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>

              {assessment.scores && (
                <div className="mt-4 grid grid-cols-4 gap-4">
                  <div className="text-center">
                    <span className="text-primary font-bold text-lg">{assessment.scores.srs}</span>
                    <p className="text-xs text-muted-foreground">SRS Score</p>
                  </div>
                  <div className="text-center">
                    <span className="text-primary font-bold text-lg">{assessment.scores.disabilityIndex}</span>
                    <p className="text-xs text-muted-foreground">Disability</p>
                  </div>
                  <div className="text-center">
                    <span className="text-primary font-bold text-lg">{assessment.scores.vas}/10</span>
                    <p className="text-xs text-muted-foreground">Pain Level</p>
                  </div>
                  <div className="text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getPhaseColor(assessment.scores.phase)}`}>
                      {assessment.scores.phase}
                    </span>
                  </div>
                </div>
              )}

              {assessment.actionButton && (
                <div className="mt-4 flex justify-end">
                  <button className="btn-primary-gradient px-4 py-2 rounded-lg text-white font-medium text-sm">
                    {assessment.actionButton}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-primary/5 to-accent/5 rounded-xl p-6 border border-primary/10">
        <div className="flex items-start space-x-4">
          <div className="p-2 rounded-lg bg-primary/10">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Assessment Scoring System</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>• <strong>Initial Intake:</strong> Establishes your baseline (0/11 points)</p>
              <p>• <strong>Follow-ups:</strong> Measure improvement from baseline (0-11 points)</p>
              <p>• <strong>RESET:</strong> 0-3 points • <strong>EDUCATE:</strong> 4-6 points • <strong>REBUILD:</strong> 7-11 points</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 