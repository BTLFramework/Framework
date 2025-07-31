"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, FileText, Clock, CheckCircle, AlertTriangle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { AssessmentModal } from "@/components/assessment-modal"
import { useAuth } from "@/hooks/useAuth"

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

export default function AssessmentsPage() {
  const router = useRouter()
  const { patient, loading: authLoading, isAuthenticated } = useAuth()
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("all")
  const [intakeForms, setIntakeForms] = useState<IntakeForm[]>([])
  const [loading, setLoading] = useState(true)
  const [devIntakeDate, setDevIntakeDate] = useState<string>("")

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
          color: "text-btl-800 bg-btl-100 border-btl-400",
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
      
      // Use authenticated patient data instead of localStorage
      if (!patient || !patient.email) {
        // No authenticated patient found
        throw new Error('No authenticated patient')
      }
      
      const patientEmail = patient.email
      // Loading data for authenticated patient
      
      // DEV: Use override intake date if set
      let effectiveIntakeDate: Date | undefined = undefined
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
        
        // Check for different possible form type values
        const hasInitialIntake = srsScores.some((score: any) => 
          score.formType === 'Intake' || 
          score.formType === 'Initial Intake' || 
          score.formType === 'Initial' ||
          score.formType === 'initial'
        )
        const hasFourWeekFollowup = srsScores.some((score: any) => 
          score.formType === '4-Week Follow-up' || 
          score.formType === '4 Week Follow-up' ||
          score.formType === '4-Week' ||
          score.formType === '4 Week'
        )
        const hasEightWeekFollowup = srsScores.some((score: any) => 
          score.formType === '8-Week Follow-up' || 
          score.formType === '8 Week Follow-up' ||
          score.formType === '8-Week' ||
          score.formType === '8 Week'
        )
        // Assessment completion status
        
        // Calculate due dates based on intake date
        const { fourWeekDate, eightWeekDate } = calculateIntakeDates(intakeDate)
        const today = new Date()
        
        // Determine completion status based on real SRS scores
        // If patient can access portal, initial intake must be completed
        const initialCompleted = hasInitialIntake || true // Always true for portal users
        const fourWeekCompleted = hasFourWeekFollowup
        const eightWeekCompleted = hasEightWeekFollowup
        const fourWeekOverdue = !fourWeekCompleted && today > fourWeekDate
        const eightWeekOverdue = !eightWeekCompleted && today > eightWeekDate
        
        // Get the actual form data from SRS scores
        const getFormData = (formType: string) => {
          // getFormData called for formType
          
          let score
          if (formType === 'Intake') {
            score = srsScores.find((s: any) => 
              s.formType === 'Intake' || 
              s.formType === 'Initial Intake' || 
              s.formType === 'Initial' ||
              s.formType === 'initial'
            )
          } else if (formType === '4-Week Follow-up') {
            score = srsScores.find((s: any) => 
              s.formType === '4-Week Follow-up' || 
              s.formType === '4 Week Follow-up' ||
              s.formType === '4-Week' ||
              s.formType === '4 Week'
            )
          } else if (formType === '8-Week Follow-up') {
            score = srsScores.find((s: any) => 
              s.formType === '8-Week Follow-up' || 
              s.formType === '8 Week Follow-up' ||
              s.formType === '8-Week' ||
              s.formType === '8 Week'
            )
          } else {
            score = srsScores.find((s: any) => s.formType === formType)
          }
          
          // Found score for formType
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
            formData: getFormData('Intake'),
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
      
      // Create default forms on error so user always sees something
      const today = new Date()
      const { fourWeekDate, eightWeekDate } = calculateIntakeDates(today)
      
      const defaultForms: IntakeForm[] = [
        {
          id: "initial-intake",
          title: "Initial Intake Form",
          description: "Your first assessment to establish your SRS (Signature Recovery Score).",
          status: "completed",
          date: formatDate(today),
          completedDate: formatDate(today),
          actionButton: "View Results",
          isHighlighted: false
        },
        {
          id: "4-week-followup",
          title: "4 Week Follow-up Intake",
          description: "Progress assessment to track your recovery journey",
          status: "upcoming",
          date: formatDate(fourWeekDate),
          dueDate: formatDate(fourWeekDate),
          actionButton: "Start Assessment",
          isHighlighted: false
        },
        {
          id: "8-week-followup",
          title: "8 Week Follow-up Intake",
          description: "Final assessment to evaluate long-term progress",
          status: "upcoming",
          date: formatDate(eightWeekDate),
          dueDate: formatDate(eightWeekDate),
          actionButton: "Start Assessment",
          isHighlighted: false
        }
      ]
      
      setIntakeForms(defaultForms)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // useEffect triggered
    if (!authLoading && patient) {
      loadIntakeData()
    }
  }, [authLoading, patient]) // Run when auth state changes

  // Re-run when devIntakeDate changes
  useEffect(() => {
    if (devIntakeDate) {
      // devIntakeDate changed, reloading data
      loadIntakeData()
    }
  }, [devIntakeDate])

  const filteredAssessments = intakeForms.filter((assessment) => {
    if (activeTab === "all") return true
    return assessment.status === activeTab
  })

  const tabs = [
    { id: "due", name: "Due", count: intakeForms.filter((a) => a.status === "due").length },
    { id: "completed", name: "Completed", count: intakeForms.filter((a) => a.status === "completed").length },
    { id: "upcoming", name: "Upcoming", count: intakeForms.filter((a) => a.status === "upcoming").length },
    { id: "all", name: "All", count: intakeForms.length },
  ]

  // Show loading state while authenticating or loading data
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 via-white to-btl-100">
        <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white px-6 py-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Intake Forms</h1>
              <p className="text-btl-100 mt-1">Complete forms to track your recovery progress</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="card-gradient rounded-2xl shadow-lg p-8 border border-btl-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
                <p className="text-btl-600">
                  {authLoading ? "Authenticating..." : "Loading your assessments..."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!isAuthenticated || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 via-white to-btl-100">
        <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white px-6 py-6 shadow-lg">
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold">Intake Forms</h1>
              <p className="text-btl-100 mt-1">Complete forms to track your recovery progress</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="max-w-6xl mx-auto">
            <div className="card-gradient rounded-2xl shadow-lg p-8 border border-btl-200">
              <div className="text-center">
                <p className="text-btl-600">Please log in to view your assessments.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 via-white to-btl-100">
      {/* Header with BTL gradient */}
      <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl">
              <FileText className="w-10 h-10 text-white opacity-90" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Intake Forms</h1>
              <p className="text-btl-100 mt-1">Complete forms to track your recovery progress</p>
            </div>
          </div>
          <button 
            onClick={() => router.back()} 
            className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
          >
            <ArrowLeft className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview with BTL styling */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center hover:card-hover-gradient transition-all duration-300">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {intakeForms.filter((a) => a.status === "due").length}
              </div>
              <div className="text-charcoal-600 font-medium">Due</div>
            </div>
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center hover:card-hover-gradient transition-all duration-300">
              <div className="text-3xl font-bold text-btl-600 mb-2">
                {intakeForms.filter((a) => a.status === "completed").length}
              </div>
              <div className="text-charcoal-600 font-medium">Completed</div>
            </div>
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center hover:card-hover-gradient transition-all duration-300">
              <div className="text-3xl font-bold text-charcoal-500 mb-2">
                {intakeForms.filter((a) => a.status === "upcoming").length}
              </div>
              <div className="text-charcoal-600 font-medium">Upcoming</div>
            </div>
          </div>

          {/* DEV: Intake date override for testing */}
          {process.env.NODE_ENV !== 'production' && (
            <div className="mb-6 p-4 bg-btl-50 rounded-xl border border-btl-200">
              <div className="flex items-center space-x-4">
                <label htmlFor="dev-intake-date" className="text-sm text-btl-700 font-semibold">Override Intake Date:</label>
                <input
                  id="dev-intake-date"
                  type="date"
                  value={devIntakeDate}
                  onChange={e => setDevIntakeDate(e.target.value)}
                  className="border border-btl-200 rounded px-3 py-1 text-sm"
                />
                <button 
                  onClick={() => setDevIntakeDate("")}
                  className="text-xs text-btl-600 hover:text-btl-700"
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {/* Tabs with BTL styling */}
          <div className="card-gradient rounded-2xl shadow-lg border border-btl-200 mb-8">
            <div className="border-b border-btl-200">
              <nav className="flex space-x-8 px-8">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                      activeTab === tab.id
                        ? "border-btl-600 text-btl-700 bg-btl-50"
                        : "border-transparent text-charcoal-500 hover:text-btl-600 hover:border-btl-300"
                    }`}
                  >
                    {tab.name} 
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                      activeTab === tab.id 
                        ? "bg-btl-600 text-white" 
                        : "bg-charcoal-100 text-charcoal-600"
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Assessment List */}
            <div className="p-8">
              <div className="space-y-6">
                {filteredAssessments.map((assessment) => {
                  const statusInfo = getStatusInfo(assessment.status, assessment.date, assessment.dueDate)
                  const isLocked = assessment.status === 'upcoming'
                  const isDue = assessment.status === 'due' && !assessment.formData

                  // Handler for assessment click
                  const handleClick = () => {
                        // Assessment clicked
                    
                    if (assessment.status === 'completed' && assessment.formData) {
                      // Open modal for completed forms
                      // Opening modal with assessment
                      setSelectedAssessment(assessment)
                    } else if (assessment.status === 'due') {
                      // Redirect to intake form for due forms
                      window.location.href = '/intake';
                    }
                    // Upcoming forms are locked, no action needed
                  }

                  return (
                    <div
                      key={assessment.id}
                      className={`border rounded-2xl p-6 transition-all duration-300 group ${
                        assessment.isHighlighted 
                          ? 'border-btl-300 bg-gradient-to-r from-btl-50 to-white shadow-lg' 
                          : 'border-btl-200'
                      } ${isLocked ? 'opacity-60 cursor-not-allowed' : 'hover:border-btl-300 hover:bg-btl-50 hover:shadow-lg cursor-pointer'}`}
                      onClick={isLocked ? undefined : handleClick}
                      title={isLocked ? `Available on ${assessment.dueDate || assessment.date}` : ''}
                    >
                      <div className="flex items-start space-x-6">
                        <div className="bg-gradient-to-br from-btl-100 to-btl-200 p-4 rounded-2xl shadow-md group-hover:shadow-lg transition-all duration-300">
                          <FileText className="w-6 h-6 text-btl-600" />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-charcoal-900 group-hover:text-btl-700 transition-colors mb-2">
                                {assessment.title}
                              </h3>
                              <p className="text-charcoal-600 text-sm leading-relaxed">{assessment.description}</p>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span
                                className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusInfo.color}`}
                              >
                                {assessment.status.charAt(0).toUpperCase() + assessment.status.slice(1)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-6 text-sm text-charcoal-500">
                              <span className="flex items-center space-x-2">
                                <Clock className="w-4 h-4" />
                                <span>10-15 minutes</span>
                              </span>
                              <span className="bg-btl-100 text-btl-700 px-3 py-1 rounded-full font-medium">
                                Intake Form
                              </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm text-charcoal-500">
                              <statusInfo.icon className="w-4 h-4" />
                              <span>{isLocked ? `Available on ${assessment.dueDate || assessment.date}` : statusInfo.timeInfo}</span>
                            </div>
                          </div>

                          {assessment.isHighlighted && !assessment.formData && (
                            <div className="mt-4 p-3 bg-gradient-to-r from-btl-100 to-btl-50 rounded-xl border border-btl-200">
                              <p className="text-sm text-btl-800 font-medium flex items-center space-x-2">
                                <AlertTriangle className="w-4 h-4" />
                                <span>
                                  {assessment.status === "due" 
                                    ? "This form needs your attention"
                                    : "This form will be available soon"
                                  }
                                </span>
                              </p>
                            </div>
                          )}

                          {assessment.status === 'completed' && (
                            <div className="mt-4 flex justify-end">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedAssessment(assessment);
                                }}
                                className="bg-gradient-to-r from-btl-600 to-btl-700 hover:from-btl-700 hover:to-btl-800 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2"
                              >
                                <FileText className="w-4 h-4" />
                                <span>View Results</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {filteredAssessments.length === 0 && (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-btl-100 to-btl-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FileText className="w-10 h-10 text-btl-600" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">No intake forms found</h3>
                  <p className="text-charcoal-600">No forms match the current filter</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedAssessment && (
        <AssessmentModal assessment={selectedAssessment} onClose={() => setSelectedAssessment(null)} />
      )}
    </div>
  )
}

