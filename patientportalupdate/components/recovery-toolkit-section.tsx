"use client"

import { Video, FileText, Wrench, Eye, ArrowRight } from "lucide-react"
import { exercises as allExercises } from "@/lib/exerciseLibrary"

interface RecoveryToolkitSectionProps {
  onToolkitClick: (toolkit: any) => void
}

export function RecoveryToolkitSection({ onToolkitClick }: RecoveryToolkitSectionProps) {
  const toolkitItems = [
    {
      title: "Exercise Videos",
      description: "Guided recovery movements",
      icon: Video,
      iconBg: "bg-gradient-to-br from-btl-100 to-btl-200",
      iconColor: "text-btl-600",
      count: allExercises.length,
      category: "videos",
    },
    {
      title: "Recovery Guides",
      description: "Educational resources",
      icon: FileText,
      iconBg: "bg-gradient-to-br from-btl-50 to-btl-200",
      iconColor: "text-btl-700",
      count: 49,
      category: "guides",
    },
    {
      title: "Support Tools",
      description: "Recovery support utilities",
      icon: Wrench,
      iconBg: "bg-gradient-to-br from-btl-100 to-btl-300",
      iconColor: "text-btl-600",
      count: 4,
      category: "tools",
    },
  ]

  return (
    <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 hover:card-hover-gradient hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold gradient-text">Recovery Toolkit</h2>
        <button className="flex items-center space-x-1 text-btl-600 hover:text-btl-700 text-sm font-medium hover:bg-btl-50 px-3 py-1 rounded-lg transition-all duration-200">
          <Eye className="w-4 h-4" />
          <span>View All</span>
        </button>
      </div>

      <div className="space-y-4">
        {toolkitItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 rounded-xl hover:bg-btl-50 cursor-pointer transition-all duration-200 border border-btl-100 hover:border-btl-200 hover:shadow-md group"
            onClick={() => onToolkitClick(item)}
          >
            <div className={`w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shadow-md`}>
              <item.icon className={`w-6 h-6 ${item.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-charcoal-900 group-hover:text-btl-700 transition-colors">{item.title}</h3>
              <p className="text-charcoal-600 text-sm">{item.description}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-semibold text-btl-600 bg-btl-100 px-2 py-1 rounded-full">
                {item.count}
              </span>
              <ArrowRight className="w-4 h-4 text-charcoal-400 group-hover:text-btl-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
