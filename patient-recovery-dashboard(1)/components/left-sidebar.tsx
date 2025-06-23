"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Target, Heart, Wrench, FileText, MessageCircle, ChevronRight, User } from "lucide-react"
import Link from "next/link"

const navigationItems = [
  { name: "Home", icon: Home, href: "/", active: true },
  { name: "Recovery Score", icon: Target, href: "/recovery-score" },
  { name: "Recovery Points", icon: Heart, href: "/recovery-points" },
  { name: "Recovery Tools", icon: Wrench, href: "/recovery-tools" },
  { name: "Assessments", icon: FileText, href: "/assessments" },
  { name: "Messages", icon: MessageCircle, href: "/messages" },
]

export function LeftSidebar() {
  const router = useRouter()
  const [activeItem, setActiveItem] = useState("Home")

  const handleNavigation = (item: any) => {
    setActiveItem(item.name)
    router.push(item.href)
  }

  return (
    <div className="w-64 bg-card border-r border-border flex flex-col shadow-lg">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center shadow-md">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-foreground">RecoveryHub</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center space-x-3 p-3 rounded-xl group transition-all duration-200 ${
              activeItem === item.name
                ? "bg-primary/10 text-primary border border-accent/50 shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
            onClick={() => setActiveItem(item.name)}
          >
            <item.icon className={`w-5 h-5 transition-colors ${activeItem === item.name ? "text-primary" : ""}`} />
            <span className="font-medium text-sm">{item.name}</span>
            {activeItem === item.name && <ChevronRight className="w-4 h-4 text-primary animate-pulse ml-auto" />}
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 mt-auto">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-secondary border border-border">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-md">
            <User className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="font-semibold text-sm text-foreground">Sarah Johnson</p>
            <p className="text-xs text-primary truncate">Patient ID: #12345</p>
          </div>
        </div>
      </div>
    </div>
  )
}
