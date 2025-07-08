import { Dumbbell } from "lucide-react";
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
  isCompleted?: boolean;
}

export function ExerciseDetailsModal({ exercise, open, onClose, onComplete, isCompleted }: ExerciseDetailsModalProps) {
  if (!exercise) return null;

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent>
        <AssessmentDialogHeader>
          <AssessmentDialogTitle className="flex items-center gap-2">
            <Dumbbell className="w-8 h-8 text-white" />
            {exercise.name}
          </AssessmentDialogTitle>
          <AssessmentDialogDescription>
            {exercise.description}
          </AssessmentDialogDescription>
          <div className="flex items-center gap-4 mt-4 text-btl-100">
            <span>Duration: {exercise.duration}</span>
            <span>Focus: {exercise.focus}</span>
            <span>Difficulty: {exercise.difficulty}</span>
            <span>Points: +{exercise.points}</span>
          </div>
        </AssessmentDialogHeader>
        
        <AssessmentDialogBody>
          {exercise.videoId && (
            <div className="mb-6 aspect-video rounded-xl overflow-hidden bg-gray-100">
              {/* TODO: Implement video player */}
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                Video demonstration coming soon
              </div>
            </div>
          )}
          
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-2">Instructions:</h4>
                  <ol className="space-y-2">
                    {exercise.instructions.map((instruction: string, i: number) => (
                      <li key={i} className="flex text-sm text-cyan-700">
                        <span className="mr-2 text-cyan-500">{i + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}
        </AssessmentDialogBody>

        <AssessmentDialogFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close
          </button>
          {onComplete && !isCompleted && (
            <button
              onClick={() => onComplete(exercise.id || '')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-btl-600 text-white hover:bg-btl-700 transition-colors"
            >
              Mark as Complete
            </button>
          )}
          {isCompleted && (
            <button
              onClick={() => onComplete?.(exercise.id || '')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-600 text-white hover:bg-gray-700 transition-colors"
            >
              Mark as Incomplete
            </button>
          )}
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 