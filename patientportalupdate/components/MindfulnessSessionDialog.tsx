import { Brain, AlertCircle } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { useMindfulnessExercises } from "@/hooks/useMindfulnessExercises";
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

interface MindfulnessSessionDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

export function MindfulnessSessionDialog({ open, onClose, patientId }: MindfulnessSessionDialogProps) {
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId);
  const exercises: Exercise[] = patientData ? useMindfulnessExercises(patientData.phase) : [];

  const completedExercises = exercises.filter((ex: Exercise) => ex.completed).length;
  const totalExercises = exercises.length;

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent>
        <AssessmentDialogHeader>
          <AssessmentDialogTitle className="flex items-center gap-2">
            <Brain className="w-8 h-8 text-white" />
            Mindfulness Session
          </AssessmentDialogTitle>
          <AssessmentDialogDescription>
            Your personalized mindfulness exercises for today. Complete these exercises to reduce stress and improve mental well-being.
          </AssessmentDialogDescription>
          <AssessmentDialogProgress 
            step={completedExercises} 
            totalSteps={totalExercises} 
          />
        </AssessmentDialogHeader>
        
        <AssessmentDialogBody>
          {patientLoading && (
            <div className="text-center text-btl-600 py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
              Loading patient data...
            </div>
          )}
          
          {patientError && (
            <div className="text-center text-red-500 py-8">
              <AlertCircle className="w-8 h-8 mx-auto mb-2" />
              Error loading patient data.
            </div>
          )}
          
          {!patientLoading && !patientError && exercises.length === 0 && (
            <div className="text-center text-btl-600">No mindfulness exercises found for your current phase.</div>
          )}
          
          {exercises.length > 0 && (
            <div className="space-y-4">
              {exercises.map((ex: Exercise, idx: number) => (
                <div key={ex.id || idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                      <h3 className="text-lg font-semibold text-gray-900">{ex.name}</h3>
                    </div>
                    <div className="text-sm font-medium text-btl-600">+{ex.points} pts</div>
                  </div>
                  <p className="text-gray-600 mb-4">{ex.description}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Duration: {ex.duration}</span>
                    <span>Focus: {ex.focus}</span>
                  </div>
                  {ex.instructions && ex.instructions.length > 0 && (
                    <div className="mt-4 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                      <div className="flex items-start space-x-3">
                        <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <h4 className="font-semibold text-cyan-800 mb-2">Instructions:</h4>
                          <ol className="space-y-2">
                            {ex.instructions.map((instruction: string, i: number) => (
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
                  <button
                    onClick={() => {/* TODO: Implement exercise completion */}}
                    className={`mt-4 w-full py-3 rounded-xl font-semibold transition-all ${
                      ex.completed
                        ? "bg-green-100 text-green-700 cursor-not-allowed"
                        : "bg-btl-600 text-white hover:bg-btl-700"
                    }`}
                  >
                    {ex.completed ? "Completed" : "Mark as Complete"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </AssessmentDialogBody>

        <AssessmentDialogFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Close Session
          </button>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 