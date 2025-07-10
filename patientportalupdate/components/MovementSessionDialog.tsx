import { useEffect, useState } from "react";
import { Dumbbell, AlertCircle, Play, Check, Target, Activity, Gauge, Award, PartyPopper } from "lucide-react";
import { useAssignedExercises } from "@/hooks/useAssignedExercises";
import type { Exercise } from "@/types/exercise";
import { ExerciseDetailsModal } from "@/components/exercise-details-modal";
import { ExerciseVideoModal } from "@/components/exercise-video-modal";
import { addRecoveryPoints, RecoveryPointActivity } from "@/lib/recoveryPointsApi";
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
  onTaskComplete?: (taskData: any) => void;
}

// Helper for phase label
function scoreToPhase(score: number) {
  if (score <= 3) return "RESET";
  if (score <= 6) return "EDUCATE";
  return "REBUILD";
}

// Helper for metallic pill classes (for celebration, etc.)
const metallicPills = {
  gold: 'bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 text-white shadow border border-btl-600 rounded-full',
  silver: 'bg-gradient-to-br from-btl-800 via-btl-600 to-btl-200 text-white shadow border border-btl-500 rounded-full',
  bronze: 'bg-gradient-to-br from-btl-700 via-btl-500 to-btl-300 text-white shadow border border-btl-400 rounded-full',
};

// Determine points pill color based on total points
const getPointsPill = (points: number) => {
  if (points >= 10) return metallicPills.gold;
  if (points >= 7) return metallicPills.silver;
  return metallicPills.bronze;
};

