"use client"

import { useState } from "react";
import { Smile, Heart, Award } from "lucide-react";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";

interface MoodBoardDialogProps {
  open: boolean;
  onClose: () => void;
  onMoodSelect: (mood: number, moodLabel: string) => void;
  assessmentData: {
    level: number;
    stress: number;
  };
}

const MOOD_OPTIONS = [
  { emoji: "😊", label: "Happy", value: 1, description: "Feeling good" },
  { emoji: "😌", label: "Calm", value: 2, description: "Peaceful" },
  { emoji: "😐", label: "Neutral", value: 3, description: "Okay" },
  { emoji: "😕", label: "Concerned", value: 4, description: "A bit worried" },
  { emoji: "😟", label: "Anxious", value: 5, description: "Feeling tense" },
  { emoji: "😣", label: "Frustrated", value: 6, description: "Irritated" },
  { emoji: "😖", label: "Stressed", value: 7, description: "Overwhelmed" },
  { emoji: "😫", label: "Exhausted", value: 8, description: "Very tired" },
  { emoji: "😩", label: "Distressed", value: 9, description: "Really struggling" },
  { emoji: "😭", label: "Overwhelmed", value: 10, description: "Need support" },
];

export function MoodBoardDialog({ open, onClose, onMoodSelect, assessmentData }: MoodBoardDialogProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);

  const handleMoodSelect = (mood: number, label: string) => {
    setSelectedMood(mood);
    onMoodSelect(mood, label);
  };

  const getMoodCategory = (mood: number) => {
    if (mood <= 3) return "positive";
    if (mood <= 6) return "neutral";
    if (mood <= 8) return "negative";
    return "distressed";
  };

  if (!open) return null;

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-2xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center gap-8">
            <Smile className="w-12 h-12 text-white opacity-90" />
            <h2 className="text-3xl font-bold text-white">How are you feeling?</h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            Select the emoji that best represents your current mood.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5">
              <span>Mood Check</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 font-bold text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142] rounded-full">
              +3 pts
            </div>
          </div>
        </div>

        <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto">
          <div className="max-w-xl mx-auto w-full">
            {/* Assessment Summary */}
            <div className="bg-btl-50 rounded-xl p-4 mb-6 border border-btl-200">
              <h3 className="font-semibold text-btl-700 mb-2">Your Assessment Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-btl-600">Pain Level:</span>
                  <span className="font-semibold text-btl-700">{assessmentData.level}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-btl-600">Stress Level:</span>
                  <span className="font-semibold text-btl-700">{assessmentData.stress}/10</span>
                </div>
              </div>
            </div>

            {/* Mood Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood.value, mood.label)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:shadow-lg hover:scale-105 ${
                    selectedMood === mood.value
                      ? 'border-btl-600 bg-btl-100 shadow-md'
                      : 'border-btl-200 bg-white hover:border-btl-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{mood.emoji}</div>
                    <div className="font-semibold text-btl-700 text-sm">{mood.label}</div>
                    <div className="text-xs text-btl-600 mt-1">{mood.description}</div>
                  </div>
                </button>
              ))}
            </div>

            {/* Instructions */}
            <div className="mt-6 bg-blue-50 rounded-xl p-4 border border-blue-200">
              <div className="flex items-start gap-3">
                <Heart className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">Why we ask about mood</h4>
                  <p className="text-sm text-blue-700">
                    Your mood helps us understand how pain and stress are affecting you emotionally. 
                    This information helps us provide more personalized support and resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AssessmentDialogBody>

        <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142] rounded-full">
                Total: 3 pts
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full font-medium bg-btl-600 text-white hover:bg-btl-700 transition-colors"
            >
              Cancel
            </button>
          </div>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 