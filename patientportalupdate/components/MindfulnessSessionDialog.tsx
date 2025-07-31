"use client"

import { useState, useEffect } from "react";
import { Heart, Smile, Frown, Meh, Angry, Plus, Info, CheckCircle, Target, Activity, Gauge, Play, Headphones, Award, Brain, Wind, Droplets, Zap } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";
import { MindfulnessVideoModal } from "@/components/MindfulnessVideoModal";
import { MoodModal } from "@/components/MoodModal";
import { useToast } from "@/hooks/use-toast";

interface MindfulnessSessionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onComplete?: (data: any) => void;
  onTaskComplete?: (taskData: any) => void;
}

const MINDFULNESS_TRACKS = [
  {
    id: 'breathwork',
    title: 'Breathwork',
    description: 'Deep breathing exercises for stress relief',
    duration: '90s',
    icon: <Wind className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'nsdr',
    title: 'NSDR',
    description: 'Non-sleep deep rest for recovery',
    duration: '90s',
    icon: <Brain className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'lymph',
    title: 'Lymph Flow',
    description: 'Gentle movement for lymphatic drainage',
    duration: '90s',
    icon: <Droplets className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    id: 'mindshift',
    title: 'Mindshift',
    description: 'Cognitive reframing techniques',
    duration: '90s',
    icon: <Zap className="w-6 h-6" />,
    color: 'from-cyan-500 to-cyan-600'
  }
];

