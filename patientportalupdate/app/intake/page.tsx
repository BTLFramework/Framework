"use client"

import React, { useState } from 'react'
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'

interface IntakeFormData {
  patientName: string
  email: string
  dob: string
  region: string
  vas: number
  confidence: number
  psfs: Array<{ activity: string; score: number }>
  beliefs: string[]
  pcs4: { [key: string]: number }
  tsk7: { [key: string]: number }
  ndi?: number[]
  odi?: number[]
  ulfi?: number[]
  lefs?: number[]
}

const defaultPSFS = [
  { activity: 'Computer work', score: 0 },
  { activity: 'Driving', score: 0 },
  { activity: 'Sleeping', score: 0 },
  { activity: 'Standing', score: 0 },
  { activity: 'Walking', score: 0 }
]

const beliefOptions = [
  "I'm afraid to move because it might make my pain worse",
  "I think my pain will never get better",
  "I believe I need surgery to fix this",
  "I think I'm too old to recover",
  "I believe this injury will prevent me from working",
  "I think I need medication to manage my pain",
  "I believe I need to rest completely to heal",
  "I think my pain is a sign of serious damage",
  "I believe I need to avoid all physical activity",
  "I think my pain is permanent",
  "None of these apply"
]

const pcs4Questions = [
  {
    id: "pcs1",
    question: "I worry that my pain will never get better",
    category: "Rumination"
  },
  {
    id: "pcs2", 
    question: "I feel I can't go on",
    category: "Magnification"
  },
  {
    id: "pcs3",
    question: "It's terrible and I think it's never going to get any better",
    category: "Helplessness"
  },
  {
    id: "pcs4",
    question: "It's really quite bad and I think it's never going to get any better",
    category: "Helplessness"
  }
]

const tsk7Questions = [
  {
    id: "tsk1",
    question: "I avoid certain movements because I worry they'll make my pain worse",
    category: "Fear of Movement"
  },
  {
    id: "tsk2",
    question: "I feel safe being physically active, even if I feel a little discomfort",
    category: "Movement Confidence",
    reverseScored: true
  },
  {
    id: "tsk3",
    question: "I worry that doing too much could delay my recovery",
    category: "Recovery Concerns"
  },
  {
    id: "tsk4",
    question: "I think my body is fragile and needs to be protected",
    category: "Body Confidence"
  },
  {
    id: "tsk5",
    question: "If something hurts, I assume it's causing damage",
    category: "Pain Interpretation"
  },
  {
    id: "tsk6",
    question: "Just because something hurts doesn't mean it's harmful",
    category: "Pain Understanding",
    reverseScored: true
  },
  {
    id: "tsk7",
    question: "I'm confident in my body's ability to handle movement",
    category: "Body Confidence",
    reverseScored: true
  }
]

const regionOptions = [
  { value: "Neck", label: "Neck" },
  { value: "Back", label: "Back" },
  { value: "Upper Limb", label: "Upper Limb" },
  { value: "Lower Limb", label: "Lower Limb" }
]

