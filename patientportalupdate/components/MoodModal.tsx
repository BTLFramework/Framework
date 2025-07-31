import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { logMood } from '../lib/recoveryPointsApi';
import { FeedbackDialog } from './FeedbackDialog';
import { HeartPulse, Wind, Brain, MessageCircle, CalendarCheck2 } from 'lucide-react';

interface MoodModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onMoodLogged?: () => void;
}

const moodOptions = [
  { emoji: '😊', label: 'Happy', value: 'happy' },
  { emoji: '😌', label: 'Calm', value: 'calm' },
  { emoji: '😴', label: 'Relaxed', value: 'relaxed' },
  { emoji: '😐', label: 'Neutral', value: 'neutral' },
  { emoji: '😔', label: 'Sad', value: 'sad' },
  { emoji: '😤', label: 'Frustrated', value: 'frustrated' },
  { emoji: '😰', label: 'Anxious', value: 'anxious' },
  { emoji: '😡', label: 'Angry', value: 'angry' },
];

const NSDR_VIDEO_URL = 'https://www.youtube.com/watch?v=OHRfUWdgflM';

export function MoodModal({ open, onOpenChange, patientId, onMoodLogged }: MoodModalProps) {
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const [feedbackActions, setFeedbackActions] = useState<any[]>([]);
  const { toast } = useToast();

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood);
  };

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setIsSubmitting(true);
    try {
      const result = await logMood(patientId, selectedMood);
      if (result.success) {
        toast({
          title: "Mood logged!",
          description: "Thank you for sharing how you're feeling.",
        });
        // Determine feedback message and actions based on mood
        let message = "You’re making steady progress. Take a moment to notice what’s working for you today. Small wins matter.";
        let actions = [
          { label: 'Mindfulness Session', icon: <HeartPulse className='w-5 h-5' />, onClick: () => window.dispatchEvent(new CustomEvent('openMindfulnessSession')) },
          { label: 'Breathing Exercise', icon: <Wind className='w-5 h-5' />, onClick: () => window.dispatchEvent(new CustomEvent('openBreathingSession')) },
          { label: 'NSDR', icon: <Brain className='w-5 h-5' />, onClick: () => window.open(NSDR_VIDEO_URL, '_blank', 'noopener,noreferrer') },
          { label: 'Direct Message', icon: <MessageCircle className='w-5 h-5' />, onClick: () => window.dispatchEvent(new CustomEvent('openDirectMessage')) },
          { label: 'Book Appointment', icon: <CalendarCheck2 className='w-5 h-5' />, onClick: () => window.dispatchEvent(new CustomEvent('openBookAppointment')) },
        ];
        if (["sad", "frustrated", "anxious", "angry"].includes(selectedMood)) {
          message = "It’s understandable to feel this way when pain and stress are high. If you’d like, you can try a short mindfulness or breathing exercise to help your body and mind reset. If things feel overwhelming, consider reaching out to your care team for support.";
        } else if (["neutral", "relaxed", "calm"].includes(selectedMood)) {
          message = "Recovery can have ups and downs. If you’re feeling tense, a few minutes of slow breathing or gentle movement may help. Remember, it’s okay to take things one step at a time.";
        } else if (["happy"].includes(selectedMood)) {
          message = "You’re making steady progress. Take a moment to notice what’s working for you today. Small wins matter.";
        }
        setFeedbackMessage(message);
        setFeedbackActions(actions);
        setShowFeedback(true);
        onMoodLogged?.();
        // Do not close the modal yet, show feedback first
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to log mood. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to log mood. Please try again.",
        variant: "destructive",
      });
    }
    setIsSubmitting(false);
  };

  const handleSkip = () => {
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md rounded-3xl shadow-2xl bg-transparent p-0 overflow-hidden border-0 !bg-transparent">
          <DialogHeader className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-6 pt-6 pb-4 border-b border-white/40 rounded-t-3xl">
            <DialogTitle className="text-2xl font-bold text-white text-center">
              How are you feeling?
            </DialogTitle>
          </DialogHeader>
          <div className="p-6 rounded-b-3xl bg-white">
            <p className="text-gray-600 text-center mb-6">
              Take a moment to check in with yourself after your mindfulness practice.
            </p>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-btl-400 ${
                    selectedMood === mood.value
                      ? 'bg-gradient-to-br from-btl-600 to-btl-500 text-white border-btl-600 ring-2 ring-btl-400 shadow-xl'
                      : 'bg-gradient-to-br from-white to-gray-50 text-gray-700 border-gray-200 hover:bg-gradient-to-br hover:from-btl-50 hover:to-blue-50 hover:border-btl-400'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-1 text-black dark:text-white border border-blue-400 rounded-full bg-white" style={{width: '2.5em', height: '2.5em', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      {mood.emoji || '🙂'}
                    </div>
                    <div className="text-xs font-medium">{mood.label}</div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 rounded-xl"
                disabled={isSubmitting}
              >
                Skip
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!selectedMood || isSubmitting}
                className={`flex-1 rounded-xl transition-all duration-200 ${
                  selectedMood && !isSubmitting
                    ? 'bg-gradient-to-r from-btl-600 to-btl-500 hover:from-btl-700 hover:to-btl-600 hover:shadow-lg hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'Logging...' : 'Log Mood'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <FeedbackDialog
        open={showFeedback}
        onClose={() => { setShowFeedback(false); onOpenChange(false); }}
        feedbackMessage={feedbackMessage}
        actions={feedbackActions}
      />
    </>
  );
} 