export function MindfulnessSessionDialog({ open, onOpenChange, patientId, onComplete, onTaskComplete }: MindfulnessSessionDialogProps) {
  const [selectedTrack, setSelectedTrack] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedPractice, setSelectedPractice] = useState<any>(null);
  const [showMoodModal, setShowMoodModal] = useState(false);
  const [numericPatientId, setNumericPatientId] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch patient data to get correct SRS score and numeric ID
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch(`/api/patients/portal-data/${patientId}`);
        if (response.ok) {
          const result = await response.json();
          setPatientData(result.data);
          setNumericPatientId(result.data.patient.id.toString());
        }
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (open && patientId) {
      fetchPatientData();
    }
  }, [open, patientId]);

      // State changes logging
  useEffect(() => {
    console.log('🎯 showCelebration changed to:', showCelebration);
  }, [showCelebration]);

  useEffect(() => {
    console.log('🎯 showMoodModal changed to:', showMoodModal);
  }, [showMoodModal]);

  // Get actual patient data instead of hardcoded values
  const srsScore = patientData?.srsScore || 0;
  const phaseLabel = patientData?.phase || "EDUCATE";
  const regionLabel = "Lower back"; // This could also come from patient data if needed

  // Smart suggestion logic based on patient data
  const getSuggestedTrack = () => {
    // Get patient assessment data for intelligent recommendations
    const patientAssessments = patientData?.assessments || {};
    const pcsScore = patientAssessments.pcs4 || 0; // Pain Catastrophizing Scale (0-16)
    const tskScore = patientAssessments.tsk7 || 0; // Modified Fear-Avoidance Screener (0-28)
    const stressLevel = patientAssessments.stress || 5; // Daily stress (0-10)
    const painLevel = patientAssessments.pain || 5; // Daily pain (0-10)
    const srsScore = patientData?.srsScore || 0; // Signature Recovery Score
    
    // Decision tree for mindfulness track selection
    if (pcsScore >= 12) {
      // High pain catastrophizing - suggest loving-kindness to reduce negative self-talk
      return MINDFULNESS_TRACKS.find(track => track.id === 'loving-kindness') || MINDFULNESS_TRACKS[0];
    } else if (tskScore >= 30) {
      // High fear of movement - suggest body scan to build body awareness safely
      return MINDFULNESS_TRACKS.find(track => track.id === 'body-scan') || MINDFULNESS_TRACKS[0];
    } else if (stressLevel >= 7) {
      // High stress - suggest breathwork for immediate calming
      return MINDFULNESS_TRACKS.find(track => track.id === 'breathwork') || MINDFULNESS_TRACKS[0];
    } else if (painLevel >= 7) {
      // High pain - suggest progressive relaxation for muscle tension
      return MINDFULNESS_TRACKS.find(track => track.id === 'progressive-relaxation') || MINDFULNESS_TRACKS[0];
    } else if (srsScore <= 3) {
      // Low recovery score - suggest mindful movement for gentle activity
      return MINDFULNESS_TRACKS.find(track => track.id === 'mindful-movement') || MINDFULNESS_TRACKS[0];
    } else {
      // Default to breathwork for general wellness
      return MINDFULNESS_TRACKS.find(track => track.id === 'breathwork') || MINDFULNESS_TRACKS[0];
    }
  };

  const getSuggestionReason = () => {
    // Get patient assessment data for personalized reasoning
    const patientAssessments = patientData?.assessments || {};
    const pcsScore = patientAssessments.pcs4 || 0;
    const tskScore = patientAssessments.tsk7 || 0;
    const stressLevel = patientAssessments.stress || 5;
    const painLevel = patientAssessments.pain || 5;
    const srsScore = patientData?.srsScore || 0;
    
    // Provide personalized reasoning based on patient data
    if (pcsScore >= 12) {
      return `your pain catastrophizing score (${pcsScore}/16) suggests negative thought patterns`;
    } else if (tskScore >= 30) {
      return `your movement anxiety score (${tskScore}/44) indicates fear of movement`;
    } else if (stressLevel >= 7) {
      return `your recent stress levels (${stressLevel}/10) suggest high tension`;
    } else if (painLevel >= 7) {
      return `your recent pain levels (${painLevel}/10) suggest muscle tension`;
    } else if (srsScore <= 3) {
      return `your recovery score (${srsScore}/10) suggests gentle movement would be beneficial`;
    } else {
      return "your overall wellness patterns and recovery journey";
    }
  };

  const suggestedTrack = getSuggestedTrack();
  const otherTracks = MINDFULNESS_TRACKS.filter(track => track.id !== suggestedTrack.id);

  const canSubmit = selectedTrack !== null;

  // Calculate total points (same formula as other dialogs)
  const totalPoints = 5; // Base points for completing a mindfulness session (daily cap)

  const handleTrackSelect = (trackId: string) => {
    setSelectedTrack(trackId);
    const practice = MINDFULNESS_TRACKS.find(track => track.id === trackId);
    if (practice) {
      setSelectedPractice(practice);
      setShowVideoModal(true);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Patient ID is already fetched when dialog opens
      if (!numericPatientId) {
        throw new Error('Patient ID not available');
      }
      
      console.log('✅ Session started, waiting for completion...');
      
      // Show success toast for starting
      toast({
        title: "Session Started!",
        description: "Complete the practice to earn your points.",
      });
      
    } catch (error) {
      console.error('❌ Error starting mindfulness session:', error);
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to start mindfulness session. Please try again.",
        variant: "destructive",
      });
    }
    
    setIsSubmitting(false);
  };

  const handleVideoComplete = async () => {
    console.log('🎯 handleVideoComplete called');
    console.log('🎯 numericPatientId:', numericPatientId);
    
    if (!numericPatientId) {
      console.error('❌ No patient ID available for completion');
      return;
    }
    
    try {
      console.log('🎯 Adding recovery points...');
      // Add recovery points for the completed mindfulness session (MINDSET category, 7 points)
      const result = await addRecoveryPoints(
        numericPatientId.toString(),
        'MINDSET',
        'Mindfulness Session completed',
        totalPoints
      );
      
      console.log('🎯 Recovery points result:', result);
      
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
              taskType: 'MINDFULNESS',
              sessionDuration: null,
              pointsEarned: result.pointsAdded || totalPoints
            }),
          });
          console.log('✅ Task completion recorded for mindfulness session');
        } catch (taskError) {
          console.error('❌ Failed to record task completion:', taskError);
        }
        
        // Show success toast
        toast({
          title: "Great job!",
          description: `+${result.pointsAdded} Recovery Points!`,
        });
        
        // Call parent's task completion handler to trigger refresh
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'mindfulness-session',
            taskTitle: 'Mindfulness Session',
            pointsEarned: result.pointsAdded || totalPoints,
            newSRSScore: srsScore,
            phase: phaseLabel
          });
        }
        
        // Call parent's completion handler
        onComplete?.({ 
          selectedTrack,
          pointsEarned: result.pointsAdded || totalPoints
        });
        
        console.log('🎯 Setting showMoodModal to true');
        // Show mood modal for first completion of the day
        setShowMoodModal(true);
        console.log('🎯 Setting showCelebration to true');
        setShowCelebration(true); // Set celebration state to true
        
      } else if (result.alreadyLogged) {
        console.log('⚠️ Mindfulness already logged for today');
        
        // Show info toast for already logged
        toast({
          title: "Mindfulness already logged for today",
          description: "You've already completed your daily mindfulness practice.",
        });
        
        // Still call parent's completion handler (but no points)
        onComplete?.({ 
          selectedTrack,
          pointsEarned: 0,
          alreadyLogged: true
        });
        
        // Close the dialog
        setTimeout(() => {
          onOpenChange(false);
        }, 1000);
        
      } else {
        console.error('❌ Failed to add recovery points:', result.error);
        
        // Still record task completion to backend even if RP failed
        try {
          await fetch('/api/recovery-points/task-completion', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              patientId: numericPatientId,
              taskType: 'MINDFULNESS',
              sessionDuration: null,
              pointsEarned: 0 // No points if RP failed
            }),
          });
          console.log('✅ Task completion recorded for mindfulness session (despite RP failure)');
        } catch (taskError) {
          console.error('❌ Failed to record task completion:', taskError);
        }
        
        // Show error toast
        toast({
          title: "Error",
          description: result.message || "Failed to add recovery points. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('❌ Error completing mindfulness session:', error);
      
      // Still record task completion to backend even if everything failed
      try {
        await fetch('/api/recovery-points/task-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: numericPatientId,
            taskType: 'MINDFULNESS',
            sessionDuration: null,
            pointsEarned: 0 // No points if everything failed
          }),
        });
        console.log('✅ Task completion recorded for mindfulness session (despite error)');
      } catch (taskError) {
        console.error('❌ Failed to record task completion:', taskError);
      }
      
      // Show error toast
      toast({
        title: "Error",
        description: "Failed to complete mindfulness session. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMoodLogged = () => {
    // Close the main dialog after mood is logged
    onOpenChange(false);
  };

  // Navigation functions for the pills (dispatch custom events for now)
  const handlePhaseClick = () => {
    const event = new CustomEvent('openExerciseVideos', {
      detail: { filter: 'phase', value: phaseLabel }
    });
    window.dispatchEvent(event);
    onOpenChange(false);
  };
  const handleRegionClick = () => {
    const event = new CustomEvent('openExerciseVideos', {
      detail: { filter: 'region', value: regionLabel }
    });
    window.dispatchEvent(event);
    onOpenChange(false);
  };
  const handleSRSClick = () => {
    const event = new CustomEvent('openRecoveryScore');
    window.dispatchEvent(event);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden border-0 !rounded-2xl sm:!rounded-2xl [&>button]:hidden">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Mindfulness Session</DialogTitle>
          <DialogDescription className="sr-only">
            Choose a mindfulness practice to reduce stress and improve recovery.
          </DialogDescription>
        </DialogHeader>
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full text-white hover:bg-white/20 focus:bg-white/30 transition-all duration-200 hover:scale-110 focus:scale-110"
            aria-label="Close"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-8 items-center">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              {selectedPractice ? selectedPractice.icon : <Brain className="w-12 h-12 text-white opacity-90" />}
            </div>
            <h2 className="text-3xl font-bold text-white">
              {selectedPractice ? selectedPractice.title : "Mindfulness Session"}
            </h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            {selectedPractice ? selectedPractice.description : "Choose a mindfulness practice to reduce stress and improve recovery."}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-sm">
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title={`Click to view all ${phaseLabel} phase exercises`}
              onClick={handlePhaseClick}
            >
              <Target className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="whitespace-nowrap">{phaseLabel} Phase</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title={`Click to view all ${regionLabel} exercises`}
              onClick={handleRegionClick}
            >
              <Activity className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="whitespace-nowrap">{regionLabel} Focus</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-2 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Click to view your Recovery Score details"
              onClick={handleSRSClick}
            >
              <Gauge className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="whitespace-nowrap">SRS: {srsScore}</span>
            </div>
          </div>
        </div>

        <div className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
          <div className="space-y-6">
            {/* Mindfulness Tracks Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-btl-800 mb-6">
                Choose Your Practice
              </h3>
              
              <div className="space-y-4">
                {/* Suggested Track - Highlighted at the top */}
                <div className="mb-6">
                  <p className="text-gray-700 mb-3 font-semibold">
                    Based on your {getSuggestionReason()}, we suggest this practice:
                  </p>
                  <button
                    type="button"
                    onClick={() => handleTrackSelect(suggestedTrack.id)}
                    className={`w-full p-4 rounded-xl border-2 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-btl-400 ${
                      selectedTrack === suggestedTrack.id
                        ? 'bg-gradient-to-br from-btl-600 to-btl-500 text-white border-btl-600 ring-2 ring-btl-400 shadow-xl scale-105'
                        : 'bg-gradient-to-br from-btl-50 to-btl-100 text-gray-700 border-btl-200 hover:bg-gradient-to-br hover:from-btl-100 hover:to-btl-200 hover:border-btl-300 hover:text-btl-800 hover:shadow-lg'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-xl ${
                          selectedTrack === suggestedTrack.id 
                            ? 'bg-white/20' 
                            : `bg-gradient-to-br ${suggestedTrack.color} text-white`
                        }`}>
                          {suggestedTrack.icon}
                        </div>
                        <div className="text-left">
                          <h4 className={`font-semibold text-base ${
                            selectedTrack === suggestedTrack.id ? 'text-white' : 'text-gray-900'
                          }`}>
                            {suggestedTrack.title}
                          </h4>
                          <p className={`text-sm ${
                            selectedTrack === suggestedTrack.id ? 'text-white/90' : 'text-gray-600'
                          }`}>
                            {suggestedTrack.description}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                          selectedTrack === suggestedTrack.id
                            ? 'bg-white/20 text-white hover:bg-white/30'
                            : 'bg-btl-600 text-white hover:bg-btl-700 shadow-md'
                        }`}>
                          <Play className="w-4 h-4 ml-0.5" />
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTrack === suggestedTrack.id
                            ? 'bg-white/20 text-white'
                            : 'bg-btl-100 text-btl-700'
                        }`}>
                          {suggestedTrack.duration}
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                          selectedTrack === suggestedTrack.id
                            ? 'bg-white/20 text-white'
                            : 'bg-green-100 text-green-700'
                        }`}>
                          +5 pts
                        </div>
                        {selectedTrack === suggestedTrack.id && (
                          <CheckCircle className="w-5 h-5 text-white" />
                        )}
                      </div>
                    </div>
                  </button>
                </div>

                {/* Other Tracks - Vertical list below */}
                <div className="mt-6">
                  <p className="text-gray-700 mb-3 font-semibold">Other mindfulness practices:</p>
                                    <div className="space-y-3">
                    {otherTracks.map((track) => (
                      <button
                        key={track.id}
                        type="button"
                        onClick={() => handleTrackSelect(track.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-btl-400 ${
                          selectedTrack === track.id
                            ? 'bg-gradient-to-br from-btl-600 to-btl-500 text-white border-btl-600 ring-2 ring-btl-400 shadow-xl scale-105'
                            : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-400 hover:text-btl-700 hover:shadow-lg'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`p-2 rounded-xl ${
                              selectedTrack === track.id 
                                ? 'bg-white/20' 
                                : `bg-gradient-to-br ${track.color} text-white`
                            }`}>
                              {track.icon}
                            </div>
                            <div className="text-left">
                              <h4 className={`font-semibold text-base ${
                                selectedTrack === track.id ? 'text-white' : 'text-gray-900'
                              }`}>
                                {track.title}
                              </h4>
                              <p className={`text-sm ${
                                selectedTrack === track.id ? 'text-white/90' : 'text-gray-600'
                              }`}>
                                {track.description}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                              selectedTrack === track.id
                                ? 'bg-white/20 text-white hover:bg-white/30'
                                : 'bg-btl-600 text-white hover:bg-btl-700 shadow-md'
                            }`}>
                              <Play className="w-4 h-4 ml-0.5" />
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedTrack === track.id
                                ? 'bg-white/20 text-white'
                                : 'bg-btl-100 text-btl-700'
                            }`}>
                              {track.duration}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              selectedTrack === track.id
                                ? 'bg-white/20 text-white'
                                : 'bg-green-100 text-green-700'
                            }`}>
                              +5 pts
                            </div>
                            {selectedTrack === track.id && (
                              <CheckCircle className="w-5 h-5 text-white" />
                            )}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Section */}
            <div className="bg-gradient-to-r from-btl-50 via-blue-50 to-indigo-50 rounded-2xl border border-btl-200 p-6 shadow-lg" data-instructions>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-btl-100 rounded-2xl">
                  <Info className="w-6 h-6 text-btl-600" />
                </div>
                <span className="text-xl font-semibold text-gray-900">How It Works</span>
              </div>
              
              <div className="space-y-4 text-gray-700">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">1</div>
                  <div>
                    <p className="font-medium">Choose a mindfulness practice that resonates with you</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">2</div>
                  <div>
                    <p className="font-medium">Complete the 90-second guided session</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold mt-0.5">3</div>
                  <div>
                    <p className="font-medium">Earn 5 recovery points (once per day) and track your progress</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Message - moved outside scrollable area */}
        {showCelebration && (
          <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-center justify-center">
              <div
                className="flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-100 border-2 border-yellow-300 shadow-lg animate-pulse"
                style={{
                  borderColor: '#FFC700',
                  boxShadow: '0 4px 16px 0 rgba(255,199,0,0.20)',
                }}
              >
                <Award className="w-8 h-8 mr-3" style={{ color: '#FFC700' }} />
                <span
                  className="font-extrabold text-xl tracking-wide text-blue-800"
                  style={{
                    color: '#155fa0',
                  }}
                >
                  +{totalPoints} Recovery Points Earned! 🎉
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-white shadow-lg border border-gray-400 rounded-2xl">
                Total: {totalPoints} pts
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
                  Starting Session...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <Play className="w-5 h-5" />
                  Start Session
                </div>
              )}
            </button>
          </div>
        </div>
      </DialogContent>

      {/* Video Modal */}
      {selectedPractice && (
        <MindfulnessVideoModal
          practice={selectedPractice}
          open={showVideoModal}
          onClose={() => {
            setShowVideoModal(false);
            setSelectedPractice(null);
          }}
          onComplete={handleVideoComplete}
        />
      )}

      {/* Mood Modal */}
      <MoodModal
        open={showMoodModal}
        onOpenChange={setShowMoodModal}
        patientId={numericPatientId || ''}
        onMoodLogged={handleMoodLogged}
      />
    </Dialog>
  );
} 