export default function IntakeFormPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<IntakeFormData>({
    patientName: '',
    email: '',
    dob: '',
    region: '',
    vas: 5,
    confidence: 5,
    psfs: defaultPSFS,
    beliefs: [],
    pcs4: {},
    tsk7: {}
  })

  const totalSteps = 8

  const handleInputChange = (field: keyof IntakeFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handlePSFSChange = (index: number, score: number) => {
    const newPSFS = [...formData.psfs]
    newPSFS[index].score = score
    setFormData(prev => ({ ...prev, psfs: newPSFS }))
  }

  const handleBeliefToggle = (belief: string) => {
    setFormData(prev => ({
      ...prev,
      beliefs: prev.beliefs.includes(belief)
        ? prev.beliefs.filter(b => b !== belief)
        : [...prev.beliefs, belief]
    }))
  }

  const handlePCS4Change = (questionId: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      pcs4: { ...prev.pcs4, [questionId]: value }
    }))
  }

  const handleTSK7Change = (questionId: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      tsk7: { ...prev.tsk7, [questionId]: value }
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.patientName && formData.email && formData.dob && formData.region
      case 2:
        return formData.vas >= 0 && formData.vas <= 10
      case 3:
        return formData.psfs.some(psf => psf.score > 0)
      case 4:
        return formData.confidence >= 0 && formData.confidence <= 10
      case 5:
        return true // Beliefs are optional
      case 6:
        return Object.keys(formData.pcs4).length === pcs4Questions.length
              case 7:
          return Object.keys(formData.tsk7).length === tsk7Questions.length
      case 8:
        return true // Final step
      default:
        return false
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/intake', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          formType: 'Intake',
          date: new Date().toISOString()
        })
      })
      
      const result = await response.json()
      
      if (result.success) {
        // Store intake data in localStorage for the portal
        localStorage.setItem('btl_intake_data', JSON.stringify(formData))
        
        // Store patient data for the portal
        const patientData = {
          name: formData.patientName,
          email: formData.email,
          score: `${result.data.srsScore}/11`,
          phase: result.data.phase,
          timestamp: new Date().toISOString()
        }
        localStorage.setItem('btl_patient_data', JSON.stringify(patientData))
        
        toast({
          title: "Intake Form Submitted!",
          description: `Welcome ${formData.patientName}! Your recovery journey begins now.`,
        })
        
        // Redirect to dashboard
        router.push('/')
      } else {
        throw new Error(result.error || 'Submission failed')
      }
    } catch (error) {
      console.error('Intake submission error:', error)
      toast({
        title: "Submission Error",
        description: "Failed to submit intake form. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.patientName}
              onChange={(e) => handleInputChange('patientName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              type="date"
              value={formData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Pain Region *
            </label>
            <select
              value={formData.region}
              onChange={(e) => handleInputChange('region', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Select your pain region</option>
              {regionOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Assessment</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Pain Level (0-10) *
            </label>
            <div className="flex items-center space-x-4">
              <input
                type="range"
                min="0"
                max="10"
                value={formData.vas}
                onChange={(e) => handleInputChange('vas', parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-lg font-semibold text-gray-900 min-w-[3rem]">
                {formData.vas}/10
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>No Pain</span>
              <span>Worst Pain</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Functional Assessment</h3>
        <p className="text-gray-600 mb-4">
          Rate your ability to perform these activities on a scale of 0-10, where 0 is "unable to perform" and 10 is "able to perform at pre-injury level."
        </p>
        <div className="space-y-4">
          {formData.psfs.map((psf, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {psf.activity}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="10"
                  value={psf.score}
                  onChange={(e) => handlePSFSChange(index, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[3rem]">
                  {psf.score}/10
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Confidence Assessment</h3>
        <p className="text-gray-600 mb-4">
          How confident are you that you will be able to return to the activities that are important to you?
        </p>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confidence Level (0-10) *
          </label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="10"
              value={formData.confidence}
              onChange={(e) => handleInputChange('confidence', parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-lg font-semibold text-gray-900 min-w-[3rem]">
              {formData.confidence}/10
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Not at all Confident</span>
            <span>Completely Confident</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep5 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Beliefs Assessment</h3>
        <p className="text-gray-600 mb-4">
          Please select any beliefs that apply to you regarding your pain and recovery. This helps us understand your mindset and provide better support.
        </p>
        <div className="space-y-3">
          {beliefOptions.map((belief, index) => (
            <label key={index} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.beliefs.includes(belief)}
                onChange={() => handleBeliefToggle(belief)}
                className="mt-1 h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">{belief}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep6 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Pain Beliefs</h3>
        <p className="text-gray-600 mb-4">
          Please rate how much you agree with each statement about your pain.
        </p>
        <div className="space-y-6">
          {pcs4Questions.map((question) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {question.question}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="0"
                  max="4"
                  value={formData.pcs4[question.id] || 0}
                  onChange={(e) => handlePCS4Change(question.id, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[3rem]">
                  {formData.pcs4[question.id] || 0}/4
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0 Not at all</span>
                <span>1 Slightly</span>
                <span>2 Moderately</span>
                <span>3 Very much</span>
                <span>4 Completely</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep7 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Fear of Movement</h3>
        <p className="text-gray-600 mb-4">
          Please rate how much you agree with each statement about movement and activity.
        </p>
        <div className="space-y-6">
          {tsk7Questions.map((question: any) => (
            <div key={question.id} className="border border-gray-200 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {question.question}
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="1"
                  max="4"
                  value={formData.tsk7[question.id] || 1}
                  onChange={(e) => handleTSK7Change(question.id, parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-lg font-semibold text-gray-900 min-w-[3rem]">
                  {formData.tsk7[question.id] || 1}/4
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1 Strongly Disagree</span>
                <span>2 Disagree</span>
                <span>3 Agree</span>
                <span>4 Strongly Agree</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderStep = () => {
    switch (currentStep) {
      case 1: return renderStep1()
      case 2: return renderStep2()
      case 3: return renderStep3()
      case 4: return renderStep4()
      case 5: return renderStep5()
      case 6: return renderStep6()
      case 7: return renderStep7()
      case 8: return (
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Assessment</h3>
            <p className="text-gray-600 mb-4">
              You've completed all sections of your intake assessment. Click the button below to submit your responses and begin your recovery journey.
            </p>
          </div>
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Intake Assessment</h1>
              <p className="text-gray-600">Complete your initial assessment to begin your recovery journey</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-cyan-500 to-teal-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}
          
          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            
            <div className="flex space-x-3">
              {currentStep < totalSteps ? (
                <button
                  onClick={() => setCurrentStep(prev => prev + 1)}
                  disabled={!canProceed()}
                  className="px-6 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed() || isSubmitting}
                  className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-md hover:from-cyan-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete Assessment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 