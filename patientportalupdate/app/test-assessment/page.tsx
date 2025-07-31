"use client"

import React, { useState, useEffect } from "react"
import { AssessmentsSection } from "@/components/assessments-section"
import { AssessmentModal } from "@/components/assessment-modal"

export default function TestAssessmentPage() {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold gradient-text mb-8">Assessment Section Test</h1>
        
        <AssessmentsSection onAssessmentClick={setSelectedAssessment} />
        
        {selectedAssessment && (
          <AssessmentModal 
            assessment={selectedAssessment} 
            onClose={() => setSelectedAssessment(null)} 
          />
        )}
      </div>
    </div>
  )
} 