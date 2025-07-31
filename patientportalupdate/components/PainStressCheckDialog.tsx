"use client"

import { useState, useEffect } from "react";
import { Heart, Smile, Frown, Meh, Angry, Plus, Info, CheckCircle, Target, Activity, Gauge, Play, Headphones, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";
import { classifyTier, Mood } from "@/utils/assessment";
import { tierContent } from "@/content/assessmentResponses";
import ResultModal from "./ResultModal";

interface PainStressCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onComplete?: (data: any) => void;
  onTaskComplete?: (taskData: any) => void;
}

const PAIN_AREAS = [
  "Lower back",
  "Neck", 
  "Shoulder",
  "Knee",
  "Hip",
  "Other",
];

const FUNCTION_LIKERT = [
  "No limit",
  "A little",
  "Some", 
  "A lot",
  "Couldn't do much",
];

const TRIGGERS = [
  "Long sitting",
  "Lifting kids",
  "Desk work",
  "Poor sleep",
];

// Replace PAIN_EMOJI_OPTIONS with mood/stress blend
const MOOD_EMOJI_OPTIONS = [
  { value: 'very_happy', emoji: '😄', label: 'Very happy' },
  { value: 'calm', emoji: '🙂', label: 'Calm' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'down', emoji: '🙁', label: 'Down' },
  { value: 'stressed', emoji: '😣', label: 'Stressed' },
  { value: 'very_stressed', emoji: '😫', label: 'Very stressed' },
];

// Add a mapping from mood emoji value to Mood type
const moodMap: Record<string, Mood> = {
  very_happy: 'positive',
  calm: 'positive',
  neutral: 'neutral',
  down: 'negative',
  stressed: 'distressed',
  very_stressed: 'distressed',
};

