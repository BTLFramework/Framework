import { useEffect, useState } from "react";
import { Dumbbell, AlertCircle, Play, Check, Target, Activity, Gauge, Award, PartyPopper } from "lucide-react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { useExercises } from "@/hooks/useExercises";
import type { Exercise } from "@/types/exercise";
import { ExerciseDetailsModal } from "@/components/exercise-details-modal";
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

interface MovementSessionDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

// Helper for phase label
function scoreToPhase(score: number) {
  if (score <= 3) return "RESET";
  if (score <= 6) return "EDUCATE";
  return "REBUILD";
}

export function MovementSessionDialog({ open, onClose, patientId }: MovementSessionDialogProps) {
  // TEMPORARY: Mock patient data override
  const mockPatient = {
    id: '123',
    srsScore: 28,
    region: 'Neck',
    activeRegions: ['Neck'], // <-- add this line
    phase: 'Reset',
    isLoading: false,
    error: null
  };

  // Comment out real data fetch temporarily
  // const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId);
  const patientData = mockPatient;
  const patientError = mockPatient.error;
  const patientLoading = mockPatient.isLoading;

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Get exercises for the patient's region and phase
  let exercises: Exercise[] = [];
  if (patientData?.region && patientData?.phase) {
    exercises = useExercises(patientData.region, patientData.phase);
    // If less than 3 exercises, get more from other phases
    if (exercises.length < 3) {
      const phases = ["Reset", "Educate", "Rebuild"];
      let i = 0;
      while (exercises.length < 3 && i < phases.length) {
        if (phases[i] !== patientData.phase) {
          const additionalExercises = useExercises(patientData.region, phases[i]);
          exercises = [...exercises, ...additionalExercises].slice(0, 3);
        }
        i++;
      }
    }
  }

  const completedCount = completedExercises.size;
  const totalExercises = exercises.length;

  const toggleExerciseCompletion = (exerciseId: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseId)) {
      newCompleted.delete(exerciseId);
    } else {
      newCompleted.add(exerciseId);
    }
    setCompletedExercises(newCompleted);
  };

  useEffect(() => {
    if (completedCount === totalExercises && totalExercises > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [completedCount, totalExercises]);

  // Calculate total points
  const totalPoints = exercises.reduce((sum, ex) => sum + (ex.points || 0), 0);
  const phaseLabel = scoreToPhase(patientData?.srsScore || 0);
  const regionLabel = Array.isArray(patientData?.activeRegions) ? patientData.activeRegions.join(', ') : patientData?.region || '';

  return (
    <>
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
            <div className="flex items-center gap-8 items-center">
              <Dumbbell className="w-12 h-12 text-white opacity-90" />
              <h2 className="text-3xl font-bold text-white">Movement Session</h2>
            </div>
            <p className="mt-2 text-btl-100 text-sm">
              Your personalized exercise routine for today. Complete these exercises to improve strength and mobility.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-colors hover:bg-white/25 hover:border-white/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                tabIndex={0}
                role="button"
                title="Your current recovery phase based on SRS"
                onClick={() => alert('Phase details coming soon!')}
              >
                <Target className="w-5 h-5 stroke-2" />
                <span>{phaseLabel} Phase</span>
              </div>
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-colors hover:bg-white/25 hover:border-white/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                tabIndex={0}
                role="button"
                title="Region(s) of focus for your recovery"
                onClick={() => alert('Region details coming soon!')}
              >
                <Activity className="w-5 h-5 stroke-2" />
                <span>{regionLabel} Focus</span>
              </div>
              <div
                className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 transition-colors hover:bg-white/25 hover:border-white/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60"
                tabIndex={0}
                role="button"
                title="Your current Signature Recovery Score (SRS)"
                onClick={() => alert('SRS details coming soon!')}
              >
                <Gauge className="w-5 h-5 stroke-2" />
                <span>SRS: {patientData?.srsScore}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar: revert to previous solid blue style */}
          <div className="px-6 py-4 bg-btl-50 border-b border-btl-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-btl-700">Session Progress</span>
              <span className="text-sm font-medium text-btl-600">{completedCount} of {totalExercises} completed</span>
            </div>
            <div className="w-full bg-btl-200 rounded-full h-3">
              <div
                className="bg-btl-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0}%` }}
              />
            </div>
          </div>

          <AssessmentDialogBody className="flex-1 p-6 overflow-y-auto" style={{ maxHeight: '600px' }}>
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
              <div className="text-center text-btl-600">No exercises found for your current phase and region.</div>
            )}
            
            {exercises.length > 0 && (
              <div className="exercise-list-container bg-white rounded-xl divide-y divide-gray-200 overflow-hidden flex flex-col gap-0" style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {exercises.slice(0, 3).map((ex: Exercise, idx: number) => {
                  const isCompleted = completedExercises.has(ex.id || idx.toString());
                  return (
                    <div
                      key={ex.id || idx}
                      className={`flex items-center justify-between p-4 rounded-xl border border-gray-200 transition-all duration-200 group cursor-pointer hover:bg-btl-50 hover:shadow-md
                        ${isCompleted ? 'bg-gray-50 opacity-75' : 'bg-white'}
                      `}
                      onClick={() => {
                        if (isCompleted) {
                          toggleExerciseCompletion(ex.id || idx.toString());
                        } else {
                          setSelectedExercise(ex);
                        }
                      }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                          isCompleted ? 'bg-green-500' : 'bg-btl-600'
                        }`}>
                          {isCompleted ? (
                            <Check className="w-5 h-5 text-white" />
                          ) : (
                            <span className="text-white text-base font-semibold">{idx + 1}</span>
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold transition-colors ${
                            isCompleted ? 'text-gray-500 line-through' : 'text-gray-900 group-hover:text-btl-600'
                          }`}>
                            {ex.name}
                          </h3>
                          <p className="text-sm text-gray-500">{ex.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">{ex.difficulty}</span>
                        <span className="text-sm font-medium text-btl-600">+{ex.points} pts</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExercise(ex);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-btl-600 text-white hover:bg-btl-700 transition-colors font-medium text-sm"
                          aria-label="View exercise details"
                        >
                          <Play className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            {/* Action Buttons: only visible after scrolling past exercises */}
            <div className="flex flex-col items-center justify-center mt-8">
              {completedCount === totalExercises && totalExercises > 0 && (
                <div
                  className="flex items-center justify-center mb-8 px-5 py-2 rounded-xl bg-yellow-50 border shadow-md animate-celebrate pointer-events-auto"
                  style={{
                    borderColor: '#FFC700', // gold accent
                    borderWidth: '1px',
                    boxShadow: '0 4px 16px 0 rgba(255,199,0,0.10)',
                  }}
                >
                  <Award className="w-8 h-8 mr-3" style={{ color: '#FFC700' }} />
                  <span
                    className="font-extrabold text-xl tracking-wide text-blue-800"
                    style={{
                      color: '#155fa0',
                    }}
                  >
                    +{totalPoints} Recovery Points Earned!
                  </span>
                </div>
              )}
              <button
                className={`w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition-colors text-white text-lg shadow-md flex items-center justify-center gap-2
                  ${completedCount === totalExercises && totalExercises > 0 ? 'bg-green-500 hover:bg-green-600' : 'bg-btl-600 hover:bg-btl-700'}`}
                disabled={completedCount !== totalExercises || totalExercises === 0}
                onClick={() => {
                  if (completedCount === totalExercises && totalExercises > 0) {
                    setShowCelebration(true);
                  }
                }}
                title={completedCount === totalExercises && totalExercises > 0 ? 'Complete session' : 'Complete all exercises to finish session'}
              >
                {completedCount === totalExercises && totalExercises > 0 && (
                  <Check className="w-5 h-5 text-white" />
                )}
                Complete Movement Session
              </button>
              {completedCount !== totalExercises && totalExercises > 0 && (
                <span className="mt-2 text-sm text-gray-500">Complete all exercises to finish session.</span>
              )}
              {/* Close Session button at the very bottom, inside scrollable area */}
              <button
                className="mt-6 w-full sm:w-auto px-8 py-3 rounded-xl font-semibold transition-colors bg-gray-100 text-gray-700 text-lg shadow border border-gray-200 hover:bg-gray-200"
                onClick={onClose}
              >
                Close Session
              </button>
              {/* Reset Session button for development only */}
              {process.env.NODE_ENV === 'development' && (
                <button
                  className="mt-4 w-full sm:w-auto px-6 py-2 rounded-lg font-medium bg-btl-50 text-btl-600 border border-btl-200 hover:bg-btl-100 transition-colors text-base"
                  onClick={() => setCompletedExercises(new Set())}
                  type="button"
                >
                  Reset Session (Dev Only)
                </button>
              )}
            </div>
          </AssessmentDialogBody>

          {/* Celebration Toast */}
          {showCelebration && (
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div
                className="flex items-center gap-3 bg-white px-5 py-8 rounded-xl border shadow-md animate-celebrate pointer-events-auto"
                style={{
                  borderColor: '#FFC700',
                  borderWidth: '1px',
                  boxShadow: '0 4px 16px 0 rgba(255,199,0,0.10)',
                }}
              >
                <PartyPopper className="w-12 h-12 mr-4" style={{ color: '#FFC700' }} />
                <span
                  className="font-extrabold text-2xl tracking-wide text-blue-800"
                  style={{
                    color: '#155fa0',
                  }}
                >
                  Session Complete! +{totalPoints} Recovery Points Earned!
                </span>
              </div>
            </div>
          )}

        </AssessmentDialogContent>

        <ExerciseDetailsModal
          exercise={selectedExercise}
          open={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onComplete={(exerciseId) => {
            toggleExerciseCompletion(exerciseId);
            setSelectedExercise(null);
          }}
          isCompleted={selectedExercise ? completedExercises.has(selectedExercise.id || '') : false}
        />
      </AssessmentDialog>
    </>
  );
} 