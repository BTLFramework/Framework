"use client"

import { Video, FileText, HelpCircle, Eye, ArrowRight } from "lucide-react"

interface RecoveryToolkitSectionProps {
  onToolkitClick: (toolkit: any) => void
}

export function RecoveryToolkitSection({ onToolkitClick }: RecoveryToolkitSectionProps) {
  const toolkitItems = [
    {
      title: "Exercise Videos",
      description: "Guided recovery movements",
      icon: Video,
      iconBg: "bg-gradient-to-br from-blue-100 to-blue-200",
      iconColor: "text-blue-600",
      count: 12,
      category: "videos",
    },
    {
      title: "Recovery Guides",
      description: "Educational resources",
      icon: FileText,
      iconBg: "bg-gradient-to-br from-green-100 to-green-200",
      iconColor: "text-green-600",
      count: 8,
      category: "guides",
    },
    {
      title: "Support Tools",
      description: "Get help when needed",
      icon: HelpCircle,
      iconBg: "bg-gradient-to-br from-amber-100 to-amber-200",
      iconColor: "text-amber-600",
      count: 6,
      category: "tools",
    },
  ]

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recovery Toolkit</h2>
        <button className="flex items-center space-x-1 text-teal-600 hover:text-teal-700 text-sm font-medium hover:bg-teal-50 px-3 py-1 rounded-lg transition-all duration-200">
          <Eye className="w-4 h-4" />
          <span>View All</span>
        </button>
      </div>

      <div className="space-y-4">
        {toolkitItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-gray-50 cursor-pointer transition-all duration-200 border border-gray-100 hover:border-teal-200 hover:shadow-md group"
            onClick={() => onToolkitClick(item)}
          >
            <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">{item.title}</h3>
              <p className="text-gray-600 text-sm">{item.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-teal-600 bg-teal-100 px-2 py-1 rounded-full">
                {item.count}
              </span>
              <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
