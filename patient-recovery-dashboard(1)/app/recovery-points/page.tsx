"use client"

import { useState } from "react"
import { ArrowLeft, Star, Flame, Trophy, Target, Calendar, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { TaskModal } from "@/components/task-modal"

export default function RecoveryPointsPage() {
  const router = useRouter()
  const [selectedTask, setSelectedTask] = useState<any>(null)

  const weeklyStats = {
    current: 22,
    target: 30,
    streak: 3,
  }

  const dailyTasks = [
    {
      id: 1,
      title: "Morning Movement",
      description: "Complete your daily mobility routine",
      points: 5,
      status: "completed",
      category: "Exercise",
      timeEstimate: "15 min",
    },
    {
      id: 2,
      title: "Pain Assessment",
      description: "Rate your current pain levels",
      points: 2,
      status: "completed",
      category: "Assessment",
      timeEstimate: "3 min",
    },
    {
      id: 3,
      title: "Mindfulness Session",
      description: "Complete guided breathing exercise",
      points: 3,
      status: "pending",
      category: "Mental Health",
      timeEstimate: "10 min",
    },
    {
      id: 4,
      title: "Progress Photo",
      description: "Take your weekly progress photo",
      points: 2,
      status: "pending",
      category: "Tracking",
      timeEstimate: "2 min",
    },
  ]

  const achievements = [
    {
      title: "Week Warrior",
      description: "Complete all daily tasks for 7 days",
      progress: 5,
      target: 7,
      points: 15,
      icon: Trophy,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Consistency King",
      description: "Maintain a 30-day streak",
      progress: 3,
      target: 30,
      points: 25,
      icon: Flame,
      color: "text-orange-600 bg-orange-100",
    },
    {
      title: "Assessment Ace",
      description: "Complete 10 assessments",
      progress: 7,
      target: 10,
      points: 20,
      icon: Target,
      color: "text-accent bg-accent/10",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-4">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recovery Points</h1>
            <p className="text-gray-600">Complete tasks to earn points and unlock achievements</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Weekly Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <Star className="w-8 h-8 text-teal-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-teal-600 mb-1">{weeklyStats.current}</div>
              <div className="text-gray-600">Points This Week</div>
              <div className="text-sm text-gray-500 mt-1">{weeklyStats.target - weeklyStats.current} to goal</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <Flame className="w-8 h-8 text-orange-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-orange-600 mb-1">{weeklyStats.streak}</div>
              <div className="text-gray-600">Day Streak</div>
              <div className="text-sm text-gray-500 mt-1">Keep it going!</div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <Calendar className="w-8 h-8 text-primary mx-auto mb-2" />
              <div className="text-3xl font-bold text-primary mb-1">73%</div>
              <div className="text-gray-600">Weekly Progress</div>
              <div className="text-sm text-gray-500 mt-1">Great progress!</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Daily Tasks */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Today's Tasks</h2>
              <div className="space-y-4">
                {dailyTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-teal-200 cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => setSelectedTask(task)}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        task.status === "completed" ? "bg-emerald-500" : "bg-gray-300"
                      }`}
                    >
                      {task.status === "completed" && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.title}</h3>
                      <p className="text-sm text-gray-600">{task.description}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <span className="text-xs text-gray-500">{task.timeEstimate}</span>
                        <span className="text-xs font-medium text-teal-600">+{task.points} pts</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements</h2>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className={`p-2 rounded-lg ${achievement.color}`}>
                        <achievement.icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 mr-4">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-gradient-to-r from-teal-500 to-teal-600 h-2 rounded-full"
                                style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {achievement.progress}/{achievement.target}
                            </div>
                          </div>
                          <span className="text-sm font-medium text-teal-600">+{achievement.points} pts</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  )
}
