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
    const setupToken = urlParams.get('token')
    
    if (urlPatientData) {
      try {
        const data = JSON.parse(urlPatientData)
        setPatientData(data)
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error('Error parsing patient data:', error)
        // Continue without patient data - allow direct account creation
        setPatientData(null)
      }
    } else if (setupToken) {
      fetch(`/api/patient-portal/verify-setup-token/${encodeURIComponent(setupToken)}`, {
        credentials: 'include'
      })
        .then(async response => {
          if (!response.ok) throw new Error('Invalid or expired setup link')
          return response.json()
        })
        .then(data => setPatientData({
          email: data.email,
          name: data.patientName,
          setupToken
        }))
        .catch(() => setPatientData(null))
        .finally(() => setLoading(false))
      return
    } else {
      // No patient data - allow direct account creation
      setPatientData(null)
    }
    
    setLoading(false)
  }, [router])

  const handleAccountCreated = () => {
    // Redirect to login page after successful account creation
    router.push('/')
  }

  const handleBack = () => {
    // If we have patient data, go back to intake form results
    if (patientData) {
      router.push('http://localhost:5175')
    } else {
      // Otherwise go back to login
      router.push('/')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-btl-500"></div>
      </div>
    )
  }

  return (
    <CreateAccountForm
      patientEmail={patientData?.email || ''}
      patientName={patientData?.name || ''}
      setupToken={patientData?.setupToken}
      onSuccess={handleAccountCreated}
      onBack={handleBack}
      isDirectSignup={!patientData}
    />
  )
}
