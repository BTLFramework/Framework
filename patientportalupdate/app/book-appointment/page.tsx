"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/useAuth"

export default function BookAppointmentPage() {
  const { patient, loading: authLoading, isAuthenticated } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      // Redirect to Jane App booking system
      window.location.href = process.env.JANE_APP_BOOKING_URL || "https://backtolife.janeapp.com/"
    }
  }, [authLoading, isAuthenticated])

  // Show loading state while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
        <p className="text-btl-600">Redirecting to appointment booking...</p>
      </div>
    </div>
  )
}