export function MovementSessionDialog({ open, onClose, patientId, onTaskComplete }: MovementSessionDialogProps) {
  // Fetch assigned exercises from backend
  const { data: exerciseData, error: exerciseError, loading: exerciseLoading } = useAssignedExercises(patientId);

  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());
  const [watchedVideos, setWatchedVideos] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  
  const exercises = exerciseData?.exercises || [];
  const completedCount = completedExercises.size;
  const watchedCount = watchedVideos.size;
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
    if (watchedCount === totalExercises && totalExercises > 0) {
      setShowCelebration(true);
      // Keep banner visible - no auto-hide
    }
  }, [watchedCount, totalExercises]);

  // Calculate total points
  const totalPoints = exerciseData?.totalPoints || 0;
  const phaseLabel = exerciseData?.phase ? scoreToPhase(exerciseData.srsScore) : "EDUCATE";
  const regionLabel = exerciseData?.region || "Neck";

  // Navigation functions for the pills
  const handlePhaseClick = () => {
    // Dispatch custom event to open exercise videos modal
    const event = new CustomEvent('openExerciseVideos', {
      detail: { filter: 'phase', value: phaseLabel }
    });
    window.dispatchEvent(event);
    onClose(); // Close the movement session dialog
  };

  const handleRegionClick = () => {
    // Dispatch custom event to open exercise videos modal
    const event = new CustomEvent('openExerciseVideos', {
      detail: { filter: 'region', value: regionLabel }
    });
    window.dispatchEvent(event);
    onClose(); // Close the movement session dialog
  };

  const handleSRSClick = () => {
    // Dispatch custom event to open recovery score modal
    const event = new CustomEvent('openRecoveryScore');
    window.dispatchEvent(event);
    onClose(); // Close the movement session dialog
  };

  return (
    <>
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <AssessmentDialogTitle className="sr-only">Movement Session</AssessmentDialogTitle>
          <AssessmentDialogDescription className="sr-only">
            Your personalized exercise routine for today. Complete these exercises to improve strength and mobility.
          </AssessmentDialogDescription>
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
                <span>SRS: {exerciseData?.srsScore || 0}</span>
                <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">→</span>
              </div>
            </div>
          </div>

          {/* Progress Bar: revert to previous solid blue style */}
          <div className="px-6 py-3 border-b border-gray-200">
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

          <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
            {exerciseLoading && (
              <div className="text-center text-btl-600 py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-btl-600 mx-auto mb-4"></div>
                Loading exercises...
              </div>
            )}
            
            {exerciseError && (
              <div className="text-center text-red-500 py-8">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                Error loading exercises: {exerciseError}
              </div>
            )}
            
            {!exerciseLoading && !exerciseError && exercises.length === 0 && (
              <div className="text-center text-btl-600">No exercises found for your current phase and region.</div>
            )}
            
            {exercises.length > 0 && (
              <div className="exercise-list-container bg-white rounded-xl overflow-hidden flex flex-col gap-2 p-3" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {exercises.map((ex: Exercise, idx: number) => {
                  const isCompleted = completedExercises.has(ex.id || idx.toString());
                  return (
                    <div
                      key={ex.id || idx}
                      className={`flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-200 group cursor-pointer hover:bg-btl-50 hover:shadow-md
                        ${isCompleted ? 'bg-gray-50 opacity-75 border-gray-300' : 'bg-white border-gray-200'}
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
                            isCompleted ? 'text-gray-500' : 'text-gray-900 group-hover:text-btl-600'
                          }`}>
                            {ex.name}
                          </h3>
                          <p className="text-sm text-gray-500">{ex.duration}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">{ex.difficulty}</span>
                        <span className="text-sm font-medium text-btl-600 px-2 py-0.5 rounded-full bg-btl-100">+{ex.points} pts</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedExercise(ex);
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-btl-600 text-white hover:bg-btl-700 transition-colors font-medium text-sm border-2 border-btl-600"
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
          </AssessmentDialogBody>

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

          {/* Footer with Action Buttons */}
          <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-3">
                <div className={`px-4 py-2 font-medium text-sm ${getPointsPill(totalPoints)}`}>
                  Total: {totalPoints} pts
                </div>
                <button
                  onClick={() => {
                    setCompletedExercises(new Set());
                    setWatchedVideos(new Set());
                    setShowCelebration(false);
                  }}
                  className="px-3 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 font-medium text-sm transition-colors"
                >
                  Dev Reset
                </button>
              </div>
                              <button
                  onClick={async () => {
                    console.log('Complete Session clicked!');
                    
                    try {
                      // Mark all exercises as completed and watched
                      const allExerciseIds = exercises.map((ex, idx) => ex.id || idx.toString());
                      setCompletedExercises(new Set(allExerciseIds));
                      setWatchedVideos(new Set(allExerciseIds));
                      
                      // Get patient ID from email first
                      const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`)
                      if (!patientResponse.ok) {
                        throw new Error('Failed to get patient data')
                      }
                      const patientData = await patientResponse.json()
                      const numericPatientId = patientData.data.patient.id
                      
                      // Add recovery points for the completed session
                      const result = await addRecoveryPoints(
                        numericPatientId.toString(),
                        'MOVEMENT',
                        'Movement session completed',
                        totalPoints
                      );
                      
                      if (result.success) {
                        console.log('✅ Recovery points added successfully:', result.pointsAdded);
                        // Show celebration with actual points earned
                        setShowCelebration(true);
                        
                        // Call parent's task completion handler to trigger refresh
                        if (onTaskComplete) {
                          onTaskComplete({
                            taskId: 'movement-session',
                            taskTitle: 'Movement Session',
                            pointsEarned: totalPoints,
                            newSRSScore: exerciseData?.srsScore || 0,
                            phase: exerciseData?.phase || 'EDUCATE'
                          });
                        }
                        
                        // Close the dialog after a short delay to show celebration
                        setTimeout(() => {
                          onClose();
                        }, 2000);
                      } else {
                        console.error('❌ Failed to add recovery points:', result.error);
                        // Still show celebration but log the error
                        setShowCelebration(true);
                        
                        // Still call parent's task completion handler
                        if (onTaskComplete) {
                          onTaskComplete({
                            taskId: 'movement-session',
                            taskTitle: 'Movement Session',
                            pointsEarned: totalPoints,
                            newSRSScore: exerciseData?.srsScore || 0,
                            phase: exerciseData?.phase || 'EDUCATE'
                          });
                        }
                        
                        // Close the dialog after a short delay
                        setTimeout(() => {
                          onClose();
                        }, 2000);
                      }
                    } catch (error) {
                      console.error('❌ Error completing session:', error);
                      // Still mark as completed locally
                      const allExerciseIds = exercises.map((ex, idx) => ex.id || idx.toString());
                      setCompletedExercises(new Set(allExerciseIds));
                      setWatchedVideos(new Set(allExerciseIds));
                      setShowCelebration(true);
                      
                      // Still call parent's task completion handler
                      if (onTaskComplete) {
                        onTaskComplete({
                          taskId: 'movement-session',
                          taskTitle: 'Movement Session',
                          pointsEarned: totalPoints,
                          newSRSScore: exerciseData?.srsScore || 0,
                          phase: exerciseData?.phase || 'EDUCATE'
                        });
                      }
                      
                      // Close the dialog after a short delay
                      setTimeout(() => {
                        onClose();
                      }, 2000);
                    }
                  }}
                  className={`px-6 py-2 rounded-full font-medium transition-colors ${
                    watchedCount === totalExercises
                      ? 'bg-green-500 text-white hover:bg-green-600'
                      : 'bg-btl-600 text-white hover:bg-btl-700'
                  }`}
                >
                {watchedCount === totalExercises ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Session Complete
                  </div>
                ) : (
                  'Complete Session'
                )}
              </button>
            </div>
          </AssessmentDialogFooter>
        </AssessmentDialogContent>
      </AssessmentDialog>

      {selectedExercise && (
        <ExerciseDetailsModal
          exercise={selectedExercise}
          open={!!selectedExercise}
          onClose={() => setSelectedExercise(null)}
          onComplete={() => {
            if (selectedExercise) {
              toggleExerciseCompletion(selectedExercise.id || '');
              setSelectedExercise(null);
            }
          }}
          onVideoWatched={(exerciseId: string) => {
            setWatchedVideos(prev => new Set([...prev, exerciseId]));
          }}
          isCompleted={selectedExercise ? completedExercises.has(selectedExercise.id || '') : false}
        />
      )}


    </>
  );
} 