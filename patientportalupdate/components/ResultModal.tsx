import { AssessmentDialog, AssessmentDialogContent, AssessmentDialogBody } from "@/components/ui/assessment-dialog";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { CheckCircle, Wind } from "lucide-react";
import React, { useState } from "react";
import { tierContent } from "@/content/assessmentResponses";

// Tool content for modal rendering
const TOOL_CONTENT: Record<string, { title: string; description: string; content: React.ReactNode }> = {
  '478': {
    title: '4-7-8 Breathing Exercise',
    description: 'A calming breathwork technique to help reduce stress and anxiety.',
    content: (
      <>
        <h2 className="text-2xl font-bold mb-2">4-7-8 Breathing Exercise</h2>
        <p className="mb-4">Follow these steps:</p>
        <ol className="list-decimal list-inside mb-4">
          <li>Inhale quietly through your nose for 4 seconds</li>
          <li>Hold your breath for 7 seconds</li>
          <li>Exhale completely through your mouth for 8 seconds</li>
          <li>Repeat for 4 breath cycles</li>
        </ol>
        <p className="mb-4">This technique can help calm your nervous system and reduce stress. Try it whenever you need a reset.</p>
      </>
    )
  },
  'gratitude': {
    title: 'Quick Gratitude Check-in',
    description: 'A moment to reflect on something positive today.',
    content: (
      <>
        <h2 className="text-2xl font-bold mb-2">Quick Gratitude Check-in</h2>
        <p className="mb-4">Take a moment to think of one thing you're grateful for today. It can be big or small. This simple practice can help shift your mindset and boost your mood.</p>
      </>
    )
  },
  'mindfulness': {
    title: 'Mindfulness Reset',
    description: 'A short mindfulness exercise to help your body and mind reset.',
    content: (
      <>
        <h2 className="text-2xl font-bold mb-2">Mindfulness Reset</h2>
        <p className="mb-4">Sit comfortably, close your eyes, and focus on your breath for 2 minutes. Notice any sensations, thoughts, or feelings without judgment. When you're ready, open your eyes and notice how you feel.</p>
      </>
    )
  }
};

interface ResultModalProps {
  message: string;
  label: string;
  route: string;
  onClose: () => void;
  tier?: number;
  escalate?: boolean;
  debugInfo?: {
    pain: number;
    stress: number;
    mood: string;
    painConverted: number;
    stressConverted: number;
    tier: number;
  };
}

