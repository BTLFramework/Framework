import { useState } from "react";
import { classifyTier, Mood, AssessmentInput } from "@/utils/assessment";
import { tierContent } from "@/content/assessmentResponses";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";
import ResultModal from "./ResultModal";

interface PainAssessmentDialogProps {
  open: boolean;
  onClose: () => void;
  patientId: string;
  onTaskComplete?: (taskData: any) => void;
}

const painEmojiOptions = [
  { value: 0, emoji: "😌", label: "No pain / Relaxed" },
  { value: 1, emoji: "🙂", label: "Mild discomfort" },
  { value: 2, emoji: "😕", label: "Annoying pain" },
  { value: 3, emoji: "😣", label: "Moderate pain" },
  { value: 4, emoji: "😖", label: "Severe pain" },
  { value: 5, emoji: "😫", label: "Very severe pain" },
  { value: 6, emoji: "🤕", label: "Worst imaginable" },
];

const moodOptions: { value: Mood; label: string; emoji: string }[] = [
  { value: "positive", label: "😊 Happy", emoji: "😊" },
  { value: "neutral", label: "😐 Neutral", emoji: "😐" },
  { value: "negative", label: "😕 Down", emoji: "😕" },
  { value: "distressed", label: "😭 Distressed", emoji: "😭" },
];

export function PainAssessmentDialog({ open, onClose, patientId, onTaskComplete }: PainAssessmentDialogProps) {
  const [pain, setPain] = useState<0|1|2|3|4|5|6>(0);
  const [stress, setStress] = useState<0|1|2|3>(0);
  const [mood, setMood] = useState<Mood | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [tier, setTier] = useState<1|2|3|4|undefined>();
  const [escalate, setEscalate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ tier: number; escalate: boolean } | null>(null);

  const canSubmit = pain !== null && stress !== 0 && mood !== null;

  const handleSubmit = async () => {
    if (!canSubmit || !mood) return;
    const input: AssessmentInput = { pain, stress, mood };
    const computedTier = classifyTier(input);
    setTier(computedTier);
    setShowResult(true);
    setSubmitting(true);
    // POST to API
    fetch("/api/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...input, tier: computedTier, patientId }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.escalate) setEscalate(true);
        if (onTaskComplete) onTaskComplete({ ...input, tier: computedTier, escalate: data.escalate });
        setResult({ tier: computedTier, escalate: data.escalate });
      })
      .catch(() => {})
      .finally(() => setSubmitting(false));
  };

  const handleClose = () => {
    setShowResult(false);
    setEscalate(false);
    setPain(0);
    setStress(0);
    setMood(null);
    setTier(undefined);
          onClose();
  };

  // Booking modal placeholder
  const openBookingModal = () => {
    window.location.href = tierContent[4].cta.route;
  };

    return (
    <>
      <AssessmentDialog open={open && !showResult} onOpenChange={onClose}>
        <AssessmentDialogContent>
          <AssessmentDialogBody>
            <h2 className="text-xl font-bold mb-4">How are you feeling today?</h2>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Pain Level</label>
              <div className="flex flex-row gap-2 justify-between items-center w-full">
                {painEmojiOptions.map(opt => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setPain(opt.value as 0|1|2|3|4|5|6)}
                    className={`flex flex-col items-center px-1 py-1 rounded-lg focus:outline-none transition-all duration-150 ${pain === opt.value ? 'bg-btl-100 ring-2 ring-btl-500' : 'bg-white hover:bg-btl-50'}`}
                    aria-label={opt.label}
                    tabIndex={0}
                  >
                    <span className="text-2xl" title={opt.label}>{opt.emoji}</span>
                    <span className="text-xs mt-1 text-gray-500" style={{ minWidth: 60, whiteSpace: 'nowrap', opacity: pain === opt.value ? 1 : 0 }}>{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Stress Level</label>
              <input type="range" min={0} max={3} value={stress} onChange={e => setStress(Number(e.target.value) as 0|1|2|3)} className="w-full" />
              <div className="flex justify-between text-xs mt-1">
                <span>0</span><span>1</span><span>2</span><span>3</span>
          </div>
            </div>
            <div className="mb-4">
              <label className="block font-semibold mb-1">Mood</label>
              <div className="flex gap-2">
                {moodOptions.map(opt => (
                  <button
                    key={opt.value}
                    className={`px-3 py-2 rounded-lg border ${mood === opt.value ? 'bg-blue-100 border-blue-500' : 'bg-white border-gray-200'}`}
                    onClick={() => setMood(opt.value)}
                    type="button"
                  >
                    <span className="text-2xl mr-1">{opt.emoji}</span> {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </AssessmentDialogBody>
          <AssessmentDialogFooter>
            <button
              className={`px-6 py-2 rounded-full font-medium transition-colors ${canSubmit ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-gray-300 text-gray-500'}`}
              disabled={!canSubmit || submitting}
              onClick={handleSubmit}
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </AssessmentDialogFooter>
        </AssessmentDialogContent>
      </AssessmentDialog>

      {result && (
        <ResultModal
          message={tierContent[result.tier as keyof typeof tierContent].message}
          label={tierContent[result.tier as keyof typeof tierContent].cta.label}
          route={tierContent[result.tier as keyof typeof tierContent].cta.route}
          onClose={() => setResult(null)}
        />
      )}
    </>
  );
} 