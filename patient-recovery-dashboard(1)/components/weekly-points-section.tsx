"use client"

import { Flame, Zap, Trophy, Star, Info } from "lucide-react"

export function WeeklyPointsSection() {
  const achievements = [
    {
      icon: Flame,
      title: "Daily Streak",
      description: "3 days • +2 pts",
      progress: 60,
      badgeClass: "badge-bronze",
      iconClass: "text-orange-600",
    },
    {
      icon: Zap,
      title: "Perfect Week",
      description: "5/7 days • +5 pts",
      progress: 71,
      badgeClass: "badge-gold",
      iconClass: "text-yellow-600",
    },
    {
      icon: Trophy,
      title: "Assessment Pro",
      description: "2/3 done • +3 pts",
      progress: 67,
      badgeClass: "badge-silver",
      iconClass: "text-gray-600",
    },
  ]

  return (
    <div className="p-6 bg-card rounded-xl border border-border shadow-lg hover:shadow-xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2 bg-gradient-to-br from-primary to-accent rounded-lg">
          <Star className="w-5 h-5 text-white" />
        </div>
        <h3 className="font-semibold text-foreground text-lg">This Week's Points</h3>
      </div>
      
      <div className="text-center mb-4">
        <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">22</span>
        <span className="text-lg text-muted-foreground">/35 points</span>
      </div>
      
      <div className="w-full bg-secondary rounded-full h-4 mb-4 overflow-hidden">
        <div
          className="bg-gradient-to-r from-primary to-accent h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
          style={{ width: `${(22 / 35) * 100}%` }}
        ></div>
      </div>
      
      <div className="mb-6 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
        <p className="text-foreground text-sm font-medium flex items-center">
          <Info className="w-4 h-4 mr-2 text-primary" />
          You're on track to meet your weekly goal. Keep it up!
        </p>
      </div>

      {/* Achievements */}
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="flex items-center space-x-4 p-4 rounded-xl border border-border bg-background hover:bg-secondary/50 transition-all duration-200 hover:shadow-md"
          >
            <div className={`p-3 rounded-xl shadow-md ${achievement.badgeClass}`}>
              <achievement.icon className={`w-5 h-5 ${achievement.iconClass}`} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-foreground text-sm">{achievement.title}</div>
              <div className="text-muted-foreground text-xs">{achievement.description}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-foreground">{achievement.progress}%</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
