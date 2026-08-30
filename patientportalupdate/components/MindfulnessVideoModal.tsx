import { useEffect, useState } from "react";
import { Brain, AlertCircle, Play, Check, Target, Activity, Gauge, Award, PartyPopper, X, Wind, Droplets, Zap, ChevronUp, ChevronDown } from "lucide-react";
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

interface MindfulnessVideoModalProps {
  practice: {
    id: string;
    title: string;
    description: string;
    duration: string;
    videoId: string;
    source: string;
    icon: React.ReactNode;
    color: string;
  };
  open: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function MindfulnessVideoModal({ practice, open, onClose, onComplete }: MindfulnessVideoModalProps) {
  const [showVideo, setShowVideo] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isFooterCollapsed, setIsFooterCollapsed] = useState(false);

  useEffect(() => {
    if (open) {
      setShowVideo(false);
      setIsCompleted(false);
    }
  }, [open]);

  if (!practice) return null;

  const getPracticeIcon = (practiceId: string) => {
    switch (practiceId) {
      case 'breathwork': return <Wind className="w-10 h-10 text-white opacity-90" />;
      case 'nsdr': return <Brain className="w-10 h-10 text-white opacity-90" />;
      case 'lymph': return <Droplets className="w-10 h-10 text-white opacity-90" />;
      case 'mindshift': return <Zap className="w-10 h-10 text-white opacity-90" />;
      default: return <Brain className="w-10 h-10 text-white opacity-90" />;
    }
  };

  const getPracticeInstructions = (practiceId: string) => {
    switch (practiceId) {
      case 'breathwork':
        return [
          "Find a comfortable seated position",
          "Place one hand on your chest and one on your belly",
          "Take a slow, deep breath in through your nose for 4 counts",
          "Hold the breath for 4 counts",
          "Exhale slowly through your mouth for 6 counts",
          "Repeat this cycle for the full duration"
        ];
      case 'nsdr':
        return [
          "Choose a safe place where you can lie down and fully rest",
          "Close your eyes and relax your body",
          "Follow Kitaro's guidance without forcing your breathing",
          "Allow thoughts and sensations to come and go without needing to fix them",
          "If your attention wanders, gently return to the guidance",
          "Take a moment before standing when the practice finishes"
        ];
      case 'lymph':
        return [
          "Follow the sequence gently rather than pressing firmly",
          "Use a comfortable position and range of movement",
          "Keep your breathing relaxed throughout",
          "This is an optional movement practice, not a treatment for a medical condition",
          "Skip any step that is uncomfortable or inappropriate for you",
          "Stop and seek appropriate advice if you have concerning symptoms"
        ];
      case 'mindshift':
        return [
          "Watch for the distinction between a stressor and your response to it",
          "Notice how mindset can change the way a demand is interpreted",
          "Choose one idea that feels relevant rather than trying to use everything",
          "Connect that idea to a current, manageable situation",
          "Choose one response that is within your control",
          "Aim for a balanced response—not forced positivity"
        ];
      default:
        return [
          "Find a comfortable position",
          "Close your eyes and relax",
          "Follow the guided instructions",
          "Stay present and mindful",
          "Complete the full session"
        ];
    }
  };

