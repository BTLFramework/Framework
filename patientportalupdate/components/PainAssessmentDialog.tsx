import { Heart, Award, PartyPopper } from "lucide-react";
import { useState } from "react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";
import { SkeletonCard } from "./SkeletonCard";

interface PainAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onTaskComplete?: (taskData: any) => void;
}

interface PainAssessment {
  level: number;
  location: string;
  type: string;
  notes: string;
}

const PAIN_TYPES = [
  "Sharp",
  "Dull",
  "Throbbing",
  "Burning",
  "Aching",
  "Stabbing",
  "Other"
];

const metallicPills = {
  bronze: 'bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142] rounded-full',
};

export function PainAssessmentDialog({ open, onClose, patientId, onTaskComplete }: PainAssessmentDialogProps) {
  const { data: patientData, error: patientError } = usePatientRecoveryData(patientId, 'pain', open);
  const [assessment, setAssessment] = useState<PainAssessment>({
    level: 0,
    location: "",
    type: "",
    notes: ""
  });
  const [showCelebration, setShowCelebration] = useState(false);

  const canSubmit =
    assessment.level > 0 &&
    assessment.location.trim().length > 0 &&
    assessment.type.trim().length > 0;

  const handleChange = (field: keyof PainAssessment, value: string | number) => {
    setAssessment((a) => ({ ...a, [field]: value }));
  };

  const handleSubmit = async () => {
    console.log('Complete Assessment clicked!');
    
    try {
      // Get patient ID from email first
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
        'Pain assessment completed',
        3
      );
      
      if (result.success) {
        console.log('✅ Recovery points added successfully:', result.pointsAdded);
        // Show celebration with actual points earned
        setShowCelebration(true);
        
        // Call parent's task completion handler to trigger refresh
        if (onTaskComplete) {
          onTaskComplete({
            taskId: 'pain-assessment',
            taskTitle: 'Pain Assessment',
            pointsEarned: 3,
            assessmentData: assessment
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
            taskId: 'pain-assessment',
            taskTitle: 'Pain Assessment',
            pointsEarned: 3,
            assessmentData: assessment
          });
        }
        
        // Close the dialog after a short delay
        setTimeout(() => {
          onClose();
        }, 2000);
      }
    } catch (error) {
      console.error('❌ Error completing assessment:', error);
      // Still show celebration
      setShowCelebration(true);
      
      // Still call parent's task completion handler
      if (onTaskComplete) {
        onTaskComplete({
          taskId: 'pain-assessment',
          taskTitle: 'Pain Assessment',
          pointsEarned: 3,
          assessmentData: assessment
        });
      }
      
      // Close the dialog after a short delay
      setTimeout(() => {
        onClose();
      }, 2000);
    }
  };

  if (!open) return null;
  if (patientData === undefined) {
    return (
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
            <div className="flex items-center gap-8">
              <Heart className="w-12 h-12 text-white opacity-90" />
              <h2 className="text-3xl font-bold text-white">Pain Assessment</h2>
            </div>
            <p className="mt-2 text-btl-100 text-sm">
              Please complete your daily pain assessment to help us track your recovery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
              <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5">
                <span>Assessment</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1.5 font-bold text-sm ${metallicPills.bronze}`}>
                +20 pts
              </div>
            </div>
          </div>
          <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
            <SkeletonCard title="Pain Assessment" icon={<Heart className="w-8 h-8 text-btl-400" />} />
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }
  if (patientError) {
    return (
      <AssessmentDialog open={open} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
            <div className="flex items-center gap-8">
              <Heart className="w-12 h-12 text-white opacity-90" />
              <h2 className="text-3xl font-bold text-white">Pain Assessment</h2>
            </div>
            <p className="mt-2 text-btl-100 text-sm">
              Please complete your daily pain assessment to help us track your recovery.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
              <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5">
                <span>Assessment</span>
              </div>
              <div className={`flex items-center gap-2 px-4 py-1.5 font-bold text-sm ${metallicPills.bronze}`}>
                +20 pts
              </div>
            </div>
          </div>
          <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
            <div className="text-center text-red-500 py-8">Error loading patient data.</div>
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center gap-8">
            <Heart className="w-12 h-12 text-white opacity-90" />
            <h2 className="text-3xl font-bold text-white">Pain Assessment</h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            Please complete your daily pain assessment to help us track your recovery.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5">
              <span>Assessment</span>
            </div>
            <div className={`flex items-center gap-2 px-4 py-1.5 font-bold text-sm ${metallicPills.bronze}`}>
              +20 pts
            </div>
          </div>
        </div>
        <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto" style={{ maxHeight: '600px' }}>
          <div className="flex flex-col gap-6 max-w-xl mx-auto w-full">
            {/* Pain Level */}
            <div className="bg-white rounded-xl shadow border border-btl-100 p-6 flex flex-col gap-2">
              <label className="font-semibold text-btl-700 text-lg mb-2 block">How would you rate your pain right now?</label>
              <input
                type="range"
                min={0}
                max={10}
                value={assessment.level}
                onChange={e => handleChange("level", Number(e.target.value))}
                className="w-full accent-btl-600"
              />
              <div className="flex justify-between w-full text-xs text-btl-600">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
              <div className="text-btl-700 font-bold text-2xl mt-2 text-center">{assessment.level}</div>
            </div>
            {/* Location */}
            <div className="bg-white rounded-xl shadow border border-btl-100 p-6 flex flex-col gap-2">
              <label className="font-semibold text-btl-700 text-lg mb-2 block">Where is your pain located?</label>
              <input
                type="text"
                value={assessment.location}
                onChange={e => handleChange("location", e.target.value)}
                className="rounded-lg border border-btl-200 px-3 py-2 focus:outline-btl-600 w-full"
                placeholder="e.g. Lower back, neck, etc."
              />
            </div>
            {/* Type */}
            <div className="bg-white rounded-xl shadow border border-btl-100 p-6 flex flex-col gap-2">
              <label className="font-semibold text-btl-700 text-lg mb-2 block">What type of pain is it?</label>
              <select
                value={assessment.type}
                onChange={e => handleChange("type", e.target.value)}
                className="rounded-lg border border-btl-200 px-3 py-2 focus:outline-btl-600 w-full"
              >
                <option value="">Select type</option>
                {PAIN_TYPES.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            {/* Notes */}
            <div className="bg-white rounded-xl shadow border border-btl-100 p-6 flex flex-col gap-2">
              <label className="font-semibold text-btl-700 text-lg mb-2 block">Any notes or details?</label>
              <textarea
                value={assessment.notes}
                onChange={e => handleChange("notes", e.target.value)}
                className="rounded-lg border border-btl-200 px-3 py-2 focus:outline-btl-600 w-full min-h-[80px]"
                placeholder="Optional"
              />
            </div>
          </div>
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
                  +3 Recovery Points Earned! 🎉
                </span>
              </div>
            </div>
          </div>
        )}

        <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className={`px-4 py-2 font-medium text-sm ${metallicPills.bronze}`}>
                Total: 3 pts
              </div>
            </div>
            <button
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                canSubmit
                  ? 'bg-green-500 text-white hover:bg-green-600'
                  : 'bg-btl-600 text-white hover:bg-btl-700'
              }`}
              disabled={!canSubmit}
            >
              {canSubmit ? (
                <div className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  Complete Assessment
                </div>
              ) : (
                'Complete Assessment'
              )}
            </button>
          </div>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 