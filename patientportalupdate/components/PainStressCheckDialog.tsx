"use client"

import { useState } from "react";
import { Heart, Smile, Frown, Meh, Angry, Plus, Info, CheckCircle, Target, Activity, Gauge, Play, Headphones, Award } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";

interface PainStressCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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

const RELIEF = [
  "Heat",
  "Breathwork",
  "Exercise",
  "Walk",
];

const MOOD_EMOJIS = [
  { icon: <Smile className="w-6 h-6" />, label: "Great" },
  { icon: <Meh className="w-6 h-6" />, label: "Okay" },
  { icon: <Frown className="w-6 h-6" />, label: "Low" },
  { icon: <Angry className="w-6 h-6" />, label: "Rough" },
];

export function PainStressCheckDialog({ open, onOpenChange, onComplete, onTaskComplete }: PainStressCheckDialogProps) {
  const [pain, setPain] = useState<number>(0);
  const [painArea, setPainArea] = useState<string>("");
  const [functionLikert, setFunctionLikert] = useState<string>("");
  const [triggers, setTriggers] = useState<string[]>([]);
  const [customTrigger, setCustomTrigger] = useState<string>("");
  const [relief, setRelief] = useState<string[]>([]);
  const [customRelief, setCustomRelief] = useState<string>("");
  const [stress, setStress] = useState<number>(0);
  const [mood, setMood] = useState<string>("");
  const [moodNote, setMoodNote] = useState<string>("");
  const [reflect, setReflect] = useState<string>("");
  const [lessonWatched, setLessonWatched] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  const canSubmit = pain > 0 && painArea && functionLikert && stress > 0 && mood;

  // Calculate total points (same formula as MovementSessionDialog)
  const totalPoints = 20; // Base points for completing the assessment

  const handleChipToggle = (arr: string[], setArr: (v: string[]) => void, value: string) => {
    setArr(arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value]);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get patient ID from email (you'll need to pass patientId as prop or get it from context)
      const patientId = "testback@example.com"; // Replace with actual patient ID
      
      // Get patient data to get numeric ID
      const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`)
      if (!patientResponse.ok) {
        throw new Error('Failed to get patient data')
      }
      const patientData = await patientResponse.json()
      const numericPatientId = patientData.data.patient.id
      
      // Add recovery points for the completed assessment
      const result = await addRecoveryPoints(
        numericPatientId.toString(),
        'LIFESTYLE',
        'Pain & Stress Check-in completed',
        totalPoints
      );
      
      if (result.success) {
        console.log('✅ Recovery points added successfully:', result.pointsAdded);
        // Show celebration
        setShowCelebration(true);
        
        // Call parent's task completion handler to trigger refresh
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'pain-assessment',
            taskTitle: 'Pain & Stress Check-in',
            pointsEarned: totalPoints,
            newSRSScore: 7, // You might want to calculate this based on the assessment
            phase: 'EDUCATE' // You might want to get this from patient data
          });
        }
        
        // Call parent's completion handler
        onComplete?.({ 
          pain, 
          painArea, 
          functionLikert, 
          triggers, 
          relief, 
          stress, 
          mood, 
          moodNote, 
          reflect, 
          lessonWatched,
          pointsEarned: totalPoints
        });
        
        // Close the dialog after a short delay to show celebration
        setTimeout(() => {
          onOpenChange(false);
          setShowCelebration(false);
        }, 2000);
      } else {
        console.error('❌ Failed to add recovery points:', result.error);
        // Still show celebration but log the error
        setShowCelebration(true);
        
        // Still call parent's task completion handler
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'pain-assessment',
            taskTitle: 'Pain & Stress Check-in',
            pointsEarned: totalPoints,
            newSRSScore: 7,
            phase: 'EDUCATE'
          });
        }
        
        // Still call parent's completion handler
        onComplete?.({ 
          pain, 
          painArea, 
          functionLikert, 
          triggers, 
          relief, 
          stress, 
          mood, 
          moodNote, 
          reflect, 
          lessonWatched,
          pointsEarned: totalPoints
        });
        
        // Close the dialog after a short delay
        setTimeout(() => {
          onOpenChange(false);
          setShowCelebration(false);
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error completing assessment:', error);
      // Still mark as completed locally
      setShowCelebration(true);
      
      // Still call parent's task completion handler
      if (onTaskComplete) {
        onTaskComplete({
          taskId: 'pain-assessment',
          taskTitle: 'Pain & Stress Check-in',
          pointsEarned: totalPoints,
          newSRSScore: 7,
          phase: 'EDUCATE'
        });
      }
      
      // Still call parent's completion handler
      onComplete?.({ 
        pain, 
        painArea, 
        functionLikert, 
        triggers, 
        relief, 
        stress, 
        mood, 
        moodNote, 
        reflect, 
        lessonWatched,
        pointsEarned: totalPoints
      });
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onOpenChange(false);
        setShowCelebration(false);
      }, 2000);
    }
    
    setIsSubmitting(false);
  };

  // Placeholder values for pills (replace with real patient data as needed)
  const phaseLabel = "EDUCATE";
  const regionLabel = "Lower back";
  const srsScore = 7;

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
                <div className="flex justify-center">
                  <div className="w-full max-w-xl mx-auto py-3 px-0">
                    <div className="w-full rounded-xl bg-gradient-to-r from-btl-500 to-btl-400 shadow-xl border border-btl-200 flex flex-col items-center justify-center transition-all duration-300 py-1" style={{ minHeight: 40 }}>
                      <div className="text-3xl font-extrabold text-white drop-shadow-lg select-none">{pain}</div>
                      <div className="mt-1 min-h-[1.2em] flex items-center justify-center w-full">
                        <span className="text-xs text-white/90 font-medium select-none text-center">
                          {pain === 0 && "No pain"}
                          {pain > 0 && pain <= 3 && "Mild pain"}
                          {pain > 3 && pain <= 6 && "Moderate pain"}
                          {pain > 6 && pain <= 8 && "Severe pain"}
                          {pain > 8 && "Very severe pain"}
                        </span>
                      </div>
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

              {/* Relief Chips */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  What helped relieve your pain?
                </label>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3">
                    {RELIEF.map(r => (
                      <button 
                        key={r} 
                        type="button" 
                        onClick={() => handleChipToggle(relief, setRelief, r)} 
                        className={`px-4 py-2 rounded-2xl border-2 text-sm font-medium transition-all duration-200 hover:shadow-lg ${
                          relief.includes(r)
                            ? 'bg-gradient-to-r from-btl-600 to-btl-500 text-white border-btl-600 shadow-xl scale-105'
                            : 'bg-gradient-to-br from-gray-50 to-white text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-400 hover:text-btl-700 hover:shadow-md'
                        }`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="text" 
                      value={customRelief} 
                      onChange={e => setCustomRelief(e.target.value)} 
                      placeholder="Add custom relief method..." 
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
                <div className="flex justify-center">
                  <div className="w-full max-w-xl mx-auto py-3 px-0">
                    <div className="w-full rounded-xl bg-gradient-to-r from-btl-500 to-btl-400 shadow-xl border border-btl-200 flex flex-col items-center justify-center transition-all duration-300 py-1" style={{ minHeight: 40 }}>
                      <div className="text-3xl font-extrabold text-white drop-shadow-lg select-none">{stress}</div>
                      <div className="mt-1 min-h-[1.2em] flex items-center justify-center w-full">
                        <span className="text-xs text-white/90 font-medium select-none text-center">
                          {stress === 0 && "Completely calm"}
                          {stress <= 3 && "Relaxed"}
                          {stress <= 6 && "Moderate stress"}
                          {stress <= 8 && "High stress"}
                          {stress > 8 && "Overwhelmed"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mood Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-4">
                  How are you feeling?
                </label>
                <div className="space-y-4">
                  <div className="flex gap-4 justify-center">
                    {MOOD_EMOJIS.map(({ icon, label }) => (
                      <button 
                        key={label} 
                        type="button" 
                        onClick={() => setMood(label)} 
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 shadow-xl hover:scale-110 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-btl-400 
                          ${mood === label
                            ? 'bg-gradient-to-br from-btl-600 to-btl-400 text-white border-btl-600 ring-2 ring-btl-400 shadow-2xl scale-110 drop-shadow-lg'
                            : 'bg-gradient-to-br from-white to-gray-50 text-btl-600 border-btl-400 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-600 hover:text-btl-700 hover:shadow-xl'}
                        `}
                      >
                        {icon}
                      </button>
                    ))}
                  </div>
                  <input 
                    type="text" 
                    value={moodNote} 
                    onChange={e => setMoodNote(e.target.value)} 
                    placeholder="Add a note about your mood (optional)" 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-btl-500 focus:border-btl-500 shadow-sm hover:shadow-md transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Reflection & Lesson */}
            <div className="bg-gradient-to-r from-btl-50 via-blue-50 to-indigo-50 rounded-2xl border border-btl-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-btl-100 rounded-2xl">
                  <Info className="w-6 h-6 text-btl-600" />
                </div>
                <span className="text-xl font-semibold text-gray-900">Daily Reflection</span>
              </div>
              
              <div className="space-y-6">
                {/* 90-second lesson section - enhanced with UX improvements */}
                <div className="mb-6">
                  <span className="text-lg font-bold text-gray-800 mb-2 block">90-second lesson</span>
                  
                  {/* Main lesson button with enhanced UX */}
                  <div className="relative">
                    <button 
                      type="button" 
                      onClick={() => setLessonWatched(true)} 
                      className={`w-full px-6 py-4 rounded-2xl text-base font-semibold shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-300 hover:scale-105 hover:shadow-xl ${
                        lessonWatched 
                          ? 'bg-slate-200 text-slate-600 border-2 border-slate-300' 
                          : 'bg-gradient-to-br from-btl-500 to-btl-400 text-white border-2 border-btl-400 hover:from-btl-600 hover:to-btl-500'
                      }`}
                      aria-label="Play 90-second lesson: Why stress turns pain up"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {lessonWatched ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Play className="w-5 h-5" />
                          )}
                          <span>Why stress turns pain up</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm opacity-90">90s</span>
                          {lessonWatched && (
                            <CheckCircle className="w-4 h-4 text-green-600" />
                          )}
                        </div>
                      </div>
                    </button>
                    
                    {/* Sub-headline teaser */}
                    <p className="text-sm text-gray-600 mt-2 ml-2">
                      Learn how stress affects your pain and simple ways to manage both.
                    </p>
                    
                    {/* Audio fallback option */}
                    <button 
                      type="button"
                      className="absolute top-2 right-2 p-1.5 bg-white/20 rounded-full hover:bg-white/30 transition-colors duration-200"
                      title="Listen instead (90s, 0.7 MB)"
                      aria-label="Listen instead (90s, 0.7 MB)"
                    >
                      <Headphones className="w-3 h-3 text-white/80" />
                    </button>
                  </div>
                  
                  {/* Earn-points badge */}
                  <div className="flex justify-end mt-2">
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      lessonWatched 
                        ? 'bg-green-100 text-green-700 border border-green-200' 
                        : 'bg-gray-100 text-gray-600 border border-gray-200'
                    }`}>
                      {lessonWatched ? '✓ +3 pts earned' : '+3 pts on finish'}
                    </div>
                  </div>
                </div>
                <div className="border-t border-btl-100/30 my-2"></div>
                {lessonWatched && (
                  <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    +3 bonus points earned!
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    One thing that helped today…
                  </label>
                  <textarea 
                    value={reflect} 
                    onChange={e => setReflect(e.target.value)} 
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-btl-500 focus:border-btl-500 min-h-[80px] resize-none shadow-sm hover:shadow-md transition-all duration-200" 
                    placeholder="Share a win, tip, or something that helped you today..."
                  />
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
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 shadow-lg border border-yellow-500 rounded-2xl">
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
    </Dialog>
  );
} 