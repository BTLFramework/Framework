"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Home, Target, Heart, Wrench, FileText, MessageCircle, ChevronRight, Clock, ClipboardList } from "lucide-react"

const navigationItems = [
  { name: "Home", icon: Home, href: "/", active: true },
  { name: "Today's Tasks", icon: Clock, href: "/todays-tasks" },
  { name: "Recovery Score", icon: Target, href: "/recovery-score" },
  { name: "Recovery Points", icon: Heart, href: "/recovery-points" },
  { name: "Recovery Tools", icon: Wrench, href: "/recovery-tools" },
  { name: "Assessments", icon: FileText, href: "/assessments" },
  { name: "Messages", icon: MessageCircle, href: "/messages" },
]

interface LeftSidebarProps {
  patientData: any
}

export function LeftSidebar({ patientData }: LeftSidebarProps) {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("Home")
  const [unreadCount, setUnreadCount] = useState(0)

  // Get patient ID from patientData prop
  const patientId = patientData?.id || 1; // Fallback to 1 if no patient data

  // Fetch unread message count
  useEffect(() => {
    // Only fetch if we have a valid patient ID
    if (!patientId || patientId === 1) {
      return; // Don't fetch for invalid patient ID
    }

    const fetchUnreadCount = async () => {
      try {
        const response = await fetch(`/api/messages/patient/${patientId}`)
        
        if (response.ok) {
          const result = await response.json()
          
          if (result.success) {
            // Count unread messages that are from clinicians (not patient's own messages)
            const unreadMessages = result.messages.filter(
              (msg: any) => !msg.isRead && msg.senderType === 'CLINICIAN'
            )
            setUnreadCount(unreadMessages.length)
          }
        }
      } catch (error) {
        console.error('Error fetching unread message count:', error)
        // Silently fail - don't show error to user for notification badge
      }
    }

    fetchUnreadCount()
    
    // Poll for new messages every 60 seconds (reduced frequency)
    const interval = setInterval(fetchUnreadCount, 60000)
    
    return () => clearInterval(interval)
  }, [patientId])

  const handleNavigation = (item: any) => {
    setActiveItem(item.name)
    
    // If navigating to messages, reset unread count after a short delay
    // (gives time for the page to load and mark messages as read)
    if (item.name === "Messages") {
      setTimeout(() => {
        setUnreadCount(0)
      }, 1000)
    }
    
    router.push(item.href)
  }

  return (
    <div className="w-64 sidebar-light flex flex-col shadow-xl">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 back-to-life-gradient rounded-lg flex items-center justify-center shadow-lg">
            <div className="w-4 h-4 bg-white rounded-sm"></div>
          </div>
          <span className="font-bold gradient-text text-lg">Back to Life</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigationItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => handleNavigation(item)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeItem === item.name
                    ? "bg-gradient-to-r from-btl-50 to-btl-100 text-btl-700 border border-btl-200 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                  <item.icon
                    className={`w-5 h-5 transition-colors ${
                      activeItem === item.name ? "text-btl-600" : "text-gray-500 group-hover:text-gray-700"
                    }`}
                  />
                    {/* Notification badge for Messages */}
                    {item.name === "Messages" && unreadCount > 0 && (
                      <div className="absolute -top-2 -right-2 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </div>
                    )}
                  </div>
                  <span className="font-medium">{item.name}</span>
                  {/* Additional badge next to text for Messages */}
                  {item.name === "Messages" && unreadCount > 0 && (
                    <div className="ml-auto mr-2 min-w-[20px] h-[20px] bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </div>
                {activeItem === item.name && <ChevronRight className="w-4 h-4 text-btl-600 animate-pulse" />}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gradient-to-r from-btl-50 to-btl-100 border border-btl-200 hover:from-btl-100 hover:to-btl-200 transition-all duration-200 shadow-sm">
          <div className="w-10 h-10 back-to-life-gradient rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-semibold text-sm">
              {patientData?.name ? 
                patientData.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase() 
                : 'SJ'
              }
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {patientData?.name || 'Sarah Johnson'}
            </p>
            <p className="text-xs text-btl-600 truncate">
              {patientData?.email || 'Patient ID: #12345'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
