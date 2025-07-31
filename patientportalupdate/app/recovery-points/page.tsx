"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Heart, Zap, Calendar, Check, BarChart3, TrendingUp } from "lucide-react"
import { weeklyTargets } from "@/config/recoveryPointsConfig"
import { MovementSessionDialog } from "@/components/MovementSessionDialog";
import { PainStressCheckDialog } from "@/components/PainStressCheckDialog";
import { MindfulnessSessionDialog } from "@/components/MindfulnessSessionDialog";
import { RecoveryInsightDialog } from "@/components/RecoveryInsightDialog";
import { useAuth } from "@/hooks/useAuth";

export default function RecoveryPointsPage() {
  const router = useRouter()
  // Use proper authentication
  const { patient, loading: authLoading, isAuthenticated } = useAuth()
  
  const [showInsights, setShowInsights] = useState(false)
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(false)

  // Real patient data state
  const [weeklyStats, setWeeklyStats] = useState({
    current: 0,
    target: weeklyTargets.total,
    streak: 0,
  })

  const [srsDomainData, setSrsDomainData] = useState({
    currentWeek: {
      pain: 5,
      function: 5,
      disability: 50,
      confidence: 5
    },
    lastWeek: {
      pain: 5,
      function: 5,
      disability: 50,
      confidence: 5
    }
  })

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
          <p className="text-btl-600">Loading recovery points...</p>
        </div>
      </div>
    )
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated || !patient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-btl-50 to-btl-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-btl-900 mb-4">Please log in to continue</h1>
          <p className="text-btl-600">Authentication is required to access your recovery points.</p>
        </div>
      </div>
    )
  }

  // Task-driven "Biggest Win" logic
  const [taskStats, setTaskStats] = useState({
    biggestWin: {
      bucket: null,
      thisWeek: 0,
      delta: 0
    }
  })

  // Real task completion data from backend
  const [taskCompletionData, setTaskCompletionData] = useState<Record<string, Record<string, number>>>({
    thisWeek: {
      MOVEMENT: 0,
      PAIN_ASSESSMENT: 0,
      MINDFULNESS: 0,
      RECOVERY_INSIGHTS: 0
    },
    lastWeek: {
      MOVEMENT: 0,
      PAIN_ASSESSMENT: 0,
      MINDFULNESS: 0,
      RECOVERY_INSIGHTS: 0
    }
  })

  // Fetch real task completion data
  useEffect(() => {
    const fetchTaskStats = async () => {
      if (!patient.email) {
        console.log('ℹ️ No valid patient email, skipping task stats fetch')
        return
      }
      
      try {
        console.log('🔄 Fetching task completion stats for:', patient.email)
        
        // Get patient data first to get patient ID
        const patientResponse = await fetch(`/api/patients/portal-data/${patient.email}`)
        if (!patientResponse.ok) {
          console.log('❌ Patient not found, skipping task stats fetch')
          return
        }
        
        const patientResult = await patientResponse.json()
        const patientDbId = patientResult.data.patient.id
        
        // Get task completion statistics
        const taskStatsResponse = await fetch(`/api/recovery-points/task-stats/${patientDbId}`)
        if (taskStatsResponse.ok) {
          const taskStatsData = await taskStatsResponse.json()
          console.log('📊 Task completion stats:', taskStatsData.data)
          
          setTaskCompletionData({
            thisWeek: taskStatsData.data.thisWeek,
            lastWeek: taskStatsData.data.lastWeek
          })
          
          setTaskStats({
            biggestWin: taskStatsData.data.biggestWin
          })
        } else {
          console.log('⚠️ Could not fetch task stats, using default data')
        }
        
      } catch (error) {
        console.error('❌ Error fetching task completion stats:', error)
        // Keep default values on error
      }
    }

    fetchTaskStats()
  }, [patient.email])

  // Calculate task completion deltas
  const calculateTaskDeltas = () => {
    const buckets = ['MOVEMENT', 'PAIN_ASSESSMENT', 'MINDFULNESS', 'RECOVERY_INSIGHTS']
    const deltas = buckets.map(bucket => ({
      bucket,
      thisWeek: taskCompletionData.thisWeek[bucket] || 0,
      lastWeek: taskCompletionData.lastWeek[bucket] || 0,
      delta: (taskCompletionData.thisWeek[bucket] || 0) - (taskCompletionData.lastWeek[bucket] || 0)
    }))

    // Find the bucket with the highest positive delta
    const bestTaskImprovement = deltas
      .filter(item => item.delta > 0)
      .sort((a, b) => b.delta - a.delta)[0]

    return { bestTaskImprovement, allDeltas: deltas }
  }

  const { bestTaskImprovement } = calculateTaskDeltas()

  // Task bucket icons and names
  const taskBucketInfo: Record<string, { icon: string; name: string }> = {
    MOVEMENT: { icon: '🏋️', name: 'Movement' },
    PAIN_ASSESSMENT: { icon: '📝', name: 'Pain Assessment' },
    MINDFULNESS: { icon: '🧘', name: 'Mindfulness' },
    RECOVERY_INSIGHTS: { icon: '💡', name: 'Recovery Insights' }
  }

  // Determine the achievement content based on task completion data
  const getBiggestWinContent = () => {
    if (!bestTaskImprovement) {
      return {
        title: "Biggest Win This Week",
        description: "Let's log a Mindfulness or Movement session to spark a win!",
        points: 0,
        badgeClass: "badge-none",
        progress: 0,
        showProgress: false
      }
    }

    const bucketInfo = taskBucketInfo[bestTaskImprovement.bucket]
    return {
      title: "Biggest Win This Week",
      description: `${bucketInfo.icon} ${bucketInfo.name} up by ${bestTaskImprovement.delta} sessions`,
      points: Math.min(5, bestTaskImprovement.delta + 1), // 1 point per session improvement, max 5
      badgeClass: bestTaskImprovement.delta >= 3 ? "badge-gold" : bestTaskImprovement.delta >= 2 ? "badge-silver" : "badge-bronze",
      progress: Math.min(100, bestTaskImprovement.thisWeek * 20), // Progress based on this week's sessions
      showProgress: true
    }
  }

  const biggestWinData = getBiggestWinContent()

  // Daily tasks with real data integration and proper points from config
  const dailyTasks = [
    {
      id: 1,
      title: "Morning Movement",
      points: 9, // Usually 3 exercises × 3 points each = 9-12 points
      icon: Zap,
      timeEstimate: "15 min",
    },
    {
      id: 2,
      title: "Pain Assessment", 
      points: 3, // Form submitted on time from rpActions.ADHERENCE
      icon: Heart,
      timeEstimate: "3 min",
    },
    {
      id: 3,
      title: "Mindfulness Session",
      points: 5, // 5-min mindfulness from rpActions.MINDSET
      icon: Check,
      timeEstimate: "5 min",
    },
    {
      id: 4,
      title: "Recovery Insights",
      points: 5, // Watch micro-lesson from rpActions.EDUCATION
      icon: BarChart3,
      timeEstimate: "2 min",
    },
  ]

  // Helper function to get task badge colors based on points (gold/silver/bronze logic)
  const getTaskBadgeColor = (points: number, isCompleted: boolean) => {
    if (isCompleted) {
      return "bg-gradient-to-br from-emerald-100 to-emerald-200 text-emerald-700 border border-emerald-300"
    }
    
    // Use achievement logic: 5+ points = gold, 3-4 points = silver, 1-2 points = bronze
    if (points >= 5) {
      return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 shadow-md border border-yellow-600" // Gold
    } else if (points >= 3) {
      return "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-md border border-gray-500" // Silver
    } else {
      return "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 shadow-md border border-orange-600" // Bronze
    }
  }

  // Dashboard-style achievements with real data
  const achievements = [
    {
      icon: Zap,
      title: "Daily Streak",
      description: `${weeklyStats.streak} days`,
      points: weeklyStats.streak >= 7 ? 5 : weeklyStats.streak >= 3 ? 3 : weeklyStats.streak >= 1 ? 1 : 0,
      badgeClass: weeklyStats.streak >= 7 ? "badge-gold" : weeklyStats.streak >= 3 ? "badge-silver" : weeklyStats.streak >= 1 ? "badge-bronze" : "badge-none",
      iconColor: "#B8860B",
      progress: Math.round((weeklyStats.streak / 7) * 100),
    },
    {
      icon: Heart,
      title: "Movement Goals",
      description: `${Math.floor(weeklyStats.current * 0.4)}/60 pts`, // Estimate movement points
      points: Math.floor(weeklyStats.current / 20),
      badgeClass: weeklyStats.current >= 50 ? "badge-gold" : weeklyStats.current >= 30 ? "badge-silver" : "badge-bronze",
      iconColor: "#B8860B",
      progress: Math.round((weeklyStats.current / 60) * 100),
    },
    {
      icon: TrendingUp,
      title: biggestWinData.title,
      description: biggestWinData.description,
      points: biggestWinData.points,
      badgeClass: biggestWinData.badgeClass,
      iconColor: "#B8860B",
      progress: biggestWinData.progress,
      showProgress: biggestWinData.showProgress,
    },
  ];

  // Helper function to get badge colors (matching other components)
  // All achievement pills use the same blue ombre gradient as the dashboard
  const getBadgeColor = (_badgeClass: string) => {
    return "bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 text-white shadow-md border border-btl-600";
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

  const progressPercentage = Math.min(100, Math.round((weeklyStats.current / weeklyStats.target) * 100))

  // Modal state for which task is open
  const [openTask, setOpenTask] = useState<string | null>(null);

  // Handle task completion
  const handleTaskComplete = async (taskData: any) => {
    console.log('🎯 Task completed:', taskData);
    
    // Mark task as completed locally
    setCompletedTaskIds(prev => new Set([...prev, taskData.taskId || 1]));
    setOpenTask(null);
    
    // Record task completion in backend
    if (patient.email) {
      try {
        // Get patient data to get patient ID
        const patientResponse = await fetch(`/api/patients/portal-data/${patient.email}`)
        if (patientResponse.ok) {
          const patientResult = await patientResponse.json()
          const patientDbId = patientResult.data.patient.id
          
          // Map task type to backend enum
          let taskType = 'MOVEMENT'
          if (taskData.taskTitle === 'Pain Assessment') taskType = 'PAIN_ASSESSMENT'
          else if (taskData.taskTitle === 'Mindfulness Session') taskType = 'MINDFULNESS'
          else if (taskData.taskTitle === 'Recovery Insights') taskType = 'RECOVERY_INSIGHTS'
          
          // Record task completion
          await fetch('/api/recovery-points/task-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: patientDbId,
              taskType: taskType,
              sessionDuration: taskData.duration || null,
              pointsEarned: taskData.pointsEarned || null
            }),
          })
          
          console.log(`✅ Task completion recorded: ${taskType}`)
          
          // Refresh task stats to update "Biggest Win This Week"
          const taskStatsResponse = await fetch(`/api/recovery-points/task-stats/${patientDbId}`)
          if (taskStatsResponse.ok) {
            const taskStatsData = await taskStatsResponse.json()
            setTaskCompletionData({
              thisWeek: taskStatsData.data.thisWeek,
              lastWeek: taskStatsData.data.lastWeek
            })
            setTaskStats({
              biggestWin: taskStatsData.data.biggestWin
            })
          }
        }
      } catch (error) {
        console.error('❌ Error recording task completion:', error)
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-teal-50">
      {/* Header with BackToLife gradient */}
      <div className="back-to-life-gradient px-6 py-8 rounded-t-2xl shadow-xl flex items-center gap-4">
        <div className="w-14 h-14 flex items-center justify-center">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-white mb-1">Recovery Points</h1>
          <p className="text-white/90 text-lg">Complete tasks to earn points and unlock achievements</p>
        </div>
        <button 
          onClick={() => router.back()} 
          className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Stat Cards with BackToLife theme */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-btl-500 to-btl-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">{weeklyStats.current}</div>
              <div className="text-btl-600 font-medium">Points This Week</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-btl-600 to-btl-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">{weeklyStats.streak}</div>
              <div className="text-btl-600 font-medium">Day Streak</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-btl-600 to-btl-700 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold gradient-text mb-1">{progressPercentage}%</div>
              <div className="text-btl-600 font-medium">Weekly Progress</div>
            </div>
          </div>
          
          {/* Weekly Progress Bar with BackToLife theme */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-btl-600" />
                <span className="gradient-text font-bold text-lg">Weekly Goal Progress</span>
              </div>
              <span className="text-btl-600 font-bold text-lg">{weeklyStats.current}/{weeklyStats.target} pts</span>
            </div>
            <div className="w-full bg-btl-100 rounded-full h-4 overflow-hidden">
              <div
                className="back-to-life-gradient h-4 rounded-full transition-all duration-1000 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center">
              <span className="text-btl-600 font-medium text-sm">
                {weeklyStats.target - weeklyStats.current} points to reach your weekly goal!
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Daily Tasks with BackToLife theme */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <Check className="w-6 h-6 text-btl-600" />
                <h2 className="text-xl font-bold gradient-text">Today's Tasks</h2>
              </div>
              <div className="space-y-4">
                {dailyTasks.map((task) => {
                  const isCompleted = completedTaskIds.has(task.id)
                  return (
                  <div
                    key={task.id}
                      className={`relative flex items-center space-x-4 p-4 border border-btl-200 rounded-xl transition-all duration-200 group ${isCompleted ? 'opacity-60 grayscale pointer-events-none' : 'hover:bg-btl-50 hover:border-btl-300 hover:shadow-md cursor-pointer'}`}
                      onClick={() => {
                        if (isCompleted) return;
                        if (task.title === "Morning Movement") setOpenTask("movement");
                        else if (task.title === "Pain Assessment") setOpenTask("pain");
                        else if (task.title === "Mindfulness Session") setOpenTask("mindfulness");
                        else if (task.title === "Recovery Insights") setOpenTask("insights");
                      }}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                        isCompleted
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600"
                          : "bg-gradient-to-br from-btl-500 to-btl-700"
                      }`}>
                      <task.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-semibold text-btl-900 group-hover:text-btl-700 transition-colors duration-200">{task.title}</h3>
                        <p className="text-btl-600 text-sm">{task.timeEstimate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full font-bold text-sm transition-all duration-200 ${getTaskBadgeColor(task.points, isCompleted)}`}>
                        +{task.points} pts
                      </span>
                      {isCompleted && (
                        <div className="absolute inset-0 flex items-center justify-center z-10">
                          <div className="bg-white/80 rounded-xl w-full h-full flex items-center justify-center">
                            <Check className="w-16 h-16 text-emerald-500" />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
              {/* Exact same dialogs as dashboard */}
              <MovementSessionDialog
                open={openTask === "movement"}
                onClose={() => setOpenTask(null)}
                patientId={patient.email}
                onTaskComplete={handleTaskComplete}
              />
              <PainStressCheckDialog
                open={openTask === "pain"}
                onOpenChange={(open) => !open && setOpenTask(null)}
                patientId={patient.email}
                onComplete={(data: any) => {
                  console.log('Pain & stress check-in completed:', data)
                  setOpenTask(null)
                }}
                onTaskComplete={handleTaskComplete}
              />
              <MindfulnessSessionDialog
                open={openTask === "mindfulness"}
                onOpenChange={(open) => !open && setOpenTask(null)}
                patientId={patient.email}
                onTaskComplete={handleTaskComplete}
              />
              <RecoveryInsightDialog
                open={openTask === "insights"}
                onOpenChange={(open) => !open && setOpenTask(null)}
                patientId={patient.email}
                onComplete={(data: any) => {
                  console.log('Recovery insight completed:', data)
                  setOpenTask(null)
                }}
                onTaskComplete={handleTaskComplete}
                snapshot={{ pain: 5, stress: 5, risk: 'low' }}
                painDelta={0}
                stressDelta={0}
                showActionPrompt={false}
              />
            </div>

            {/* Achievements with BackToLife theme */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="flex items-center space-x-2 mb-6">
                <BarChart3 className="w-6 h-6 text-btl-600" />
                <h2 className="text-xl font-bold gradient-text">Achievements</h2>
              </div>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 rounded-xl border border-gray-200 bg-white"
                  >
                    <achievement.icon className="w-5 h-5" style={{ color: achievement.iconColor, background: 'none', boxShadow: 'none' }} />
                     <div className="flex-1">
                      <div className="font-semibold text-charcoal-900 text-sm">{achievement.title}</div>
                      <div className="text-charcoal-600 text-xs px-3 py-1 rounded-full bg-gray-100 inline-block mb-2">{achievement.description}</div>
                      {achievement.showProgress !== false && (
                        <div className="w-full bg-charcoal-200 rounded-full h-2 mb-2">
                          <div
                            className="back-to-life-gradient h-2 rounded-full transition-all duration-700"
                            style={{ width: `${achievement.progress}%` }}
                         ></div>
                       </div>
                      )}
                    </div>
                    <div className="text-right flex flex-col items-end space-y-1">
                      <span className={`px-4 py-1 rounded-full font-bold text-xs ${getBadgeColor(achievement.badgeClass)} transform hover:scale-105 transition-transform duration-200`}>
                        +{achievement.points}
                      </span>
                      {achievement.showProgress && (
                        <div className="text-xs font-medium text-charcoal-500 bg-gray-100 px-3 py-1 rounded-full inline-block">{achievement.progress > 0 ? `${achievement.progress}%` : '0%'}</div>
                      )}
                     </div>
                   </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} /> */}
    </div>
  )
}
