"use client"

import { useState } from "react"
import { Home, Zap, Calendar, FileText, Book, Phone, HelpCircle, ChevronLeft, ChevronRight } from "lucide-react"

const navigationItems = [
  { name: "Dashboard", icon: Home, href: "/", active: true },
  { name: "Daily Boost", icon: Zap, href: "/daily-boost" },
  { name: "Weekly Plan", icon: Calendar, href: "/weekly-plan" },
  { name: "Forms", icon: FileText, href: "/forms" },
  { name: "Recovery Toolkit", icon: Book, href: "/toolkit" },
  { name: "Book Appointment", icon: Phone, href: "https://kineticliving.janeapp.com/#/staff_member/37", external: true },
  { name: "Support", icon: HelpCircle, href: "/support" },
]

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div>
                <h1 className="text-xl font-bold text-teal-600">RecoveryHub</h1>
                <p className="text-xs text-gray-500 mt-1">Patient Portal</p>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.active
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.active ? "text-teal-600" : "text-gray-500 group-hover:text-gray-700"}`}
                    />
                    {!isCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  </a>
                ) : (
                  <a
                    href={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                      item.active
                        ? "bg-teal-50 text-teal-700 border border-teal-200"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${item.active ? "text-teal-600" : "text-gray-500 group-hover:text-gray-700"}`}
                    />
                    {!isCollapsed && <span className="ml-3 font-medium">{item.name}</span>}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                <span className="text-teal-600 font-semibold text-sm">SJ</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">Sarah Johnson</p>
                <p className="text-xs text-gray-500 truncate">Patient ID: #12345</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
