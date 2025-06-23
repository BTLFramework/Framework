"use client"

import { Card } from "@/components/ui/card"

interface ToolkitCardProps {
  item: {
    title: string
    description: string
    icon: any
    count: number
    category: string
  }
}

export function ToolkitCard({ item }: ToolkitCardProps) {
  return (
    <Card className="hover:border-primary/50 hover:shadow-sm transition-all duration-200 cursor-pointer group">
      <div className="flex items-center space-x-4 p-4">
        <div className="p-2 bg-accent/10 rounded-lg group-hover:bg-accent/20 transition-colors">
          <item.icon className="w-5 h-5 text-accent" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground">{item.title}</h3>
          <p className="text-gray-600 text-xs">{item.description}</p>
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.count}</span>
      </div>
    </Card>
  )
}
