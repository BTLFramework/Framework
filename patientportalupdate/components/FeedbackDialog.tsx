import { AssessmentDialog, AssessmentDialogContent, AssessmentDialogHeader, AssessmentDialogTitle, AssessmentDialogDescription, AssessmentDialogBody, AssessmentDialogFooter } from "@/components/ui/assessment-dialog";
import { MessageCircle, HeartPulse, Wind, Brain, CalendarCheck2, Smile, Frown, Meh } from "lucide-react";
import React from "react";

interface FeedbackAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface FeedbackDialogProps {
  open: boolean;
  onClose: () => void;
  feedbackMessage: string;
  actions: FeedbackAction[];
}

export function FeedbackDialog({ open, onClose, feedbackMessage, actions }: FeedbackDialogProps) {
  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <AssessmentDialogHeader>
          <AssessmentDialogTitle className="flex items-center gap-3">
            <HeartPulse className="w-8 h-8 text-white" />
            Wellbeing Feedback
          </AssessmentDialogTitle>
          <AssessmentDialogDescription>
            Thoughtful, evidence-based support for your recovery journey
          </AssessmentDialogDescription>
        </AssessmentDialogHeader>
        <AssessmentDialogBody>
          <div className="flex flex-col items-center justify-center gap-6 py-8">
            <div className="text-xl font-semibold text-gray-900 text-center max-w-xl">
              {feedbackMessage}
            </div>
            <div className="flex flex-wrap gap-4 justify-center mt-4">
              {actions.map((action, idx) => (
                <button
                  key={idx}
                  onClick={action.onClick}
                  className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-btl-600 to-btl-500 text-white font-semibold shadow-md hover:from-btl-700 hover:to-btl-600 hover:shadow-xl transition-all duration-200 text-base focus:outline-none focus:ring-2 focus:ring-btl-400"
                >
                  {action.icon}
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </div>
        </AssessmentDialogBody>
        <AssessmentDialogFooter className="px-6 py-4 bg-white border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-2xl font-medium transition-all duration-200 shadow-lg bg-gray-300 text-gray-700 hover:bg-gray-400 hover:text-white"
          >
            Close
          </button>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 