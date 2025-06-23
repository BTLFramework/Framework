"use client"

import { Flame, Zap, Trophy, Star } from "lucide-react"

export function WeeklyPointsSection() {
  const achievements = [
    {
      icon: Flame,
      title: "Daily Streak",
      description: "3 days",
      points: 2,
      badgeClass: "badge-bronze",
      iconColor: "text-amber-700", // Bronze color for icon
      progress: 60,
    },
    {
      icon: Zap,
      title: "Perfect Week", 
      description: "5/7 days",
      points: 5,
      badgeClass: "badge-gold", 
      iconColor: "text-yellow-600", // Gold color for icon
      progress: 71,
    },
    {
      icon: Trophy,
      title: "Assessment Pro",
      description: "2/3 done",
      points: 3,
      badgeClass: "badge-silver",
      iconColor: "text-gray-500", // Silver color for icon
      progress: 67,
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
          <span className="text-2xl font-bold text-btl-600">22</span>
          <span className="text-charcoal-500">/30</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-charcoal-200 rounded-full h-3 mb-6 overflow-hidden">
        <div
          className="back-to-life-gradient h-3 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: "73%" }}
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
              <span className={`px-2 py-1 rounded-full font-bold text-xs ${achievement.badgeClass} transform hover:scale-105 transition-transform duration-200`}>
                +{achievement.points} pts
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
