"use client"

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
    <div className="p-4 rounded-lg border border-gray-200 hover:border-teal-200 hover:shadow-sm transition-all duration-200 cursor-pointer group">
      <div className="flex items-center justify-between mb-3">
        <div className="p-2 bg-teal-100 rounded-lg group-hover:bg-teal-200 transition-colors">
          <item.icon className="w-5 h-5 text-teal-600" />
        </div>
        <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{item.count}</span>
      </div>

      <h3 className="font-semibold text-gray-900 mb-1 text-sm">{item.title}</h3>
      <p className="text-gray-600 text-xs">{item.description}</p>
    </div>
  )
}
