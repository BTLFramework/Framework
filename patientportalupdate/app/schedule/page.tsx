"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, MapPin, User, Phone, MessageCircle, CheckCircle, XCircle, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/useAuth"

interface Appointment {
  id: string
  date: string
  time: string
  type: string
  status: "upcoming" | "completed" | "cancelled"
  notes?: string
  provider: string
  duration: number
}

export default function SchedulePage() {
  const router = useRouter()
  const { patient, loading: authLoading, isAuthenticated } = useAuth()
  
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming")
  const [selectedMonth, setSelectedMonth] = useState(new Date())
  const [loading, setLoading] = useState(true)

  // Generate sample appointments
  useEffect(() => {
    const generateAppointments = () => {
      const sampleAppointments: Appointment[] = [
        {
          id: "1",
          date: "2024-01-15",
          time: "10:00",
          type: "Chiropractic Adjustment",
          status: "upcoming",
          provider: "Dr. Spencer Barber",
          duration: 30,
          notes: "Follow-up on neck pain improvement"
        },
        {
          id: "2",
          date: "2024-01-22",
          time: "14:00",
          type: "Follow-up Session",
          status: "upcoming",
          provider: "Dr. Spencer Barber",
          duration: 45
        },
        {
          id: "3",
          date: "2024-01-08",
          time: "09:00",
          type: "Initial Consultation",
          status: "completed",
          provider: "Dr. Spencer Barber",
          duration: 60,
          notes: "Initial assessment completed, treatment plan established"
        },
        {
          id: "4",
          date: "2024-01-01",
          time: "11:00",
          type: "Chiropractic Adjustment",
          status: "completed",
          provider: "Dr. Spencer Barber",
          duration: 30
        }
      ]
      
      setAppointments(sampleAppointments)
      setLoading(false)
    }
    
    generateAppointments()
  }, [])

  const upcomingAppointments = appointments.filter(apt => apt.status === "upcoming")
  const pastAppointments = appointments.filter(apt => apt.status === "completed" || apt.status === "cancelled")

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "upcoming":
        return {
          icon: Clock,
          color: "text-btl-600 bg-btl-100 border-btl-200",
          text: "Upcoming"
        }
      case "completed":
        return {
          icon: CheckCircle,
          color: "text-emerald-600 bg-emerald-100 border-emerald-200",
          text: "Completed"
        }
      case "cancelled":
        return {
          icon: XCircle,
          color: "text-red-600 bg-red-100 border-red-200",
          text: "Cancelled"
        }
      default:
        return {
          icon: AlertCircle,
          color: "text-gray-600 bg-gray-100 border-gray-200",
          text: "Unknown"
        }
    }
  }

  const handleReschedule = (appointmentId: string) => {
    router.push('/book-appointment')
  }

  const handleCancel = async (appointmentId: string) => {
    if (confirm('Are you sure you want to cancel this appointment?')) {
      // Update appointment status
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: "cancelled" as const } : apt
      ))
    }
  }

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
          <p className="text-btl-600">Loading your schedule...</p>
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!isAuthenticated || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-btl-600">Please log in to view your schedule.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100">
      {/* Header with BTL gradient */}
      <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white px-6 py-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-2xl">
              <Calendar className="w-10 h-10 text-white opacity-90" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">My Schedule</h1>
              <p className="text-btl-100 mt-1">View and manage your appointments</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push('/book-appointment')}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200"
            >
              Book New
            </button>
            <button 
              onClick={() => router.back()} 
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center">
              <div className="text-3xl font-bold text-btl-600 mb-2">
                {upcomingAppointments.length}
              </div>
              <div className="text-charcoal-600 font-medium">Upcoming</div>
            </div>
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">
                {pastAppointments.filter(apt => apt.status === "completed").length}
              </div>
              <div className="text-charcoal-600 font-medium">Completed</div>
            </div>
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center">
              <div className="text-3xl font-bold text-red-600 mb-2">
                {pastAppointments.filter(apt => apt.status === "cancelled").length}
              </div>
              <div className="text-charcoal-600 font-medium">Cancelled</div>
            </div>
            <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200 text-center">
              <div className="text-3xl font-bold text-charcoal-500 mb-2">
                {appointments.length}
              </div>
              <div className="text-charcoal-600 font-medium">Total</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="card-gradient rounded-2xl shadow-lg border border-btl-200 mb-8">
            <div className="border-b border-btl-200">
              <nav className="flex space-x-8 px-8">
                <button
                  onClick={() => setActiveTab("upcoming")}
                  className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === "upcoming"
                      ? "border-btl-600 text-btl-700 bg-btl-50"
                      : "border-transparent text-charcoal-500 hover:text-btl-600 hover:border-btl-300"
                  }`}
                >
                  Upcoming Appointments
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === "upcoming" 
                      ? "bg-btl-600 text-white" 
                      : "bg-charcoal-100 text-charcoal-600"
                  }`}>
                    {upcomingAppointments.length}
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab("past")}
                  className={`py-6 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                    activeTab === "past"
                      ? "border-btl-600 text-btl-700 bg-btl-50"
                      : "border-transparent text-charcoal-500 hover:text-btl-600 hover:border-btl-300"
                  }`}
                >
                  Past Appointments
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === "past" 
                      ? "bg-btl-600 text-white" 
                      : "bg-charcoal-100 text-charcoal-600"
                  }`}>
                    {pastAppointments.length}
                  </span>
                </button>
              </nav>
            </div>

            {/* Appointment List */}
            <div className="p-8">
              {loading ? (
                <div className="text-center py-16">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
                  <p className="text-btl-600">Loading appointments...</p>
                </div>
              ) : activeTab === "upcoming" && upcomingAppointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-btl-100 to-btl-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <Calendar className="w-10 h-10 text-btl-500" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">No upcoming appointments</h3>
                  <p className="text-charcoal-600 mb-6">You don't have any appointments scheduled</p>
                  <button
                    onClick={() => router.push('/book-appointment')}
                    className="bg-gradient-to-r from-btl-600 to-btl-700 hover:from-btl-700 hover:to-btl-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-lg"
                  >
                    Book Your First Appointment
                  </button>
                </div>
              ) : activeTab === "past" && pastAppointments.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-btl-100 to-btl-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <CheckCircle className="w-10 h-10 text-btl-500" />
                  </div>
                  <h3 className="text-xl font-bold text-charcoal-900 mb-3">No past appointments</h3>
                  <p className="text-charcoal-600">Your appointment history will appear here</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {(activeTab === "upcoming" ? upcomingAppointments : pastAppointments).map((appointment) => {
                    const statusInfo = getStatusInfo(appointment.status)
                    const StatusIcon = statusInfo.icon
                    
                    return (
                      <div
                        key={appointment.id}
                        className="border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg border-btl-200"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-6">
                            <div className="bg-gradient-to-br from-btl-100 to-btl-200 p-4 rounded-2xl shadow-md">
                              <Calendar className="w-6 h-6 text-btl-600" />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-charcoal-900 mb-2">
                                    {appointment.type}
                                  </h3>
                                  <div className="flex items-center space-x-6 text-sm text-charcoal-600">
                                    <span className="flex items-center space-x-2">
                                      <Clock className="w-4 h-4" />
                                      <span>{formatDate(appointment.date)} at {formatTime(appointment.time)}</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                      <User className="w-4 h-4" />
                                      <span>{appointment.provider}</span>
                                    </span>
                                    <span className="flex items-center space-x-2">
                                      <MapPin className="w-4 h-4" />
                                      <span>Back to Life Clinic</span>
                                    </span>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                  <span className={`px-4 py-2 rounded-full text-sm font-semibold border ${statusInfo.color}`}>
                                    <div className="flex items-center space-x-2">
                                      <StatusIcon className="w-4 h-4" />
                                      <span>{statusInfo.text}</span>
                                    </div>
                                  </span>
                                </div>
                              </div>

                              {appointment.notes && (
                                <div className="bg-btl-50 rounded-xl p-4 border border-btl-200 mb-4">
                                  <p className="text-sm text-btl-700">{appointment.notes}</p>
                                </div>
                              )}

                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-6 text-sm text-charcoal-500">
                                  <span>Duration: {appointment.duration} minutes</span>
                                  <span>Appointment ID: #{appointment.id}</span>
                                </div>
                                
                                {activeTab === "upcoming" && appointment.status === "upcoming" && (
                                  <div className="flex items-center space-x-3">
                                    <button
                                      onClick={() => handleReschedule(appointment.id)}
                                      className="bg-btl-600 hover:bg-btl-700 text-white px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm"
                                    >
                                      Reschedule
                                    </button>
                                    <button
                                      onClick={() => handleCancel(appointment.id)}
                                      className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card-gradient rounded-2xl shadow-lg p-6 border border-btl-200">
            <h3 className="text-lg font-semibold text-btl-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => router.push('/book-appointment')}
                className="bg-gradient-to-r from-btl-600 to-btl-700 hover:from-btl-700 hover:to-btl-800 text-white p-4 rounded-xl font-medium transition-all duration-200 hover:shadow-lg text-left"
              >
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Book New Appointment</div>
                    <div className="text-sm opacity-90">Schedule your next visit</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/messages')}
                className="bg-white border border-btl-200 hover:bg-btl-50 text-btl-700 p-4 rounded-xl font-medium transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <MessageCircle className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Contact Clinic</div>
                    <div className="text-sm opacity-90">Send a message</div>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => window.open('tel:+15551234567')}
                className="bg-white border border-btl-200 hover:bg-btl-50 text-btl-700 p-4 rounded-xl font-medium transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <Phone className="w-6 h-6" />
                  <div>
                    <div className="font-semibold">Call Clinic</div>
                    <div className="text-sm opacity-90">(555) 123-4567</div>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
