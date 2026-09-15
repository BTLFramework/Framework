"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { CreateAccountForm } from '@/components/CreateAccountForm'

export default function CreateAccountPage() {
  const router = useRouter()
  const [patientData, setPatientData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const setupToken = urlParams.get('token')
    
    if (setupToken) {
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
      isDirectSignup={false}
    />
  )
}