export function PainStressCheckDialog({ open, onOpenChange, patientId, onComplete, onTaskComplete }: PainStressCheckDialogProps) {
  const [pain, setPain] = useState<number>(5);
  const [painArea, setPainArea] = useState<string>("");
  const [functionLikert, setFunctionLikert] = useState<string>("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState<string>("");
  const [stress, setStress] = useState<number>(5);
  const [stressFactors, setStressFactors] = useState<string[]>([]);
  const [customStressFactor, setCustomStressFactor] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [result, setResult] = useState<null | { tier: 1|2|3|4; debugInfo?: { pain: number; stress: number; mood: string; painConverted: number; stressConverted: number; tier: number; } }>(null);
  const [escalate, setEscalate] = useState(false);
  // Add mood state
  const [mood, setMood] = useState<string>('neutral');

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

  // Reset escalate on dialog close/reset
  useEffect(() => {
    if (!open) {
      setEscalate(false);
    }
  }, [open]);

  // Get actual patient data instead of hardcoded values
  const srsScore = patientData?.srsScore || 0;
  const phaseLabel = patientData?.phase || "EDUCATE";
  const regionLabel = "Lower back";

  const canSubmit = pain > 0 && painArea && functionLikert && stress > 0;
  const totalPoints = 3;

  const handleChipToggle = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const getStressLabel = (stress: number) => {
    if (stress === 0) return "Completely calm";
    if (stress <= 3) return "Relaxed";
    if (stress <= 6) return "Moderate stress";
    if (stress <= 8) return "High stress";
    return "Overwhelmed";
  };

  const feedbackOptions = [
    {
      label: "Mindfulness",
      onClick: () => window.dispatchEvent(new CustomEvent('openMindfulnessSession')),
    },
    {
      label: "Breathing",
      onClick: () => window.dispatchEvent(new CustomEvent('openBreathingSession')),
    },
    {
      label: "NSDR (YouTube)",
      onClick: () => window.open('https://www.youtube.com/watch?v=1vx8iUvfyCY', '_blank'),
    },
    {
      label: "Direct Message",
      onClick: () => window.dispatchEvent(new CustomEvent('openDirectMessage')),
    },
    {
      label: "Book Appointment",
      onClick: () => window.dispatchEvent(new CustomEvent('openBookAppointment')),
    },
  ];

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`)
      if (!patientResponse.ok) {
        throw new Error('Failed to get patient data')
      }
      const patientData = await patientResponse.json()
      const numericPatientId = patientData.data.patient.id
      
      // Submit daily pain and stress assessment to backend
      const dailyAssessmentResponse = await fetch('http://localhost:3001/patients/daily-assessment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: patientId, // Use email format
          pain: pain,
          stress: stress,
          mood: mood,
          painArea: painArea,
          functionLikert: functionLikert,
          triggers: triggers,
          stressFactors: stressFactors
        })
      });
      
      if (dailyAssessmentResponse.ok) {
        const assessmentResult = await dailyAssessmentResponse.json();
        console.log('✅ Daily assessment stored:', assessmentResult);
      }
      
      // Call real backend for recovery points
      const result = await addRecoveryPoints(
        numericPatientId.toString(),
        'LIFESTYLE',
        'Pain & Stress Check-in completed',
        totalPoints
      );

      // Record task completion to backend
      try {
        await fetch('/api/recovery-points/task-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            patientId: numericPatientId,
            taskType: 'PAIN_ASSESSMENT',
            sessionDuration: null,
            pointsEarned: totalPoints
          }),
        });
        console.log('✅ Task completion recorded for pain assessment');
      } catch (taskError) {
        console.error('❌ Failed to record task completion:', taskError);
      }

      // Use real escalate value from backend
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        const mappedMood = moodMap[mood] || 'neutral';
        // Convert 0-10 scales to expected scales for classifyTier
        const painConverted = Math.floor((pain / 10) * 6) as 0|1|2|3|4|5|6; // Convert 0-10 to 0-6
        const stressConverted = Math.floor((stress / 10) * 3) as 0|1|2|3; // Convert 0-10 to 0-3
        const tier = classifyTier({ pain: painConverted, stress: stressConverted, mood: mappedMood });
        const debugInfo = {
          pain,
          stress,
          mood: mappedMood,
          painConverted,
          stressConverted,
          tier
        };
        setResult({ tier, debugInfo });
        setEscalate(false); // Backend doesn't support escalation yet
      }, 2000);
      
      if (onTaskComplete) {
        onTaskComplete({
          taskId: 'pain-assessment',
          taskTitle: 'Pain & Stress Check-in',
          pointsEarned: totalPoints,
          newSRSScore: srsScore,
          phase: phaseLabel
        });
      }
      
      onComplete?.({ 
        pain, 
        painArea, 
        functionLikert, 
        triggers, 
        stress, 
        stressFactors,
        pointsEarned: totalPoints
      });
    } catch (error) {
      console.error('❌ Error completing pain assessment:', error);
      
      // Still record task completion to backend even if everything else failed
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
              taskType: 'PAIN_ASSESSMENT',
              sessionDuration: null,
              pointsEarned: totalPoints
            }),
          });
          console.log('✅ Task completion recorded for pain assessment (despite error)');
        }
      } catch (taskError) {
        console.error('❌ Failed to record task completion:', taskError);
      }
      
      setShowCelebration(true);
      setTimeout(() => {
        setShowCelebration(false);
        const painConverted = Math.floor((pain / 6) * 3) as 0|1|2|3;
        const stressConverted = Math.floor((stress / 10) * 3) as 0|1|2|3;
        const tier = classifyTier({ pain: painConverted, stress: stressConverted, mood: 'neutral' });
        const debugInfo = {
          pain,
          stress,
          mood,
          painConverted,
          stressConverted,
          tier
        };
        setResult({ tier, debugInfo });
        setEscalate(false);
      }, 2000);
      
      if (onTaskComplete) {
        onTaskComplete({
          taskId: 'pain-assessment',
          taskTitle: 'Pain & Stress Check-in',
          pointsEarned: totalPoints,
          newSRSScore: srsScore,
          phase: phaseLabel
        });
      }
      
      onComplete?.({ 
        pain, 
        painArea, 
        functionLikert, 
        triggers, 
        stress, 
        stressFactors,
        pointsEarned: totalPoints
      });
    }
    
    setIsSubmitting(false);
  };

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
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden border-0 !rounded-2xl sm:!rounded-2xl">
        <DialogHeader className="sr-only">
          <DialogTitle className="sr-only">Pain & Stress Check-in</DialogTitle>
          <DialogDescription className="sr-only">
            Your daily wellness assessment. Track your progress and get personalized insights.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center gap-8 items-center">
            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <Heart className="w-12 h-12 text-white opacity-90" />
            </div>
            <h2 className="text-3xl font-bold text-white">Pain & Stress Check-in</h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            Your daily wellness assessment. Track your progress and get personalized insights.
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

        <div className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
          <div className="space-y-6">
            {/* Pain Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-btl-600 to-btl-400 rounded-full shadow-sm"></div>
                Pain Assessment
              </h3>
              
              {/* Pain Slider */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  Rate your pain right now (0-10)
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min={0} 
                    max={10} 
                    value={pain} 
                    onChange={e => setPain(Number(e.target.value))} 
                    className="w-full h-2 bg-btl-100 rounded-xl appearance-none cursor-pointer accent-btl-600 focus:outline-none focus:ring-2 focus:ring-btl-400 shadow-inner"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="font-medium text-btl-600">0 - No pain</span>
                    <span className="font-medium text-btl-600">5 - Moderate</span>
                    <span className="font-medium text-btl-600">10 - Worst</span>
                  </div>
                </div>
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-gradient-to-r from-btl-500 to-btl-400 shadow-xl border border-btl-200 w-20 h-20 flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-white select-none">{pain}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-btl-600 text-center">
                      {pain === 0 ? "No pain" : pain <= 3 ? "Mild pain" : pain <= 6 ? "Moderate pain" : pain <= 8 ? "Severe pain" : "Very severe pain"}
                    </div>
                  </div>
                </div>
              </div>

              {/* Area Picker */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Where is your pain located?
                </label>
                <select 
                  value={painArea} 
                  onChange={e => setPainArea(e.target.value)} 
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-btl-500 focus:border-btl-500 bg-white shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <option value="">Select the affected area</option>
                  {PAIN_AREAS.map(area => <option key={area} value={area}>{area}</option>)}
                </select>
              </div>

              {/* Function Likert */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How much did pain limit you today?
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {FUNCTION_LIKERT.map((label, idx) => (
                    <button 
                      key={label} 
                      type="button" 
                      onClick={() => setFunctionLikert(label)} 
                      className={`py-2 px-2 rounded-full border-2 text-xs font-medium transition-all duration-200 hover:shadow-lg ${
                        functionLikert === label
                          ? 'bg-gradient-to-br from-btl-600 to-btl-500 text-white border-btl-600 shadow-xl scale-105'
                          : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-400 hover:text-btl-700 hover:shadow-md'
                      }`}
                    >
                      <div className="text-base font-bold mb-0.5">{idx + 1}</div>
                      <div className="text-[10px] leading-tight">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Trigger Chips */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What triggered your pain?
                </label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {TRIGGERS.map(trigger => (
                      <button 
                        key={trigger} 
                        type="button" 
                        onClick={() => handleChipToggle(triggers, setTriggers, trigger)} 
                        className={`px-4 py-2 rounded-2xl border-2 text-sm font-medium transition-all duration-200 hover:shadow-lg ${
                          triggers.includes(trigger)
                            ? 'bg-gradient-to-r from-btl-600 to-btl-500 text-white border-btl-600 shadow-xl scale-105'
                            : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-400 hover:text-btl-700 hover:shadow-md'
                        }`}
                      >
                        {trigger}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={customTrigger} 
                      onChange={e => setCustomTrigger(e.target.value)} 
                      placeholder="Add custom trigger..." 
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-btl-500 focus:border-btl-500 shadow-sm hover:shadow-md transition-all duration-200"
                    />
                    <div className="p-2 bg-btl-100 rounded-2xl">
                      <Plus className="w-5 h-5 text-btl-600" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stress Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 shadow-lg p-6 hover:shadow-xl transition-all duration-300">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <div className="w-3 h-3 bg-gradient-to-r from-btl-600 to-btl-400 rounded-full shadow-sm"></div>
                Stress & Mood
              </h3>
              
              {/* Stress Slider */}
              <div className="space-y-4 mb-6">
                <label className="block text-sm font-medium text-gray-700">
                  How stressed do you feel right now? (0 = calm · 10 = maxed out)
                </label>
                <div className="relative">
                  <input 
                    type="range" 
                    min={0} 
                    max={10} 
                    value={stress} 
                    onChange={e => setStress(Number(e.target.value))} 
                    className="w-full h-2 bg-btl-100 rounded-xl appearance-none cursor-pointer accent-btl-600 focus:outline-none focus:ring-2 focus:ring-btl-400 shadow-inner"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="font-medium text-btl-600">0 - Calm</span>
                    <span className="font-medium text-btl-600">5 - Moderate</span>
                    <span className="font-medium text-btl-600">10 - Maxed out</span>
                  </div>
                </div>
                <div className="flex justify-center my-2">
                  <div className="flex flex-col items-center">
                    <div className="rounded-full bg-gradient-to-r from-btl-500 to-btl-400 shadow-xl border border-btl-200 w-20 h-20 flex items-center justify-center">
                      <span className="text-4xl font-extrabold text-white select-none">{stress}</span>
                    </div>
                    <div className="mt-2 text-sm font-medium text-btl-600 text-center">
                      {getStressLabel(stress)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Selection */}
              <div className="flex flex-col items-center my-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
                <div className="flex gap-4 justify-center mb-2">
                  {MOOD_EMOJI_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setMood(opt.value)}
                      className={`flex flex-col items-center justify-center w-20 h-20 rounded-xl focus:outline-none transition-all duration-150 border border-btl-400 ${mood === opt.value ? 'ring-2 ring-btl-500 border-2 bg-btl-100' : 'bg-white hover:bg-btl-50'}`}
                      aria-label={opt.label}
                      tabIndex={0}
                      title={opt.label}
                    >
                      <span className="text-2xl mb-2">{opt.emoji}</span>
                      <span className="text-sm leading-tight text-gray-600 text-center w-full whitespace-normal break-words">{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Celebration Message */}
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
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow-lg border border-[#a97142] rounded-2xl">
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
                  Submitting...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className="w-5 h-5" />
                  Finish Check-in
                </div>
              )}
            </button>
          </div>
        </div>
      </DialogContent>
      
      {result && (
        <ResultModal
          message={tierContent[result.tier].message}
          label={tierContent[result.tier].cta.label}
          route={tierContent[result.tier].cta.route}
          onClose={() => setResult(null)}
          tier={result.tier}
          escalate={escalate}
          debugInfo={process.env.NODE_ENV === 'development' ? result.debugInfo : undefined}
        />
      )}
    </Dialog>
  );
} 