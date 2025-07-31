"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateAccountForm } from '@/components/CreateAccountForm'

export default function CreateAccountPage() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get patient data from URL parameters
    const urlParams = new URLSearchParams(window.location.search)
    const urlPatientData = urlParams.get('patientData')
    
    if (urlPatientData) {
      try {
        const data = JSON.parse(urlPatientData)
        setPatientData(data)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('Error parsing patient data:', error)
        // Redirect to login if no valid data
        router.push('/')
      }
    } else {
      // No patient data, redirect to login
      router.push('/')
    }
    
    setLoading(false)
  }, [router])

  const handleAccountCreated = () => {
    // Redirect to login page after successful account creation
    router.push('/')
  }

  const handleBack = () => {
    // Go back to intake form results
    router.push('http://localhost:5175')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-btl-500"></div>
      </div>
    )
  }

  if (!patientData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-btl-900 mb-4">Invalid Access</h2>
          <p className="text-btl-600 mb-6">Please complete your assessment first.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary-gradient text-white font-medium py-2 px-4 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <CreateAccountForm
      patientEmail={patientData.email}
      patientName={patientData.name}
      onSuccess={handleAccountCreated}
      onBack={handleBack}
    />
  )
} 