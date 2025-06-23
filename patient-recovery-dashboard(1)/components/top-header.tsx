"use client"

import { MessageCircle, Calendar, Sparkles, ArrowRight } from "lucide-react"

interface TopHeaderProps {
  onChatAssistant: () => void
  onBookAppointment: () => void
}

export function TopHeader({ onChatAssistant, onBookAppointment }: TopHeaderProps) {
  return (
    <header className="bg-background border-b border-border px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm mt-1">Let's continue your recovery journey.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={onChatAssistant}
            className="flex items-center space-x-2 px-4 py-2 text-foreground hover:text-primary hover:bg-secondary rounded-xl transition-all duration-200 border border-border hover:border-primary/20 shadow-sm hover:shadow-md"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="font-medium">Chat Assistant</span>
            <Sparkles className="w-3 h-3 text-accent" />
          </button>

          <button
            onClick={onBookAppointment}
            className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition-all duration-200 font-medium shadow-md hover:shadow-lg transform hover:scale-105"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Appointment</span>
          </button>
        </div>
      </div>
    </header>
  )
}
