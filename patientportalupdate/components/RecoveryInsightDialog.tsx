"use client"

import { useState, useEffect } from "react";
import { Heart, Smile, Frown, Meh, Angry, Plus, Info, CheckCircle, Target, Activity, Gauge, Play, Headphones, Award, Brain, TrendingUp, TrendingDown, Minus, AlertTriangle, Eye, BarChart3, Lock, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";
import { Badge } from "@/components/ui/badge";
import { insightLibrary } from "@/lib/InsightLibrary";
import InsightDialog from "./InsightDialog";
import type { RecoveryInsight } from "@/types/recovery";
import type { Insight } from "@/lib/InsightLibrary";
import { addDays, startOfDay, differenceInCalendarDays } from 'date-fns';

interface RecoveryInsightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onComplete?: (data: any) => void;
  onTaskComplete?: (taskData: any) => void;
  snapshot: {
    pain: number;
    stress: number;
    risk: string;
  };
  painDelta: number;
  stressDelta: number;
  showActionPrompt: boolean;
  actionPrompt?: {
    title: string;
    action: string;
    buttonText: string;
  };
}

export function RecoveryInsightDialog({ 
  open, 
  onOpenChange, 
  patientId,
  onComplete, 
  onTaskComplete,
  snapshot, 
  painDelta, 
  stressDelta, 
  showActionPrompt, 
  actionPrompt 
}: RecoveryInsightDialogProps) {
  const [selectedInsightId, setSelectedInsightId] = useState<number | null>(null);
  const [showInsightDialog, setShowInsightDialog] = useState(false);
  const [actionTaken, setActionTaken] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [completedInsights, setCompletedInsights] = useState<number[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [dailyCompletedInsights, setDailyCompletedInsights] = useState<number>(0);
  
  // Debug mode: Check for ?unlockInsights=1 in URL
  const [debugUnlockAll, setDebugUnlockAll] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const unlockParam = params.get('unlockInsights');
      const shouldUnlock = unlockParam === '1';
      console.log('🔓 Debug unlock check:', { unlockParam, shouldUnlock, url: window.location.href });
      setDebugUnlockAll(shouldUnlock);
    }
  }, []);

  // Load completed insights from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('btl_completed_insights');
      if (stored) {
        const parsed = JSON.parse(stored);
        setCompletedInsights(parsed);
        console.log('🎯 Loaded completed insights from localStorage:', parsed);
      }
    } catch (error) {
      console.error('Error loading completed insights:', error);
    }
  }, [open]); // Re-load when dialog opens

  // Fetch patient data to get correct SRS score
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/portal-data/${patientId}`);
        if (response.ok) {
          const result = await response.json();
          setPatientData(result.data);
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (open && patientId) {
      fetchPatientData();
    }
  }, [open, patientId]);

  // Get actual patient data instead of hardcoded values
  const srsScore = patientData?.srsScore || 0;
  const phaseLabel = patientData?.phase || "EDUCATE";
  const regionLabel = "Lower back"; // This could also come from patient data if needed

  const canSubmit = selectedInsightId !== null || actionTaken;

  // Calculate total points (same formula as other dialogs)
  const totalPoints = 5; // 5 points per insight completion

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="w-4 h-4 text-red-500" />;
    if (delta < 0) return <TrendingDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'med': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleActionPrompt = () => {
    setActionTaken(true);
    // This would typically open the mindfulness session with mindshift track
    console.log("Action taken: Opening MindShift session...");
  };

  const handleInsightSelect = (insightId: number) => {
    console.log('🎯 Insight selected:', insightId, 'patientId:', patientId);
    setSelectedInsightId(insightId);
    setShowInsightDialog(true);
  };

  const handleInsightComplete = (insightId: number, points?: number) => {
    console.log('🎯 handleInsightComplete called with:', { insightId, points });
    console.log('🎯 THIS SHOULD APPEAR WHEN INSIGHT IS COMPLETED');
    
    setCompletedInsights(prev => {
      console.log('🎯 Previous completed insights:', prev);
      if (!prev.includes(insightId)) {
        const newCompleted = [...prev, insightId];
        localStorage.setItem('btl_completed_insights', JSON.stringify(newCompleted));
        console.log('🎯 Updated completed insights:', newCompleted);
        return newCompleted;
      }
      console.log('🎯 Insight already completed, no change');
      return prev;
    });
  };

  const handleCloseInsightDialog = () => {
    setShowInsightDialog(false);
    setSelectedInsightId(null);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get patient data to get numeric ID
      const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`)
      if (!patientResponse.ok) {
        throw new Error('Failed to get patient data')
      }
      const patientData = await patientResponse.json()
      const numericPatientId = patientData.data.patient.id
      
      // Add recovery points for the completed insight
      const result = await addRecoveryPoints(
        numericPatientId.toString(),
        'EDUCATION',
        'Watch micro-lesson',
        totalPoints
      );
      
      if (result.success) {
        console.log('✅ Recovery points added successfully:', result.pointsAdded);
        
        // Record task completion to backend
        try {
          await fetch('/api/recovery-points/task-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: numericPatientId,
              taskType: 'RECOVERY_INSIGHTS',
              sessionDuration: null,
              pointsEarned: totalPoints
            }),
          });
          console.log('✅ Task completion recorded for recovery insight');
        } catch (taskError) {
          console.error('❌ Failed to record task completion:', taskError);
        }
        
        // Show celebration
        setShowCelebration(true);
        
        // Call parent's task completion handler to trigger refresh
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'recovery-insight',
            taskTitle: 'Recovery Insight',
            pointsEarned: totalPoints,
            newSRSScore: srsScore,
            phase: phaseLabel
          });
        }
        
        // Call parent's completion handler
        onComplete?.({ 
          selectedInsight: selectedInsightId,
          actionTaken: actionTaken ? actionPrompt?.action : null,
          pointsEarned: totalPoints
        });
        
        // Close the dialog after a short delay to show celebration
        setTimeout(() => {
          onOpenChange(false);
          setShowCelebration(false);
        }, 2000);
      } else {
        console.error('❌ Failed to add recovery points:', result.message || result.error);
        
        // Check if it's a daily cap issue
        const isDailyCapReached = result.message && result.message.includes('Daily education cap reached');
        
        if (isDailyCapReached) {
          // Show a different message for daily cap
          console.log('ℹ️ Daily recovery insights cap reached - still recording completion');
        }
        
        // Still record task completion to backend even if RP failed
        try {
          await fetch('/api/recovery-points/task-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: numericPatientId,
              taskType: 'RECOVERY_INSIGHTS',
              sessionDuration: null,
              pointsEarned: isDailyCapReached ? 0 : totalPoints // No points if daily cap reached
            }),
          });
          console.log('✅ Task completion recorded for recovery insight (despite RP failure)');
        } catch (taskError) {
          console.error('❌ Failed to record task completion:', taskError);
        }
        
        // Show celebration (even for daily cap - user still completed the insight)
        setShowCelebration(true);
        
        // Call parent's task completion handler with appropriate points
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'recovery-insight',
            taskTitle: 'Recovery Insight',
            pointsEarned: isDailyCapReached ? 0 : totalPoints,
            newSRSScore: srsScore,
            phase: phaseLabel
          });
        }
        
        // Call parent's completion handler
        onComplete?.({ 
          selectedInsight: selectedInsightId,
          actionTaken: actionTaken ? actionPrompt?.action : null,
          pointsEarned: isDailyCapReached ? 0 : totalPoints
        });
        
        // Close the dialog after a short delay to show celebration
        setTimeout(() => {
          onOpenChange(false);
          setShowCelebration(false);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error submitting recovery insight:', error);
      
      // Still record task completion to backend even if everything failed
      try {
        const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`)
        if (patientResponse.ok) {
          const patientData = await patientResponse.json()
          const numericPatientId = patientData.data.patient.id
          
          await fetch('/api/recovery-points/task-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: numericPatientId,
              taskType: 'RECOVERY_INSIGHTS',
              sessionDuration: null,
              pointsEarned: totalPoints
            }),
          });
          console.log('✅ Task completion recorded for recovery insight (despite error)');
        }
      } catch (taskError) {
        console.error('❌ Failed to record task completion:', taskError);
      }
      
      // Still show celebration but log the error
      setShowCelebration(true);
      
      // Still call parent's task completion handler
      if (onTaskComplete) {
        onTaskComplete({
          taskId: 'recovery-insight',
          taskTitle: 'Recovery Insight',
          pointsEarned: totalPoints,
          newSRSScore: srsScore,
          phase: phaseLabel
        });
      }
      
      // Still call parent's completion handler
      onComplete?.({ 
        selectedInsight: selectedInsightId,
        actionTaken: actionTaken ? actionPrompt?.action : null,
        pointsEarned: totalPoints
      });
      
      // Close the dialog after a short delay to show celebration
      setTimeout(() => {
        onOpenChange(false);
        setShowCelebration(false);
      }, 2000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhaseClick = () => {
    // This would typically navigate to phase-specific exercises
    console.log("Phase clicked:", phaseLabel);
  };

  const handleRegionClick = () => {
    // This would typically navigate to region-specific exercises
    console.log("Region clicked:", regionLabel);
  };

  const handleSRSClick = () => {
    // This would typically open SRS breakdown modal
    console.log("SRS clicked:", srsScore);
  };

  const getTodaysInsight = () => {
    const today = new Date();
    const startDate = new Date('2024-01-01');
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const todayIndex = daysSinceStart % insightLibrary.length;
    return insightLibrary[todayIndex];
  };

  const getFilteredInsights = () => {
    // Show all insights to all patients - no risk-based filtering
    // This ensures we have enough content for daily progression (42 insights total)
    return insightLibrary;
  };

  // Map Insight[] to RecoveryInsight[] with releaseOffset
  const mapInsightToRecoveryInsight = (insight: Insight, index: number): RecoveryInsight & { releaseOffset: number } => {
    // Simple approach: just use the index to determine today's insight
    // Today's insight is always index 0, future insights are positive offsets
    const offset = index;
    
    return {
      id: insight.id.toString(),
      title: insight.title,
      description: insight.subtitle || '',
      category: insight.track || '',
      date: new Date().toISOString(),
      points: 2,
      metrics: [],
      recommendations: [],
      viewed: false,
      completed: false,
      releaseOffset: offset,
    };
  };

  const filteredInsights: (RecoveryInsight & { releaseOffset: number })[] = getFilteredInsights().map((insight, index) => mapInsightToRecoveryInsight(insight, index));

  // Calculate daily completed insights from completed insights
  useEffect(() => {
    // Count insights that were completed today
    const today = new Date().toISOString().slice(0, 10);
    const todayCompletedCount = completedInsights.length; // For now, count all completed insights
    const totalInsights = filteredInsights.length;
    console.log('🎯 Daily progress calculation:', { completedInsights, todayCompletedCount, totalInsights, today });
    setDailyCompletedInsights(Math.min(todayCompletedCount, totalInsights));
  }, [completedInsights, filteredInsights]);

  // Get insight status for rotation logic
  const getInsightStatus = (index: number) => {
    const today = new Date();
    const startDate = new Date('2024-01-01');
    const daysSinceStart = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const currentDayIndex = daysSinceStart % insightLibrary.length;
    
    // Calculate offset (days from today)
    let offset: number;
    if (index >= currentDayIndex) {
      offset = index - currentDayIndex;
    } else {
      // For past insights, calculate negative offset
      offset = -(insightLibrary.length - currentDayIndex + index);
    }
    
    const isToday = offset === 0;
    const isFuture = offset > 0;
    const isCompleted = offset < 0 || completedInsights.includes(insightLibrary[index]?.id);
    
    return { 
      isToday, 
      isFuture, 
      isCompleted,
      offset
    };
  };

  const today = startOfDay(new Date());

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden border-0 !rounded-2xl sm:!rounded-2xl">
          <DialogHeader className="sr-only">
            <DialogTitle className="sr-only">Recovery Insight</DialogTitle>
            <DialogDescription className="sr-only">
              Your personalized recovery insights and recommendations.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
            <div className="flex items-center gap-8 items-center">
              <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                <BarChart3 className="w-12 h-12 text-white opacity-90" />
              </div>
              <h2 className="text-3xl font-bold text-white">Recovery Insights</h2>
            </div>
            <p className="mt-2 text-btl-100 text-sm">
              Evidence-based content to support your recovery journey
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
                tabIndex={0}
                role="button"
                title={`Click to view all ${phaseLabel} phase exercises`}
                onClick={handlePhaseClick}
              >
                <Target className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
                <span>{phaseLabel} Phase</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
              </div>
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
                tabIndex={0}
                role="button"
                title={`Click to view all ${regionLabel} exercises`}
                onClick={handleRegionClick}
              >
                <Activity className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
                <span>{regionLabel} Focus</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
              </div>
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
                tabIndex={0}
                role="button"
                title="Click to view your Recovery Score details"
                onClick={handleSRSClick}
              >
                <Gauge className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
                <span>SRS: {srsScore}</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
          </div>

          {/* Daily Progress Bar */}
          <div className="px-6 py-3 border-b border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-btl-700">Daily Progress</span>
              <span className="text-sm font-medium text-btl-600">{dailyCompletedInsights} of {filteredInsights.length} completed</span>
            </div>
            <div className="w-full bg-btl-200 rounded-full h-3">
              <div
                className="bg-btl-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min((dailyCompletedInsights / filteredInsights.length) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
            <div className="space-y-6">
              {/* Snapshot Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Your Recovery Snapshot
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-btl-600">Pain Level</span>
                      {getDeltaIcon(painDelta)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{snapshot.pain}/10</div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-btl-600">Stress Level</span>
                      {getDeltaIcon(stressDelta)}
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{snapshot.stress}/10</div>
                  </div>
                  
                  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-bold text-btl-600">Risk Level</span>
                    </div>
                    <Badge className={`${getRiskColor(snapshot.risk)} text-sm font-medium`}>
                      {snapshot.risk.toUpperCase()}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Action Prompt */}
              {showActionPrompt && actionPrompt && (
                <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl border border-red-200 p-6 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl">
                      <AlertTriangle className="w-6 h-6 text-red-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-red-900 mb-3">
                        {actionPrompt.title}
                      </h3>
                      <button
                        onClick={handleActionPrompt}
                        disabled={actionTaken}
                        className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg ${
                          actionTaken
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {actionTaken ? (
                          <div className="flex items-center justify-center gap-3">
                            <CheckCircle className="w-5 h-5" />
                            Action Taken
                          </div>
                        ) : (
                          <div className="flex items-center justify-center gap-3">
                            <Play className="w-5 h-5" />
                            {actionPrompt.buttonText}
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* All Insights Pills - Matching Mindfulness Pill Layout */}
              {!showActionPrompt && (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">
                    Recovery Insights
                    {debugUnlockAll && (
                      <span className="ml-2 text-sm font-normal text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        🔓 DEBUG MODE: All Unlocked
                      </span>
                    )}
                  </h3>
                  <div className="space-y-4" key={refreshKey}>
                    {filteredInsights.map((insight, i) => {
                      if (!insight) return null;
                      const offset = insight.releaseOffset;
                      // In debug mode, all insights are unlocked
                      const isToday = debugUnlockAll ? true : offset === 0; // Only today's insight is available (unless debug mode)
                      const isFuture = debugUnlockAll ? false : offset > 0; // Future insights are locked (unless debug mode)
                      const isCompleted = completedInsights.includes(Number(insight.id));
                      
                      if (i === 0) {
                        console.log('🔓 First insight unlock status:', { debugUnlockAll, isToday, isFuture, offset });
                      }
                      
                      // Calculate week and day labels
                      const getDayLabel = (offset: number) => {
                        if (offset === 0) return "Today";
                        
                        const week = Math.floor(offset / 7) + 1;
                        const day = (offset % 7) + 1;
                        return `Week ${week}: Day ${day}`;
                      };
                      
                      console.log('🎯 Insight pill:', { id: insight.id, title: insight.title, isCompleted, completedInsights, offset, label: getDayLabel(offset) });
                      return (
                        <button
                          key={insight.id}
                          type="button"
                          disabled={isFuture} // Only today's insight can be completed
                          onClick={() => handleInsightSelect(Number(insight.id))}
                          className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-btl-400 relative bg-white border-gray-200 text-gray-700 hover:bg-cyan-50 ${
                            isCompleted ? 'border-green-400 ring-2 ring-green-200 bg-green-50 cursor-pointer' :
                            isFuture ? 'border-gray-300 ring-2 ring-gray-200 bg-gray-50 cursor-not-allowed opacity-60' :
                            'border-cyan-400 ring-2 ring-cyan-200 cursor-pointer'
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <h4 className="font-semibold text-base text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-600">{insight.description}</p>
                          </div>
                          {isCompleted ? (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">+5 pts</span>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-green-600 text-white shadow-md">
                                <CheckCircle className="w-4 h-4" />
                              </div>
                              <span className="text-xs text-green-600 font-medium">(Redo)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">+5 pts</span>
                              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-cyan-600 text-white shadow-md">
                                <Play className="w-4 h-4 ml-0.5" />
                              </div>
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>

                </div>
              )}

              {/* Footer cloned from MindfulnessSessionDialog */}
              <div className="px-6 py-4 bg-white border-t border-gray-200">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 font-medium text-sm bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow-lg border border-yellow-500 rounded-2xl">
                      Total: {filteredInsights.length * 5} pts
                    </div>
                  </div>
                  <button
                    onClick={handleSubmit}
                    disabled={!canSubmit || isSubmitting}
                    className={`px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg ${
                      canSubmit && !isSubmitting
                        ? 'bg-gradient-to-r from-btl-600 to-btl-500 text-white hover:from-btl-700 hover:to-btl-600 hover:shadow-xl hover:scale-105'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-3">
                        <Play className="w-5 h-5" />
                        Complete Insight
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Celebration */}
              {showCelebration && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Insight Completed!</h3>
                  <p className="text-gray-600">Great work! You've earned {totalPoints} points.</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>

        {/* Insight Dialog */}
        {selectedInsightId && (
          <InsightDialog
            insightId={selectedInsightId}
            isOpen={showInsightDialog}
            onClose={handleCloseInsightDialog}
            onComplete={handleInsightComplete}
            patientId={patientId}
          />
        )}
      </Dialog>
    </>
  );
} 