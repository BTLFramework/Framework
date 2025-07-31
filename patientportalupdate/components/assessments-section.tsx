"use client"

import { useState, useEffect } from "react"
import { FileText, Clock, CheckCircle, AlertTriangle, Calendar, Eye, ArrowRight } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

interface AssessmentsSectionProps {
  onAssessmentClick: (assessment: any) => void
}

interface IntakeForm {
  id: string
  title: string
  description: string
  status: "completed" | "due" | "upcoming"
  date: string
  dueDate?: string
  completedDate?: string
  formData?: any
  actionButton?: string | null
  isHighlighted?: boolean
}

export function AssessmentsSection({ onAssessmentClick }: AssessmentsSectionProps) {
  // Component mounted
  const { patient, isAuthenticated } = useAuth()
  const [intakeForms, setIntakeForms] = useState<IntakeForm[]>([])
  const [loading, setLoading] = useState(true)
  // DEV: Allow override of intake date for testing
  const [devIntakeDate, setDevIntakeDate] = useState<string>("");
  let effectiveIntakeDate: Date | undefined = undefined;

  // Calculate dates based on intake date
  const calculateIntakeDates = (intakeDate: Date) => {
    const fourWeekDate = new Date(intakeDate)
    fourWeekDate.setDate(fourWeekDate.getDate() + 28) // 4 weeks = 28 days
    
    const eightWeekDate = new Date(intakeDate)
    eightWeekDate.setDate(eightWeekDate.getDate() + 56) // 8 weeks = 56 days
    
    return { fourWeekDate, eightWeekDate }
  }

  // Format date helper
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  // Get status info based on completion status
  const getStatusInfo = (status: string, date: string, dueDate?: string) => {
    switch (status) {
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-emerald-600 bg-emerald-100 border-emerald-200",
          timeInfo: `Completed ${formatDate(new Date(date))}`
        }
      case "due":
        return {
          icon: AlertTriangle,
          color: "text-orange-600 bg-orange-100 border-orange-200",
          timeInfo: `Due ${formatDate(new Date(dueDate || date))}`
        }
      case "upcoming":
        return {
          icon: Calendar,
          color: "text-blue-600 bg-blue-100 border-blue-200",
          timeInfo: `Due ${formatDate(new Date(dueDate || date))}`
        }
      default:
        return {
          icon: Clock,
          color: "text-gray-600 bg-gray-100 border-gray-200",
          timeInfo: "Pending"
        }
    }
  }

  // Load patient intake data from backend
  const loadIntakeData = async () => {
    try {
      setLoading(true)
      
      // Use authenticated patient data
      if (!isAuthenticated || !patient?.email) {
        // No authenticated patient available
        setLoading(false)
        return
      }
      
      const patientEmail = patient.email
      // Loading data for authenticated patient
      
      // DEV: Use override intake date if set
      if (devIntakeDate) {
        effectiveIntakeDate = new Date(devIntakeDate)
      }
      
      // Fetch real patient data from backend
      const response = await fetch(`/api/patients/portal-data/${encodeURIComponent(patientEmail)}`)
      
      if (!response.ok) {
                  console.error('Failed to fetch patient data, status:', response.status)
        throw new Error('Failed to fetch patient data')
      }
      
      const result = await response.json()
              // Portal data fetched successfully
      
      if (result.success && result.data) {
        // Get patient's intake date and SRS scores
        const patientData = result.data.patient
        
        // Use the actual intake date from the patient data
        const intakeDate = effectiveIntakeDate || new Date(patientData.intakeDate || patientData.createdAt || '2024-01-01')
        
        // Fetch all SRS scores for this patient to determine completion status
        const srsResponse = await fetch(`/api/patients/${patientData.id}/srs-scores`)
        let srsScores = []
        
        if (srsResponse.ok) {
          const srsResult = await srsResponse.json()
          srsScores = srsResult.data || []
        }
        
        // SRS scores for patient
        const hasInitialIntake = srsScores.some((score: any) => score.formType === 'Intake' || score.formType === 'Initial')
        const hasFourWeekFollowup = srsScores.some((score: any) => score.formType === '4-Week Follow-up')
        const hasEightWeekFollowup = srsScores.some((score: any) => score.formType === '8-Week Follow-up')
        // Assessment completion status
        
        // Calculate due dates based on intake date
        const { fourWeekDate, eightWeekDate } = calculateIntakeDates(intakeDate)
        const today = new Date()
        
        // Determine completion status based on real SRS scores
        const initialCompleted = hasInitialIntake
        const fourWeekCompleted = hasFourWeekFollowup
        const eightWeekCompleted = hasEightWeekFollowup
        const fourWeekOverdue = !fourWeekCompleted && today > fourWeekDate
        const eightWeekOverdue = !eightWeekCompleted && today > eightWeekDate
        
        // Get the actual form data from SRS scores
        const getFormData = (formType: string) => {
          const score = srsScores.find((s: any) => s.formType === formType)
          if (!score) return undefined
          
          return {
            patientName: patientData.name,
            region: score.region,
            vas: score.vas,
            confidence: score.confidence,
            disabilityPercentage: score.disabilityPercentage,
            psfs: score.psfs || [],
            beliefs: score.beliefs || [],
            srsScore: score.srsScore,
            groc: score.groc || 0,
            pcs4: score.pcs4 || null,
            tsk7: score.tsk7 || null
          }
        }
        
        const forms: IntakeForm[] = [
          {
            id: "initial-intake",
            title: "Initial Intake Form",
            description: "Your first assessment to establish your SRS (Signature Recovery Score).",
            status: initialCompleted ? "completed" : "due",
            date: formatDate(intakeDate),
            completedDate: initialCompleted ? formatDate(intakeDate) : undefined,
            formData: getFormData('Intake') || getFormData('Initial'),
            actionButton: initialCompleted ? "View Results" : "Complete Form",
            isHighlighted: !initialCompleted
          },
          {
            id: "4-week-followup",
            title: "4 Week Follow-up Intake",
            description: "Progress assessment to track your recovery journey",
            status: fourWeekCompleted ? "completed" : fourWeekOverdue ? "due" : "upcoming",
            date: formatDate(fourWeekDate),
            dueDate: formatDate(fourWeekDate),
            completedDate: fourWeekCompleted ? formatDate(fourWeekDate) : undefined,
            formData: getFormData('4-Week Follow-up'),
            actionButton: fourWeekCompleted ? "View Results" : "Start Assessment",
            isHighlighted: fourWeekOverdue
          },
          {
            id: "8-week-followup",
            title: "8 Week Follow-up Intake",
            description: "Final assessment to evaluate long-term progress",
            status: eightWeekCompleted ? "completed" : eightWeekOverdue ? "due" : "upcoming",
            date: formatDate(eightWeekDate),
            dueDate: formatDate(eightWeekDate),
            completedDate: eightWeekCompleted ? formatDate(eightWeekDate) : undefined,
            formData: getFormData('8-Week Follow-up'),
            actionButton: eightWeekCompleted ? "View Results" : "Start Assessment",
            isHighlighted: eightWeekOverdue
          }
        ]
        
        setIntakeForms(forms)
      } else {
        throw new Error('Invalid patient data response')
      }
    } catch (error) {
      console.error('Error in loadIntakeData:', error)
      // Keep existing forms on error instead of using demo data
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // useEffect triggered
    if (isAuthenticated && patient?.email) {
      loadIntakeData()
    }
  }, [isAuthenticated, patient?.email]) // Run when authentication or patient changes

  // Re-run when devIntakeDate changes
  useEffect(() => {
    if (devIntakeDate && isAuthenticated && patient?.email) {
      // devIntakeDate changed, reloading data
      loadIntakeData()
    }
  }, [devIntakeDate, isAuthenticated, patient?.email])

  if (loading) {
    return (
      <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold gradient-text">Your Intake Forms</h2>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-btl-200 rounded-xl p-4 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="bg-btl-100 p-3 rounded-xl w-12 h-12"></div>
                <div className="flex-1">
                  <div className="h-4 bg-btl-100 rounded mb-2"></div>
                  <div className="h-3 bg-btl-50 rounded mb-2"></div>
                  <div className="h-3 bg-btl-50 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 hover:card-hover-gradient hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Your Intake Forms</h2>
        <button className="flex items-center space-x-1 text-btl-600 hover:text-btl-700 text-sm font-medium hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200">
          <Calendar className="w-4 h-4" />
          <span>View All</span>
        </button>
      </div>
      {/* DEV: Intake date override for testing */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mb-4 flex items-center space-x-2">
          <label htmlFor="dev-intake-date" className="text-xs text-btl-600 font-semibold">Override Intake Date:</label>
          <input
            id="dev-intake-date"
            type="date"
            value={devIntakeDate}
            onChange={e => setDevIntakeDate(e.target.value)}
            className="border border-btl-200 rounded px-2 py-1 text-xs"
          />
        </div>
      )}
      <div className="space-y-4">
        {intakeForms.map((form, index) => {
          const statusInfo = getStatusInfo(form.status, form.date, form.dueDate)
          const isLocked = form.status === 'upcoming' || (!form.formData && form.status !== 'due')
          const isDue = form.status === 'due' && !form.formData

          // Handler for assessment click
          const handleClick = () => {
            if (form.formData) {
              onAssessmentClick(form)
            } else if (isDue) {
              window.location.href = '/intake';
            }
          }

          return (
            <div
              key={form.id}
              className={`border rounded-xl p-4 transition-all duration-200 group ${
                form.isHighlighted 
                  ? 'border-btl-300 bg-btl-50 shadow-md' 
                  : 'border-btl-200'
              } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-btl-300 hover:bg-btl-50 hover:shadow-md cursor-pointer'}`}
              onClick={isLocked ? undefined : handleClick}
              title={isLocked ? `Available on ${form.dueDate || form.date}` : ''}
            >
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-xl shadow-md bg-gradient-to-br from-btl-100 to-btl-200`}>
                  <FileText className={`w-5 h-5 text-btl-600`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`font-semibold group-hover:text-btl-700 transition-colors ${form.isHighlighted ? 'text-btl-800' : 'text-charcoal-900'}`}>{form.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        form.formData
                          ? 'bg-emerald-100 text-emerald-700 border-emerald-200' // Completed: green
                          : isLocked
                            ? 'bg-btl-50 text-btl-400 border-btl-100' // Locked: grey/blue
                            : 'bg-red-100 text-red-700 border-red-200' // Due: red
                      }`} title={isLocked ? `This form will be available on ${form.dueDate || form.date}` : form.formData ? 'Completed' : 'Due'}>
                        {form.formData ? 'Completed' : isLocked ? 'Locked' : 'Due'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-btl-600 transition-colors" />
                    </div>
                  </div>
                  <p className="text-charcoal-600 text-sm mb-2">{form.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-charcoal-500">
                      <statusInfo.icon className="w-3 h-3" />
                      <span>{isLocked ? `Available on ${form.dueDate || form.date}` : statusInfo.timeInfo}</span>
                    </div>
                    {form.actionButton && form.formData && (
                      <span className="text-xs font-semibold px-3 py-1 rounded-full text-btl-600 bg-btl-100">
                        {form.actionButton}
                      </span>
                    )}
                  </div>
                  {form.isHighlighted && !form.formData && (
                    <div className="mt-2 p-2 bg-btl-100 rounded-lg">
                      <p className="text-xs text-btl-800 font-medium">
                        ⚠️ This form needs your attention
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}