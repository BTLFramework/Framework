import { Dumbbell, Clock, Target, Gauge, Award } from "lucide-react";
import type { Exercise } from "@/types/exercise";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";

interface ExerciseDetailsModalProps {
  exercise: Exercise | null;
  open: boolean;
  onClose: () => void;
  onComplete?: (exerciseId: string) => void;
  onVideoWatched?: (exerciseId: string) => void;
  isCompleted?: boolean;
}

// Utility function to convert a string to Title Case
function toTitleCase(str: string) {
  return str.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
}

export function ExerciseDetailsModal({ exercise, open, onClose, onComplete, onVideoWatched, isCompleted }: ExerciseDetailsModalProps) {
  if (!exercise) return null;

  const handleVideoWatched = () => {
    if (exercise?.id && onVideoWatched) {
      onVideoWatched(exercise.id);
    }
  };

  const getTitle = () => {
    const name = (exercise.name && exercise.name.toLowerCase().replace(/\s+/g, ' ').includes('decompression breathing')) ||
      (exercise.name && exercise.name.trim().toLowerCase() === 'standing decompression breath')
      ? 'Standing Decompression Breath'
      : exercise.name;
    return toTitleCase(name || '');
  };

  const getDescription = () => {
    const desc = (exercise.name && exercise.name.toLowerCase().replace(/\s+/g, ' ').includes('decompression breathing')) ||
      (exercise.name && exercise.name.trim().toLowerCase() === 'standing decompression breath')
      ? 'Improve thoracic spine mobility with wall support'
      : exercise.description;
    return toTitleCase(desc || '');
  };

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-4xl w-full max-h-[95vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <AssessmentDialogHeader className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-6 pt-6 pb-1 border-b border-white/40">
          <div className="flex items-center gap-4">
            <Dumbbell className="w-8 h-8 text-white flex-shrink-0" />
            <div className="flex flex-col">
              <AssessmentDialogTitle className="text-2xl font-semibold leading-tight">
                {getTitle()}
              </AssessmentDialogTitle>
              <AssessmentDialogDescription className="text-base font-medium mt-1">
                {getDescription()}
              </AssessmentDialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-8 mb-4 text-btl-100">
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise duration"
            >
              <Clock className="w-5 h-5 stroke-2" />
              <span>{exercise.duration}</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise focus"
            >
              <Target className="w-5 h-5 stroke-2" />
              <span>{exercise.focus && exercise.focus.trim().toLowerCase() === 'breathing' ? 'Breathing' : exercise.focus}</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise difficulty"
            >
              <Gauge className="w-5 h-5 stroke-2" />
              <span>{exercise.difficulty}</span>
            </div>
            <div
              className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group"
              tabIndex={0}
              role="button"
              title="Exercise points"
            >
              <Award className="w-5 h-5 stroke-2" />
              <span>Points +{exercise.points}</span>
            </div>
          </div>
        </AssessmentDialogHeader>
        
        <AssessmentDialogBody>
          {exercise.videoId && (
            <div className="mb-6 p-2 max-w-2xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src="https://www.youtube.com/embed/qYb4Pes_als"
                  title="Exercise Video"
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
          
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl" data-instructions>
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-2">Instructions:</h4>
                  <ol className="space-y-2">
                    {exercise.instructions.map((instruction: string, i: number) => (
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
        </AssessmentDialogBody>

        <AssessmentDialogFooter className="p-4 border-t border-gray-100">
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
              {onComplete && !isCompleted && (
                <button
                  onClick={() => onComplete(exercise.id || '')}
                  className="px-8 py-3 rounded-full font-semibold bg-btl-600 text-white hover:bg-btl-700 transition-colors"
                >
                  Mark as Complete
                </button>
              )}
              {isCompleted && (
                <button
                  onClick={() => onComplete?.(exercise.id || '')}
                  className="px-8 py-3 rounded-full font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
                >
                  Mark as Incomplete
                </button>
              )}
            </div>
          </div>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 