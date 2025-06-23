"use client"

import { X, Play, Download, BookOpen } from "lucide-react"

interface ToolkitModalProps {
  toolkit: {
    title: string
    description: string
    category: string
    count: number
  }
  onClose: () => void
}

export function ToolkitModal({ toolkit, onClose }: ToolkitModalProps) {
  const getContent = () => {
    switch (toolkit.category) {
      case "videos":
        return [
          { title: "Morning Mobility Routine", duration: "15 min", type: "video" },
          { title: "Core Strengthening", duration: "20 min", type: "video" },
          { title: "Pain Relief Stretches", duration: "10 min", type: "video" },
          { title: "Balance Training", duration: "12 min", type: "video" },
        ]
      case "guides":
        return [
          { title: "Understanding Your Recovery", pages: "12 pages", type: "guide" },
          { title: "Pain Management Strategies", pages: "8 pages", type: "guide" },
          { title: "Exercise Safety Guidelines", pages: "6 pages", type: "guide" },
          { title: "Nutrition for Recovery", pages: "10 pages", type: "guide" },
        ]
      case "tools":
        return [
          { title: "Pain Tracking Journal", description: "Daily pain monitoring", type: "tool" },
          { title: "Breathing Exercise Timer", description: "Guided breathing sessions", type: "tool" },
          { title: "Progress Photo Tracker", description: "Visual recovery tracking", type: "tool" },
          { title: "Medication Reminder", description: "Never miss a dose", type: "tool" },
        ]
      default:
        return []
    }
  }

  const content = getContent()

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{toolkit.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{toolkit.description}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid gap-4">
            {content.map((item, index) => (
              <div
                key={index}
                className="flex items-center space-x-4 p-4 border border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                <div className="p-2 bg-secondary rounded-lg">
                  {item.type === "video" && <Play className="w-5 h-5 text-muted-foreground" />}
                  {item.type === "guide" && <BookOpen className="w-5 h-5 text-muted-foreground" />}
                  {item.type === "tool" && <Download className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600">
                    {(item as any).duration || (item as any).pages || (item as any).description}
                  </p>
                </div>
                <button className="px-3 py-1 bg-teal-600 text-white text-sm rounded-lg hover:bg-teal-700 transition-colors">
                  {item.type === "video" ? "Watch" : item.type === "guide" ? "Read" : "Use"}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
