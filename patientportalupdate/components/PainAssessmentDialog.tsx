import { Heart, AlertCircle } from "lucide-react";
import { useState } from "react";
import { usePatientRecoveryData } from "@/hooks/usePatientData";
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

interface PainAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
}

interface PainAssessment {
  level: number;
  location: string;
  type: string;
  notes: string;
}

export function PainAssessmentDialog({ open, onClose, patientId }: PainAssessmentDialogProps) {
  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(patientId);
  const [assessment, setAssessment] = useState<PainAssessment>({
    level: 0,
    location: "",
    type: "",
    notes: ""
  });

  const steps = ["Pain Level", "Location", "Type", "Notes"];
  const currentStep = assessment.level > 0 ? 1 : 0;
  const completedSteps = [
    assessment.level > 0,
    !!assessment.location,
    !!assessment.type,
    !!assessment.notes
  ].filter(Boolean).length;

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent>
        <AssessmentDialogHeader>
          <AssessmentDialogTitle className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-white" />
            Pain Assessment
          </AssessmentDialogTitle>
          <AssessmentDialogDescription>
            Track your pain levels and symptoms to help us understand your recovery progress.
          </AssessmentDialogDescription>
          <AssessmentDialogProgress 
            step={completedSteps} 
            totalSteps={steps.length} 
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
          
          {!patientLoading && !patientError && (
            <div className="space-y-4">
              {/* Pain Level */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Pain Level</h3>
                  </div>
                  <div className="text-sm font-medium text-btl-600">+5 pts</div>
                </div>
                <p className="text-gray-600 mb-4">Rate your current pain level from 0 (no pain) to 10 (worst pain).</p>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={assessment.level}
                    onChange={(e) => setAssessment({ ...assessment, level: parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-btl-600"
                  />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>No Pain (0)</span>
                    <span>Moderate (5)</span>
                    <span>Severe (10)</span>
                  </div>
                  <div className="text-center text-2xl font-bold text-btl-600">
                    {assessment.level}
                  </div>
                </div>
              </div>

              {/* Pain Location */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Pain Location</h3>
                  </div>
                  <div className="text-sm font-medium text-btl-600">+5 pts</div>
                </div>
                <p className="text-gray-600 mb-4">Select the area where you're experiencing pain.</p>
                <select
                  value={assessment.location}
                  onChange={(e) => setAssessment({ ...assessment, location: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-btl-500"
                >
                  <option value="">Select location...</option>
                  <option value="neck">Neck</option>
                  <option value="shoulder">Shoulder</option>
                  <option value="back">Back</option>
                  <option value="hip">Hip</option>
                  <option value="knee">Knee</option>
                  <option value="ankle">Ankle</option>
                </select>
              </div>

              {/* Pain Type */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Pain Type</h3>
                  </div>
                  <div className="text-sm font-medium text-btl-600">+5 pts</div>
                </div>
                <p className="text-gray-600 mb-4">Describe the type of pain you're experiencing.</p>
                <select
                  value={assessment.type}
                  onChange={(e) => setAssessment({ ...assessment, type: e.target.value })}
                  className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-btl-500"
                >
                  <option value="">Select type...</option>
                  <option value="sharp">Sharp</option>
                  <option value="dull">Dull</option>
                  <option value="aching">Aching</option>
                  <option value="burning">Burning</option>
                  <option value="throbbing">Throbbing</option>
                  <option value="stabbing">Stabbing</option>
                </select>
              </div>

              {/* Additional Notes */}
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-500 to-cyan-600"></div>
                    <h3 className="text-lg font-semibold text-gray-900">Additional Notes</h3>
                  </div>
                  <div className="text-sm font-medium text-btl-600">+5 pts</div>
                </div>
                <p className="text-gray-600 mb-4">Add any additional details about your pain or symptoms.</p>
                <textarea
                  value={assessment.notes}
                  onChange={(e) => setAssessment({ ...assessment, notes: e.target.value })}
                  placeholder="Describe when the pain occurs, what makes it better or worse..."
                  className="w-full h-32 p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-btl-500 resize-none"
                />
              </div>
            </div>
          )}
        </AssessmentDialogBody>

        <AssessmentDialogFooter>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {/* TODO: Implement assessment submission */}}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-btl-600 text-white hover:bg-btl-700 transition-colors"
            disabled={completedSteps < steps.length}
          >
            Submit Assessment
          </button>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 