"use client"

import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { MovementSessionCard } from "./MovementSessionCard"
import { PainAssessmentCard } from "./PainAssessmentCard"
import { MindfulnessSessionCard } from "./MindfulnessSessionCard"
import { RecoveryInsightsCard } from "./RecoveryInsightsCard"

interface TodaysTasksSectionProps {
  onTaskClick: (task: any) => void
  onTaskComplete?: (taskData: any) => void
}

export function TodaysTasksSection({ onTaskClick, onTaskComplete }: TodaysTasksSectionProps) {
  const [patientData, setPatientData] = useState<any>(null)
  const [patientId, setPatientId] = useState<string>("testback@example.com") // Use working patient with correct region
  const [movementSessionCompleted, setMovementSessionCompleted] = useState(false)
  const [completedTaskIds, setCompletedTaskIds] = useState<Set<string>>(new Set())

  // Load patient data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('btl_patient_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) {
          setPatientId(parsed.email);
          setPatientData(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading patient data:', error);
    }
  }, []);

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
    points: 2,
    time: "2 min",
  };

  // Calculate completion stats
  const totalTasks = 4; // Movement + 3 other tasks
  const completedTasks = (movementSessionCompleted ? 1 : 0) + completedTaskIds.size;
  const remainingTasks = totalTasks - completedTasks;

  // Load movement session completion from localStorage
  useEffect(() => {
    let email = patientId;
    try {
      const stored = localStorage.getItem('btl_patient_data');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.email) email = parsed.email;
      }
    } catch {}
    
    const today = new Date().toISOString().slice(0, 10);
    const key = `movementSessionCompleted_${email}_${today}`;
    const completed = localStorage.getItem(key) === 'true';
    setMovementSessionCompleted(completed);
  }, [patientId]);

  const handleTaskClick = (task: any) => {
    onTaskClick({
      ...task,
      onTaskComplete: (taskData: any) => {
        console.log('🎯 Task completed in section:', taskData)
        
        // Mark task as completed using proper state update
        setCompletedTaskIds(prev => new Set([...prev, task.id]));
        
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
        let email = patientId;
        try {
          const stored = localStorage.getItem('btl_patient_data');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.email) email = parsed.email;
          }
        } catch {}
        const today = new Date().toISOString().slice(0, 10);
        const key = `movementSessionCompleted_${email}_${today}`;
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Movement Session Card */}
        <div className={`relative min-h-[340px] min-w-[260px] ${movementSessionCompleted ? 'opacity-60 grayscale pointer-events-none' : ''}`}> 
          <MovementSessionCard 
            patientId={patientId} 
            onClick={handleMovementSessionClick} 
          />
          {movementSessionCompleted && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/80 rounded-2xl w-full h-full flex items-center justify-center">
                <Check className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
          )}
        </div>
        
        {/* Pain Assessment Card */}
        <div className={`relative min-h-[340px] min-w-[260px] ${completedTaskIds.has('pain-assessment') ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
          <PainAssessmentCard 
            patientId={patientId} 
            onClick={() => !completedTaskIds.has('pain-assessment') && handleTaskClick(painAssessmentTask)}
            isOpen={true}
          />
          {completedTaskIds.has('pain-assessment') && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/80 rounded-2xl w-full h-full flex items-center justify-center">
                <Check className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
          )}
        </div>

        {/* Mindfulness Session Card */}
        <div className={`relative min-h-[340px] min-w-[260px] ${completedTaskIds.has('mindfulness-session') ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
          <MindfulnessSessionCard 
            patientId={patientId} 
            onClick={() => !completedTaskIds.has('mindfulness-session') && handleTaskClick(mindfulnessTask)}
            isOpen={true}
          />
          {completedTaskIds.has('mindfulness-session') && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/80 rounded-2xl w-full h-full flex items-center justify-center">
                <Check className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
          )}
        </div>

        {/* Recovery Insights Card */}
        <div className={`relative min-h-[340px] min-w-[260px] ${completedTaskIds.has('recovery-insights') ? 'opacity-60 grayscale pointer-events-none' : ''}`}>
          <RecoveryInsightsCard 
            patientId={patientId} 
            onClick={() => !completedTaskIds.has('recovery-insights') && handleTaskClick(recoveryInsightsTask)}
            isOpen={true}
          />
          {completedTaskIds.has('recovery-insights') && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="bg-white/80 rounded-2xl w-full h-full flex items-center justify-center">
                <Check className="w-16 h-16 text-emerald-500" />
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Summary */}
    </div>
  )
}