const ResultModal: React.FC<ResultModalProps> = ({ message, label, route, onClose, tier, escalate, debugInfo }) => {
  const router = useRouter();
  const isTier4 = tier === 4;
  const [toolKey, setToolKey] = useState<string | null>(null);

  // Get tier config
  const tierCfg = (tierContent[tier as 1|2|3|4] || {}) as any;
  const showToolModal = toolKey && TOOL_CONTENT[toolKey];

  // Helper to extract tool key from route
  const getToolKeyFromRoute = (route: string) => {
    if (route.startsWith('/recovery-tools/')) {
      return route.replace('/recovery-tools/', '');
    }
    return null;
  };

  // Render tool content in modal
  if (showToolModal) {
    const tool = TOOL_CONTENT[toolKey!];
    return (
      <AssessmentDialog open={true} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header - Fixed */}
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-4 pb-8 border-b border-white/40 rounded-t-2xl flex-shrink-0">
            <div className="flex items-center gap-6">
              <CheckCircle className="w-10 h-10 text-white opacity-90" />
              <div>
                <h2 className="text-2xl font-bold leading-tight mb-1 text-white">{tool.title}</h2>
                <p className="text-white text-sm">{tool.description}</p>
              </div>
            </div>
          </div>
          
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto">
            <AssessmentDialogBody className="py-4 px-8">
              <div className="mx-auto max-w-lg w-full bg-white/90 rounded-2xl shadow-lg px-6 py-6 flex flex-col items-center -mt-6 z-10 border border-white/60">
                <h3 className="text-2xl font-extrabold text-btl-900 mb-0 text-center">{tool.title}</h3>
                <p className="text-btl-700 text-base mb-3 text-center">{tool.description}</p>
                {/* Special rendering for steps if present */}
                {toolKey === '478' ? (
                  <>
                    <p className="text-btl-700 text-lg mb-2 text-center font-medium">Follow these steps:</p>
                    <ol className="mb-3 w-full flex flex-col gap-2 items-center">
                      <li className="flex items-center gap-3 w-full">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-btl-200 text-btl-700 font-bold text-lg shadow">1</span>
                        <span className="text-btl-900 text-base font-medium">Inhale quietly through your nose for 4 seconds</span>
                      </li>
                      <li className="flex items-center gap-3 w-full">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-btl-200 text-btl-700 font-bold text-lg shadow">2</span>
                        <span className="text-btl-900 text-base font-medium">Hold your breath for 7 seconds</span>
                      </li>
                      <li className="flex items-center gap-3 w-full">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-btl-200 text-btl-700 font-bold text-lg shadow">3</span>
                        <span className="text-btl-900 text-base font-medium">Exhale completely through your mouth for 8 seconds</span>
                      </li>
                      <li className="flex items-center gap-3 w-full">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-btl-200 text-btl-700 font-bold text-lg shadow">4</span>
                        <span className="text-btl-900 text-base font-medium">Repeat for 4 breath cycles</span>
                      </li>
                    </ol>
                    <p className="text-btl-600 text-base mb-3 text-center">This technique can help calm your nervous system and reduce stress. Try it whenever you need a reset.</p>
                  </>
                ) : (
                  <div className="mb-3 w-full text-center">{tool.content}</div>
                )}
              </div>
            </AssessmentDialogBody>
          </div>
          
          {/* Sticky Footer */}
          <div className="px-8 py-6 border-t border-gray-200 bg-white flex-shrink-0 flex justify-center items-center">
            <Button
              onClick={onClose}
              className="bg-btl-600 hover:bg-btl-700 text-white px-10 py-4 rounded-full font-semibold w-full max-w-xs shadow-lg text-lg"
            >
              Done
            </Button>
          </div>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  return (
    <AssessmentDialog open={true} onOpenChange={onClose}>
      <AssessmentDialogContent className={`max-w-3xl p-0 overflow-hidden max-h-[90vh] flex flex-col ${isTier4 ? 'border-2 border-orange-400' : ''}`}>
        {/* Header - Fixed */}
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 rounded-t-2xl flex-shrink-0">
          <div className="flex items-center gap-6">
            <CheckCircle className="w-10 h-10 text-white opacity-90" />
            <div>
              <h2 className="text-2xl font-bold leading-tight mb-1 text-white">
                {isTier4 ? 'High Pain & Stress—Let\'s Get You Support' : 'Thank you for checking in!'}
              </h2>
              {!isTier4 && (
                <p className="text-white text-sm">Your feedback helps us personalize your recovery journey</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto">
          <AssessmentDialogBody className="py-8 px-8 flex flex-col items-center justify-center">
            {isTier4 && escalate && (
              <div className="mb-4 bg-orange-100 text-orange-800 rounded-lg px-4 py-2 text-sm font-medium max-w-md mx-auto">
                Your care team has been notified—feel free to choose an option below.
              </div>
            )}
            {/* Carded content for all non-tool modals */}
            <div className="mx-auto max-w-lg w-full bg-white/90 rounded-2xl shadow-lg px-8 py-10 flex flex-col items-center">
              {!isTier4 && (
                <CheckCircle className="w-12 h-12 text-btl-600 mb-4" />
              )}
              <p className="text-gray-700 mb-8 text-lg text-center">
                {isTier4
                  ? 'Pain and stress are high right now. First, take a slow breath. A three-minute calming exercise can help—then, if you\'d like extra support, book a quick check-in.'
                  : message}
              </p>
            </div>
          </AssessmentDialogBody>
        </div>
        
        {/* Sticky Footer */}
        <div className="px-8 py-6 border-t border-gray-200 bg-white flex-shrink-0">
          {/* Tier 4: dual CTA, others: single CTA */}
          {tier === 4 ? (
            <div className="flex flex-col gap-3 mt-2">
              <button
                className="w-full max-w-sm mx-auto px-4 py-2 rounded-xl font-medium text-base bg-btl-600 text-white shadow-lg hover:bg-btl-700 transition-colors flex items-center justify-center gap-2"
                onClick={() => window.open('https://your-jane-app-link.com', '_blank')}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                Book a Check-In
              </button>
              <button
                className="w-full max-w-sm mx-auto px-4 py-2 rounded-xl font-medium text-base bg-white text-btl-700 border border-btl-200 shadow hover:bg-btl-50 hover:shadow-md transition-colors flex items-center justify-center gap-2"
                onClick={() => window.location.href='/messages'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" /></svg>
                Talk to Your Provider
              </button>
              <button
                className="w-full max-w-sm mx-auto px-4 py-2 rounded-xl font-medium text-base bg-white text-emerald-700 border border-emerald-200 shadow hover:bg-emerald-50 hover:shadow-md transition-colors flex items-center justify-center gap-2"
                onClick={() => window.location.href='/recovery-tools?focus=breathing'}
              >
                <Wind className="w-5 h-5" />
                Breathing Exercise
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <Button
                onClick={() => {
                  const toolKey = getToolKeyFromRoute(tierCfg.cta.route);
                  if (toolKey && TOOL_CONTENT[toolKey]) {
                    setToolKey(toolKey);
                  } else if (tierCfg.cta.route.startsWith('http')) {
                    window.open(tierCfg.cta.route, '_blank');
                    onClose();
                  } else {
                    router.push(tierCfg.cta.route);
                    onClose();
                  }
                }}
                className="bg-btl-600 hover:bg-btl-700 text-white px-8 py-3 rounded-full font-medium w-full max-w-xs mx-auto"
              >
                {tierCfg.cta.label}
              </Button>
            </div>
          )}
        </div>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
};

export default ResultModal; 