"use client"

import { MessageCircle, Calendar, Sparkles } from "lucide-react"

interface TopHeaderProps {
  patientData: any
  onChatAssistant: () => void
  onBookAppointment: () => void
}

export function TopHeader({ patientData, onChatAssistant, onBookAppointment }: TopHeaderProps) {
  return (
    <header className="bg-white border-b border-charcoal-200 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            Welcome back, {patientData?.name?.split(' ')[0] || 'Sarah'}
          </h1>
          <p className="text-charcoal-600 text-sm mt-1">Let's continue your recovery journey</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onChatAssistant}
            className="flex items-center space-x-2 px-4 py-2 text-charcoal-700 hover:text-btl-700 hover:bg-btl-50 rounded-xl transition-all duration-200 border border-charcoal-200 hover:border-btl-200 shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Chat Assistant</span>
            <Sparkles className="w-3 h-3 text-btl-500" />
          </button>

          <button
            onClick={onBookAppointment}
            className="flex items-center space-x-2 px-4 py-2 btn-primary-gradient text-white rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </header>
  )
}
