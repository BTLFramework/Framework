"use client"

import { Star, Flame, Zap, Trophy } from "lucide-react";
import { Medal } from "lucide-react";
import { useState, useEffect } from "react";

interface WeeklyPointsSectionProps {
  patientEmail?: string
  refreshKey?: number
}

export function WeeklyPointsSection({ patientEmail, refreshKey }: WeeklyPointsSectionProps) {
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
  }, [patientEmail, refreshKey]) // Add refreshKey to dependencies

  // Helper function to get badge colors (matching movement session header gradient)
  const getBadgeColor = (badgeClass: string) => {
    // All pills use the same ombre blue gradient now
    return "bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 text-white shadow-md border border-btl-600";
  }

  const getBadgeText = (badgeClass: string, points: number) => {
    // No emoji, just the points
    return `+${points}`;
  }

  // Calculate progress percentage
  const progressPercentage = Math.min(100, Math.round((weeklyData.total / weeklyData.target) * 100))
  const metallicGold = "#B8860B"; // Deeper, more visible gold
  const achievements = [
    {
      icon: Flame,
      title: "Daily Streak",
      description: `${weeklyData.streakDays} days`,
      points: weeklyData.streakDays >= 7 ? 5 : weeklyData.streakDays >= 3 ? 3 : weeklyData.streakDays >= 1 ? 1 : 0,
      badgeClass: weeklyData.streakDays >= 7 ? "badge-gold" : weeklyData.streakDays >= 3 ? "badge-silver" : weeklyData.streakDays >= 1 ? "badge-bronze" : "badge-none",
      iconColor: metallicGold,
      progress: Math.round((weeklyData.streakDays / 7) * 100), // Rounded percentage
    },
    {
      icon: Zap,
      title: "Movement Goals", 
      description: `${weeklyData.breakdown.MOVEMENT}/60 pts`,
      points: Math.floor(weeklyData.breakdown.MOVEMENT / 20),
      badgeClass: weeklyData.breakdown.MOVEMENT >= 50 ? "badge-gold" : weeklyData.breakdown.MOVEMENT >= 30 ? "badge-silver" : "badge-bronze",
      iconColor: metallicGold,
      progress: Math.round((weeklyData.breakdown.MOVEMENT / 60) * 100), // Rounded percentage
    },
    {
      icon: Trophy,
      title: "Weekly Progress",
      description: `${weeklyData.total}/${weeklyData.target} pts`,
      points: Math.floor(weeklyData.total / 50),
      badgeClass: weeklyData.total >= 120 ? "badge-gold" : weeklyData.total >= 75 ? "badge-silver" : "badge-bronze",
      iconColor: metallicGold,
      progress: progressPercentage, // Already rounded above
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
            {/* Remove the gray background box and shadow from the icon */}
            <achievement.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" style={{ color: metallicGold }} />
            <div className="flex-1">
              <div className="font-semibold text-charcoal-900 text-sm group-hover:text-btl-700 transition-colors duration-200">{achievement.title}</div>
              <div className="text-charcoal-600 text-xs">{achievement.description}</div>
            </div>
            <div className="text-right flex flex-col items-end space-y-1">
              <span className={`px-4 py-1 rounded-full font-bold text-xs ${getBadgeColor(achievement.badgeClass)} transform hover:scale-105 transition-transform duration-200`}>
                {getBadgeText(achievement.badgeClass, achievement.points)}
              </span>
              <div className="text-xs font-medium text-charcoal-500 group-hover:text-btl-600 transition-colors duration-200">
                {achievement.progress > 0 ? `${achievement.progress}%` : '0%'}
              </div>
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

      {/* Achievement Level Explanations */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Achievement Levels</h3>
        <div className="space-y-2 text-xs text-gray-600">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow border border-yellow-500 flex-shrink-0"></div>
            <span className="flex-1"><strong>Gold:</strong> 7+ days (50+ pts, 120+ weekly)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 shadow border border-gray-400 flex-shrink-0"></div>
            <span className="flex-1"><strong>Silver:</strong> 3–6 days (30–49 pts, 75–119 weekly)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-full bg-gradient-to-r from-[#b08d57] via-[#a97142] to-[#7c5c36] shadow border border-[#a97142] flex-shrink-0"></div>
            <span className="flex-1"><strong>Bronze:</strong> 1–2 days (1–29 pts, 1–74 weekly)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
