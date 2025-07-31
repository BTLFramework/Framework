"use client"

import React, { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { MovementSessionCard } from "./MovementSessionCard"
import { PainAssessmentCard } from "./PainAssessmentCard"
import { MindfulnessSessionCard } from "./MindfulnessSessionCard"
import { RecoveryInsightsCard } from "./RecoveryInsightsCard"
import { useAuth } from "@/hooks/useAuth"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
  onTaskComplete?: (taskData: any) => void
  refreshKey?: number
}

export function TodaysTasksSection({ onTaskClick, onTaskComplete, refreshKey }: TodaysTasksSectionProps) {
  // Use proper authentication
  const { patient, loading: authLoading, isAuthenticated } = useAuth()
  
  const [movementSessionCompleted, setMovementSessionCompleted] = useState(false)
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set())

  // Show loading state while authenticating
  if (authLoading) {
    return (
      <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200 animate-pulse">
        <div className="h-6 bg-btl-200 rounded mb-4 w-32"></div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-80 bg-btl-200 rounded-2xl"></div>
          ))}
        </div>
      </div>
    )
  }

  // Show message if not authenticated
  if (!isAuthenticated || !patient) {
    return (
      <div className="card-gradient rounded-xl shadow-lg p-6 border border-btl-200">
        <h2 className="text-xl font-semibold gradient-text mb-4">Today's Tasks</h2>
        <p className="text-btl-600">Please log in to view your daily tasks.</p>
      </div>
    )
  }

  // Define metallic pill classes
  const metallicPills = {
    gold: 'bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow border border-yellow-500',
    silver: 'bg-gradient-to-r from-gray-300 via-gray-400 to-gray-500 text-gray-900 shadow border border-gray-400',
    bronze: 'bg-gradient-to-r from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142]',
  };

  // Define task data for the three cards
  const painAssessmentTask = {
    id: "pain-assessment",
    title: "Pain Assessment",
    description: "Rate your current pain levels and track patterns",
    points: 3,
    time: "3 min",
  };

  const mindfulnessTask = {
    id: "mindfulness-session", 
    title: "Mindfulness Session",
    description: "Complete guided breathing exercise for mental wellness",
    points: 5,
    time: "10 min",
  };

  const recoveryInsightsTask = {
    id: "recovery-insights",
    title: "Recovery Insights", 
    description: "View your risk profile and recovery progress",
    points: 5,
    time: "2 min",
  };

  // Calculate completion stats
  const totalTasks = 4; // Movement + 3 other tasks
  const completedTasks = completedTaskIds.size;
  const remainingTasks = totalTasks - completedTasks;

  // Load movement session completion from localStorage
  useEffect(() => {
    if (!patient?.email) return;
    
    const today = new Date().toISOString().slice(0, 10);
    const key = `movementSessionCompleted_${patient.email}_${today}`;
    const completed = localStorage.getItem(key) === 'true';
    setMovementSessionCompleted(completed);
  }, [patient.email]);

  // Load task completion status from backend
  useEffect(() => {
    const loadTaskCompletionStatus = async () => {
      if (!patient?.email) return;
      
      try {
        // Get patient data to get patient ID
        const patientResponse = await fetch(`/api/patients/portal-data/${patient.email}`);
        if (!patientResponse.ok) return;
        
        const patientData = await patientResponse.json();
        const patientId = patientData.data.patient.id;
        
        // Get task completion stats for today
        const taskStatsResponse = await fetch(`/api/recovery-points/task-stats/${patientId}`);
        if (taskStatsResponse.ok) {
          const taskStats = await taskStatsResponse.json();
          const today = new Date().toISOString().slice(0, 10);
          
          // Check if tasks were completed today
          const completedToday = new Set<string>();
          
          // Check each task type for today's completion
          if (taskStats.data?.thisWeek?.MOVEMENT > 0) {
            completedToday.add('movement-session');
          }
          if (taskStats.data?.thisWeek?.PAIN_ASSESSMENT > 0) {
            completedToday.add('pain-assessment');
          }
          if (taskStats.data?.thisWeek?.MINDFULNESS > 0) {
            completedToday.add('mindfulness-session');
          }
          if (taskStats.data?.thisWeek?.RECOVERY_INSIGHTS > 0) {
            completedToday.add('recovery-insights');
          }
          
          setCompletedTaskIds(completedToday);
          console.log('✅ Loaded task completion status:', completedToday);
        }
      } catch (error) {
        console.error('❌ Error loading task completion status:', error);
      }
    };

    loadTaskCompletionStatus();
  }, [patient?.email, refreshKey]);

  const handleTaskClick = (task: any) => {
    onTaskClick({
      ...task,
      onTaskComplete: (taskData: any) => {
        console.log('🎯 Task completed in section:', taskData)
        
        // Mark task as completed using proper state update
        setCompletedTaskIds(prev => new Set([...prev, task.id]));
        
        // Trigger a refresh of the task completion status
        setTimeout(() => {
          const loadTaskCompletionStatus = async () => {
            if (!patient?.email) return;
            
            try {
              const patientResponse = await fetch(`/api/patients/portal-data/${patient.email}`);
              if (!patientResponse.ok) return;
              
              const patientData = await patientResponse.json();
              const patientId = patientData.data.patient.id;
              
              const taskStatsResponse = await fetch(`/api/recovery-points/task-stats/${patientId}`);
              if (taskStatsResponse.ok) {
                const taskStats = await taskStatsResponse.json();
                const completedToday = new Set<string>();
                
                if (taskStats.data?.thisWeek?.MOVEMENT > 0) {
                  completedToday.add('movement-session');
                }
                if (taskStats.data?.thisWeek?.PAIN_ASSESSMENT > 0) {
                  completedToday.add('pain-assessment');
                }
                if (taskStats.data?.thisWeek?.MINDFULNESS > 0) {
                  completedToday.add('mindfulness-session');
                }
                if (taskStats.data?.thisWeek?.RECOVERY_INSIGHTS > 0) {
                  completedToday.add('recovery-insights');
                }
                
                setCompletedTaskIds(completedToday);
                console.log('✅ Refreshed task completion status:', completedToday);
              }
            } catch (error) {
              console.error('❌ Error refreshing task completion status:', error);
            }
          };
          
          loadTaskCompletionStatus();
        }, 1000); // Wait 1 second for backend to process
        
        if (onTaskComplete) {
          onTaskComplete(taskData)
        }
      }
    })
  }

  const handleMovementSessionClick = () => {
    onTaskClick({
      id: "movement-session",
      title: "Movement Session",
      onTaskComplete: (taskData: any) => {
        // Persist completion in localStorage
        if (!patient?.email) return;
        const today = new Date().toISOString().slice(0, 10);
        const key = `movementSessionCompleted_${patient.email}_${today}`;
        localStorage.setItem(key, 'true');
        setMovementSessionCompleted(true);
        if (onTaskComplete) {
          onTaskComplete(taskData)
        }
      }
    })
  }

  // Helper function to get badge colors
  const getBadgeColor = (badgeClass: string) => {
    switch (badgeClass) {
      case "badge-gold":
        return "bg-gradient-to-br from-yellow-400 to-yellow-600 text-yellow-950 shadow-md border border-yellow-600"
      case "badge-silver":
        return "bg-gradient-to-br from-gray-300 to-gray-500 text-gray-900 shadow-md border border-gray-500"
      case "badge-bronze":
        return "bg-gradient-to-br from-orange-400 to-orange-600 text-orange-950 shadow-md border border-orange-600"
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

  return (
    <div className="bg-btl-50 rounded-2xl p-8">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold gradient-text">Today's Recovery Tasks</h2>
        <div className="flex flex-col items-end space-y-1">
          <div className="flex items-center space-x-3 text-base font-semibold">
            <span className="flex items-center gap-1 text-btl-600">
              <span className="w-3 h-3 bg-btl-600 rounded-full inline-block mr-1"></span>
              {completedTasks} completed
            </span>
            <span className="flex items-center gap-1 text-btl-400">
              <span className="w-3 h-3 bg-btl-200 rounded-full inline-block mr-1"></span>
              {remainingTasks} remaining
            </span>
          </div>
          {/* Progress Bar */}
          <div className="w-40 h-2 bg-btl-100 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-gradient-to-r from-btl-500 to-btl-600 rounded-full transition-all duration-700" style={{ width: `${Math.round((completedTasks / totalTasks) * 100)}%` }}></div>
          </div>
        </div>
      </div>

      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
        {/* Movement Session Card */}
        <div className={`relative min-h-[340px] max-w-[300px] ${completedTaskIds.has('movement-session') ? 'opacity-80' : ''}`}> 
          <MovementSessionCard 
            onClick={handleMovementSessionClick} 
          />
          {completedTaskIds.has('movement-session') && (
            <>
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-emerald-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  Completed Today
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Pain Assessment Card */}
        <div className={`relative min-h-[340px] max-w-[300px] ${completedTaskIds.has('pain-assessment') ? 'opacity-80' : ''}`}>
          <PainAssessmentCard 
            patientId={patient.email} 
            onClick={() => handleTaskClick(painAssessmentTask)}
            isOpen={true}
          />
          {completedTaskIds.has('pain-assessment') && (
            <>
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-emerald-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  Completed Today
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mindfulness Session Card */}
        <div className={`relative min-h-[340px] max-w-[300px] ${completedTaskIds.has('mindfulness-session') ? 'opacity-80' : ''}`}>
          <MindfulnessSessionCard 
            patientId={patient.email} 
            onClick={() => handleTaskClick(mindfulnessTask)}
            isOpen={true}
          />
          {completedTaskIds.has('mindfulness-session') && (
            <>
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-emerald-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  Completed Today
                </div>
              </div>
            </>
          )}
        </div>

        {/* Recovery Insights Card */}
        <div className={`relative min-h-[340px] max-w-[300px] ${completedTaskIds.has('recovery-insights') ? 'opacity-80' : ''}`}>
          <RecoveryInsightsCard 
            patientId={patient.email} 
            onClick={() => handleTaskClick(recoveryInsightsTask)}
            isOpen={true}
          />
          {completedTaskIds.has('recovery-insights') && (
            <>
              <div className="absolute top-2 right-2 z-10">
                <div className="bg-emerald-500 text-white rounded-full p-1">
                  <Check className="w-4 h-4" />
                </div>
              </div>
              <div className="absolute bottom-2 left-2 z-10">
                <div className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded-full font-medium">
                  Completed Today
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Progress Summary */}
    </div>
  )
}