  const getPracticeCues = (practiceId: string) => {
    switch (practiceId) {
      case 'breathwork':
        return [
          "Breathe from your diaphragm, not your chest",
          "Keep your shoulders relaxed",
          "Maintain a steady rhythm",
          "Focus on the sensation of breathing"
        ];
      case 'nsdr':
        return [
          "Let go of any tension in your body",
          "Don't try to control your thoughts",
          "Stay in the present moment",
          "Trust the process of deep rest"
        ];
      case 'lymph':
        return [
          "Keep pressure and movement comfortable",
          "There is no need to chase a strong sensation",
          "Breathe normally; do not force or hold your breath",
          "Use it as a brief movement break if it feels useful"
        ];
      case 'mindshift':
        return [
          "Stress is not a personal failure",
          "Thoughts and predictions are information—not always facts",
          "Confidence can grow from manageable action",
          "Use the lesson to create options, not another rule to perfect"
        ];
      default:
        return [
          "Stay present and focused",
          "Be patient with yourself",
          "Trust the process",
          "Practice regularly for best results"
        ];
    }
  };

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-4xl max-h-[95vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <AssessmentDialogHeader className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-6 pt-6 pb-1 border-b border-white/40 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-white hover:bg-white/20 focus:bg-white/30 transition-all duration-200 hover:scale-110 focus:scale-110"
            aria-label="Close"
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            {getPracticeIcon(practice.id)}
            <div className="flex flex-col">
              <AssessmentDialogTitle className="text-3xl font-semibold leading-tight text-white">
                {practice.title}
              </AssessmentDialogTitle>
              <AssessmentDialogDescription className="text-base font-medium text-btl-100 mt-1">
                {practice.description}
              </AssessmentDialogDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-8 mb-4 text-btl-100">
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group">
              <Target className="w-5 h-5 stroke-2" />
              <span>{practice.duration}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group">
              <Activity className="w-5 h-5 stroke-2" />
              <span>Mindfulness</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group">
              <Gauge className="w-5 h-5 stroke-2" />
              <span>Beginner</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5 text-sm whitespace-nowrap transition-all duration-200 hover:bg-white/25 hover:border-white/50 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/60 group">
              <Award className="w-5 h-5 stroke-2" />
              <span>+5 Points</span>
            </div>
          </div>
        </AssessmentDialogHeader>
        <AssessmentDialogBody className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto w-full">
            {/* Video Section - Show immediately */}
            <div className="mb-8 p-2 max-w-2xl mx-auto">
              <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${practice.videoId}`}
                  title={`${practice.title} — ${practice.source}`}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 text-sm text-gray-600">
                Video: <span className="font-medium text-btl-800">{practice.source}</span>
              </p>
            </div>

            {/* Instructions Section */}
            <div className="instructions-section mb-6 p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-cyan-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-cyan-800 mb-2">How to Practice:</h4>
                  <ol className="space-y-2">
                    {getPracticeInstructions(practice.id).map((instruction: string, i: number) => (
                      <li key={i} className="flex text-sm text-cyan-700">
                        <span className="mr-2 text-cyan-500 px-2 py-0.5 rounded-full bg-cyan-100">{i + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>

            {/* Cues Section */}
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-2">Key Tips:</h4>
                  <ul className="space-y-1">
                    {getPracticeCues(practice.id).map((cue: string, i: number) => (
                      <li key={i} className="flex text-sm text-yellow-700">
                        <span className="mr-2 text-yellow-500 px-1.5 py-0.5 rounded-full bg-yellow-100">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Spacer for footer */}
            <div className="h-20"></div>
          </div>
        </AssessmentDialogBody>

        {/* Footer */}
        <AssessmentDialogFooter className="p-4 border-t border-gray-100">
          <div className="flex items-center justify-between w-full">
            <button
              onClick={() => {
                const instructionsSection = document.querySelector('.instructions-section');
                if (instructionsSection) {
                  instructionsSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="px-6 py-2 rounded-full font-semibold transition-colors bg-btl-600 text-white shadow-md hover:bg-btl-700"
            >
              Instructions
            </button>
            <button
              onClick={() => {
                setIsCompleted(true);
                if (onComplete) {
                  onComplete();
                }
                // Don't close the main dialog - let it handle the celebration and mood modal
                setTimeout(() => {
                  onClose(); // Only close the video modal
                  setIsCompleted(false);
                }, 1000); // Shorter delay to show completion state
              }}
              className={`px-6 py-2 rounded-full font-semibold transition-colors text-white shadow-md flex items-center justify-center gap-2
                ${isCompleted ? 'bg-green-500 hover:bg-green-600' : 'bg-btl-600 hover:bg-btl-700'}`}
            >
              {isCompleted && <Check className="w-5 h-5 text-white" />}
              {isCompleted ? 'Practice Completed!' : 'Mark as Complete'}
            </button>
          </div>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
}
