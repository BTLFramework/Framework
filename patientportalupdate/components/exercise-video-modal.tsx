import { useEffect, useState } from "react";
import { Dumbbell, AlertCircle, Play, Check, Target, Activity, Gauge, Award, PartyPopper, X, Clock } from "lucide-react";
import type { Exercise } from "@/types/exercise";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogProgress,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";

interface ExerciseVideoModalProps {
  exercise: any;
  open: boolean;
  onClose: () => void;
}

export function ExerciseVideoModal({ exercise, open, onClose }: ExerciseVideoModalProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (open) {
      setShowVideo(false);
      setIsCompleted(false);
    }
  }, [open]);

  if (!exercise) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Beginner+": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Reset": return "bg-blue-50 text-blue-700 border-blue-200";
      case "Educate": return "bg-green-50 text-green-700 border-green-200";
      case "Rebuild": return "bg-purple-50 text-purple-700 border-purple-200";
      default: return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-4xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Dumbbell className="w-12 h-12 text-white opacity-90" />
              <div>
                <h2 className="text-3xl font-bold text-white">{exercise.title ? exercise.title.replace(/\bdecompression\b/i, 'Decompression') : 'Standing Decompression Breath'}</h2>
                <p className="mt-2 text-btl-100 text-sm">
                  {exercise.description || 'Reduce spinal compression through mindful breathing'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise duration"
            >
              <Clock className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span>Duration: {exercise.duration ? exercise.duration.replace('Duration: ', '') : '5-10 minutes'}</span>
              <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise focus"
            >
              <Target className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span>Focus: {exercise.focus || 'breathing'}</span>
              <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise difficulty"
            >
              <Gauge className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span>Difficulty: {exercise.difficulty ? (exercise.difficulty.charAt(0).toUpperCase() + exercise.difficulty.slice(1).toLowerCase()) : 'Beginner'}</span>
              <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise points"
            >
              <Award className="w-5 h-5 stroke-2 group-hover:scale-110 transition-transform duration-200" />
              <span>Points: {exercise.points ? `+${exercise.points}` : '+0'}</span>
              <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
            </div>
          </div>
        </div>

        <AssessmentDialogBody className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {/* Exercise Header */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{exercise.title || exercise.name}</h3>
              <p className="text-gray-600 mb-4">{exercise.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPhaseColor(exercise.phase || exercise.exerciseData?.phase)}`}>
                  {exercise.phase || exercise.exerciseData?.phase} Phase
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(exercise.difficulty)}`}>
                  {exercise.difficulty}
                </span>
                <span className="text-sm text-gray-500 px-3 py-1 rounded-full bg-gray-100">
                  Duration: {exercise.duration}
                </span>
                {exercise.points && (
                  <span className="text-sm font-medium text-btl-600 px-3 py-1 rounded-full bg-btl-100">
                    +{exercise.points} pts
                  </span>
                )}
              </div>
            </div>

            {/* Video Section */}
            {!showVideo ? (
              <div className="mb-8">
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-btl-600 rounded-full flex items-center justify-center border-4 border-gray-300 shadow-lg">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Exercise Demonstration</h3>
                  <p className="text-gray-600 mb-4">Watch the video to see proper form and technique</p>
                  <button
                    onClick={() => setShowVideo(true)}
                    className="bg-btl-600 text-white px-6 py-3 rounded-full hover:bg-btl-700 transition-colors font-medium"
                  >
                    Watch Video
                  </button>
                </div>
              </div>
            ) : (
              <div className="mb-8">
                <div className="bg-gray-900 rounded-xl aspect-video flex items-center justify-center relative">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4 bg-btl-600 rounded-full flex items-center justify-center border-4 border-gray-400 opacity-50 shadow-lg">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                    <p className="text-lg">{exercise.title || exercise.name}</p>
                    <p className="text-sm opacity-75">Video ID: {exercise.videoId || exercise.exerciseData?.videoId}</p>
                  </div>
                  <button
                    onClick={() => setShowVideo(false)}
                    className="absolute top-4 right-4 text-sm text-btl-300 hover:text-white bg-black/50 px-3 py-1 rounded-full"
                  >
                    Hide Video
                  </button>
                </div>
              </div>
            )}

            {/* Instructions */}
            {(exercise.instructions || exercise.exerciseData?.instructions) && (
              <div className="mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl" data-instructions>
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-cyan-800 mb-2">Instructions:</h4>
                    <ol className="space-y-2">
                      {(exercise.instructions || exercise.exerciseData?.instructions).map((instruction: string, i: number) => (
                        <li key={i} className="flex text-sm text-cyan-700">
                          <span className="mr-2 text-cyan-500 px-2 py-0.5 rounded-full bg-cyan-100">{i + 1}.</span>
                          <span>{instruction}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* Cues Section */}
            {(exercise.cues || exercise.exerciseData?.cues) && (
              <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                <div className="flex items-start space-x-3">
                  <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  <div>
                    <h4 className="font-semibold text-yellow-800 mb-2">Key Cues:</h4>
                    <ul className="space-y-1">
                      {(exercise.cues || exercise.exerciseData?.cues).map((cue: string, i: number) => (
                        <li key={i} className="flex text-sm text-yellow-700">
                          <span className="mr-2 text-yellow-500 px-1.5 py-0.5 rounded-full bg-yellow-100">•</span>
                          <span>{cue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col items-center justify-center mt-8">
              <button
                onClick={() => {
                  setIsCompleted(true);
                  setTimeout(() => {
                    onClose();
                    setIsCompleted(false);
                  }, 2000);
                }}
                className={`w-full sm:w-auto px-8 py-3 rounded-full font-semibold transition-colors text-white text-lg shadow-md flex items-center justify-center gap-2
                  ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-btl-600 hover:bg-btl-700'}`}
              >
                {isCompleted && <Check className="w-5 h-5 text-white" />}
                {isCompleted ? 'Exercise Completed!' : 'Mark as Complete'}
              </button>
            </div>
          </div>
        </AssessmentDialogBody>

        {/* Footer with Instructions Button */}
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <button 
              onClick={() => {
                // Scroll to instructions section
                const instructionsElement = document.querySelector('[data-instructions]');
                if (instructionsElement) {
                  instructionsElement.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg bg-gradient-to-r from-btl-600 to-btl-500 text-white hover:from-btl-700 hover:to-btl-600 hover:shadow-xl hover:scale-105 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Instructions
            </button>
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow-lg border border-[#a97142] rounded-2xl">
                +{exercise.points || 0} pts
              </div>
            </div>
          </div>
        </div>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 