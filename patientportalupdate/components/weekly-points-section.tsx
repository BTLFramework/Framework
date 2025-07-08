"use client"

import { Flame, Zap, Trophy, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface WeeklyPointsSectionProps {
  patientEmail?: string
}

export function WeeklyPointsSection({ patientEmail }: WeeklyPointsSectionProps) {
  const [weeklyData, setWeeklyData] = useState({
    total: 0,
    target: 150,
    breakdown: {
      MOVEMENT: 0,
      LIFESTYLE: 0,
      MINDSET: 0,
      EDUCATION: 0,
      ADHERENCE: 0
    },
    streakDays: 0,
    completionRate: 0
  })
  const [loading, setLoading] = useState(false)

  // Fetch real recovery points data
  useEffect(() => {
    const fetchRecoveryPoints = async () => {
      if (!patientEmail || patientEmail === 'test@example.com') {
        console.log('ℹ️ No valid patient email or using default, skipping fetch')
        return
      }
      
      setLoading(true)
      try {
        console.log('🔄 Fetching recovery points for:', patientEmail)
        
        // Get patient data first to get patient ID
        const patientResponse = await fetch(`/api/patients/portal-data/${patientEmail}`)
        if (!patientResponse.ok) {
          const errorText = await patientResponse.text()
          console.log('❌ Patient not found or API error:', errorText)
          // If patient not found, silently return without throwing error
          if (patientResponse.status === 404) {
            console.log('ℹ️ Patient not found, using default data')
            return
          }
          throw new Error(`Failed to fetch patient data: ${errorText}`)
        }
        
        const patientData = await patientResponse.json()
        const patientId = patientData.data.patient.id
        
        console.log('📊 Patient ID:', patientId)
        
        // Get weekly breakdown
        const weeklyResponse = await fetch(`/api/recovery-points/weekly/${patientId}`)
        if (!weeklyResponse.ok) {
          throw new Error('Failed to fetch weekly recovery points')
        }
        
        const weeklyPoints = await weeklyResponse.json()
        console.log('📈 Weekly points data:', weeklyPoints)
        
        // Get buffer status for additional data
        const bufferResponse = await fetch(`/api/recovery-points/buffer/${patientId}`)
        const bufferData = bufferResponse.ok ? await bufferResponse.json() : null
        
        // Update state with real data
        setWeeklyData({
          total: weeklyPoints.total,
          target: 150, // Weekly target from config
          breakdown: weeklyPoints.breakdown,
          streakDays: patientData.data.recoveryPoints?.streakDays || 0,
          completionRate: patientData.data.recoveryPoints?.completionRate || 0
        })
        
        console.log('✅ Recovery points data updated')
        
      } catch (error) {
        console.error('❌ Error fetching recovery points:', error)
        // Keep default values on error
      } finally {
        setLoading(false)
      }
    }

    fetchRecoveryPoints()
  }, [patientEmail])

  // Helper function to get badge colors (matching daily tasks)
  const getBadgeColor = (badgeClass: string) => {
    switch (badgeClass) {
      case "badge-gold":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-900 shadow-md border border-yellow-500"
      case "badge-silver":
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-800 shadow-md border border-gray-400"
      case "badge-bronze":
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-900 shadow-md border border-orange-500"
      default:
        return "bg-gray-100 text-gray-600 border-gray-200"
    }
  }

  const getBadgeText = (badgeClass: string, points: number) => {
    switch (badgeClass) {
      case "badge-gold":
        return `🥇 +${points}`
      case "badge-silver":
        return `🥈 +${points}`
      case "badge-bronze":
        return `🥉 +${points}`
      default:
        return `+${points}`
    }
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((weeklyData.total / weeklyData.target) * 100))
  const achievements = [
    {
      icon: Flame,
      title: "Daily Streak",
      description: `${weeklyData.streakDays} days`,
      points: weeklyData.streakDays >= 7 ? 5 : weeklyData.streakDays >= 3 ? 3 : 1,
      badgeClass: weeklyData.streakDays >= 7 ? "badge-gold" : weeklyData.streakDays >= 3 ? "badge-silver" : "badge-bronze",
      iconColor: weeklyData.streakDays >= 7 ? "text-yellow-600" : weeklyData.streakDays >= 3 ? "text-gray-500" : "text-amber-700",
      progress: Math.min(100, (weeklyData.streakDays / 7) * 100),
    },
    {
      icon: Zap,
      title: "Movement Goals", 
      description: `${weeklyData.breakdown.MOVEMENT}/60 pts`,
      points: Math.floor(weeklyData.breakdown.MOVEMENT / 20),
      badgeClass: weeklyData.breakdown.MOVEMENT >= 50 ? "badge-gold" : weeklyData.breakdown.MOVEMENT >= 30 ? "badge-silver" : "badge-bronze",
      iconColor: weeklyData.breakdown.MOVEMENT >= 50 ? "text-yellow-600" : weeklyData.breakdown.MOVEMENT >= 30 ? "text-gray-500" : "text-amber-700",
      progress: Math.min(100, (weeklyData.breakdown.MOVEMENT / 60) * 100),
    },
    {
      icon: Trophy,
      title: "Weekly Progress",
      description: `${weeklyData.total}/${weeklyData.target} pts`,
      points: Math.floor(weeklyData.total / 50),
      badgeClass: weeklyData.total >= 120 ? "badge-gold" : weeklyData.total >= 75 ? "badge-silver" : "badge-bronze",
      iconColor: weeklyData.total >= 120 ? "text-yellow-600" : weeklyData.total >= 75 ? "text-gray-500" : "text-amber-700",
      progress: progressPercentage,
    },
  ]

  return (
    <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 hover:card-hover-gradient hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Star className="w-5 h-5 text-btl-600" />
          <h2 className="text-xl font-semibold gradient-text">Weekly Recovery Points</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-btl-600">{loading ? "..." : weeklyData.total}</span>
          <span className="text-charcoal-500">/{weeklyData.target}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-charcoal-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="back-to-life-gradient h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Achievements */}
      <div className="space-y-4">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 bg-white transition-all duration-200 hover:shadow-md hover:border-btl-300 hover:bg-btl-50 group"
          >
            <div className="p-2 bg-gray-50 rounded-lg shadow-sm group-hover:bg-btl-100 transition-all duration-200">
              <achievement.icon className={`w-4 h-4 ${achievement.iconColor} group-hover:scale-105 transition-transform duration-200`} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-charcoal-900 text-sm group-hover:text-btl-700 transition-colors duration-200">{achievement.title}</div>
              <div className="text-charcoal-600 text-xs">{achievement.description}</div>
            </div>
            <div className="text-right flex flex-col items-end space-y-1">
              <span className={`px-2 py-1 rounded-full font-bold text-xs ${getBadgeColor(achievement.badgeClass)} transform hover:scale-105 transition-transform duration-200`}>
                {getBadgeText(achievement.badgeClass, achievement.points)}
              </span>
              <div className="text-xs font-medium text-charcoal-500 group-hover:text-btl-600 transition-colors duration-200">{achievement.progress}%</div>
            </div>
          </div>
        ))}
      </div>

      <button 
        className="mt-4 w-full p-4 bg-gradient-to-r from-btl-500 to-btl-600 hover:from-btl-600 hover:to-btl-700 rounded-lg border border-btl-300 transition-all duration-200 hover:shadow-lg transform hover:scale-[1.02] cursor-pointer"
        onClick={() => {
          // Scroll to daily tasks section
          const tasksSection = document.querySelector('[data-section="daily-tasks"]');
          if (tasksSection) {
            tasksSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }}
      >
        <p className="text-white text-sm font-semibold flex items-center justify-center">
          <Zap className="w-4 h-4 mr-2" />
          Complete Daily Tasks to Earn More Points!
        </p>
        <p className="text-btl-100 text-xs mt-1">Click to view your tasks</p>
      </button>
    </div>
  )
}
