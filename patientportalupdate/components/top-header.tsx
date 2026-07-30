"use client"

import { MessageCircle, Calendar, Sparkles, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { CSRFProtection } from "@/utils/csrf"

interface TopHeaderProps {
  patientData: any
  onChatAssistant: () => void
  onBookAppointment: () => void
}

export function TopHeader({ patientData, onChatAssistant, onBookAppointment }: TopHeaderProps) {
  const router = useRouter()

  const handleLogout = async () => {
    // Show confirmation dialog
    const confirmed = window.confirm('Are you sure you want to logout?')
    if (!confirmed) return

    try {
      // Clear authentication and session data only
      // We preserve ALL patient recovery progress data
      localStorage.removeItem('btl_patient_data') // Session-specific patient data

      // Clear any temporary session state
      sessionStorage.clear()

      // Clear CSRF token
      CSRFProtection.clearToken()

      // Call logout API with CSRF protection
      const response = await CSRFProtection.secureFetch('/api/patient-portal/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if (response.ok) {
        // Redirect to login page
        window.location.href = '/login'
      } else {
        console.error('Logout failed')
        // Still redirect even if API call fails
        window.location.href = '/login'
      }
    } catch (error) {
      console.error('Logout error:', error)
      // Still redirect even if there's an error
      window.location.href = '/login'
    }
  }

  return (
    <header className="bg-white border-b border-charcoal-200 px-4 sm:px-6 py-4 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold gradient-text">
            Welcome back, {patientData?.name?.split(' ')[0] || 'Sarah'}
          </h1>
          <p className="text-charcoal-600 text-sm mt-1">Let's continue your recovery journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
          {/* Primary CTA - Most Prominent */}
          <a
            href="https://movenetics.janeapp.com/#/staff_member/30"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center space-x-2 px-4 py-3 btn-primary-gradient text-white rounded-xl transition-all duration-200 font-semibold shadow-lg hover:shadow-xl text-sm sm:text-base"
          >
            <Calendar className="w-5 h-5" />
            <span>Book Appointment</span>
          </a>

          {/* Secondary Action - Outline Style */}
          <button
            onClick={onChatAssistant}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-2 border-btl-600 text-btl-700 bg-white hover:bg-btl-50 rounded-xl transition-all duration-200 font-medium shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat Assistant</span>
            <Sparkles className="w-3 h-3 text-btl-500" />
          </button>

          {/* Tertiary Action - Ghost Button */}
          <button
            onClick={handleLogout}
            className="flex items-center justify-center space-x-2 px-3 py-2 text-btl-700 hover:text-btl-800 hover:bg-btl-50 rounded-xl transition-all duration-200 font-medium"
            title="Logout from your account"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  )
}
