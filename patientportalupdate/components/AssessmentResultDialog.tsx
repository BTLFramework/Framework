"use client"

import { useState } from "react";
import { MessageCircle, Heart, Phone, Calendar, ExternalLink, Award } from "lucide-react";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";

interface AssessmentResultDialogProps {
  open: boolean;
  onClose: () => void;
  assessmentData: {
    level: number;
    stress: number;
    mood: number;
    moodLabel: string;
  };
}

interface AssessmentResult {
  category: string;
  message: string;
  links: Array<{
    label: string;
    icon: React.ReactNode;
    action: string;
    color: string;
  }>;
  color: string;
}

export function AssessmentResultDialog({ open, onClose, assessmentData }: AssessmentResultDialogProps) {
  const [showCelebration, setShowCelebration] = useState(true);

  // Logic to determine assessment category and result
  const getAssessmentResult = (): AssessmentResult => {
    const { level: pain, stress, mood } = assessmentData;
    
    // Category 1: Low Pain/Low Stress/Positive Mood
    if (pain <= 3 && stress <= 3 && mood <= 3) {
      return {
        category: "Steady Progress",
        message: "You're making steady progress. Take a moment to notice what's working for you today. Small wins matter.",
        links: [
          {
            label: "Celebration Resources",
            icon: <Heart className="w-4 h-4" />,
            action: "https://back-to-life.com/celebration-resources",
            color: "bg-green-500 hover:bg-green-600"
          }
        ],
        color: "bg-green-50 border-green-200"
      };
    }
    
    // Category 2: Moderate Pain/Moderate Stress/Neutral Mood
    if (pain <= 7 && stress <= 7 && mood <= 6) {
      return {
        category: "Recovery Journey",
        message: "Recovery can have ups and downs. If you're feeling tense, a few minutes of slow breathing or gentle movement may help. Remember, it's okay to take things one step at a time.",
        links: [
          {
            label: "Breathing Exercise",
            icon: <Heart className="w-4 h-4" />,
            action: "https://back-to-life.com/breathing-exercises",
            color: "bg-blue-500 hover:bg-blue-600"
          },
          {
            label: "Gentle Movement",
            icon: <ExternalLink className="w-4 h-4" />,
            action: "https://back-to-life.com/gentle-movement",
            color: "bg-teal-500 hover:bg-teal-600"
          }
        ],
        color: "bg-blue-50 border-blue-200"
      };
    }
    
    // Category 3: High Pain/High Stress/Negative Mood
    if (pain >= 8 && stress >= 8 && mood >= 7) {
      return {
        category: "Support Available",
        message: "It's understandable to feel this way when pain and stress are high. If you'd like, you can try a short mindfulness or breathing exercise to help your body and mind reset. If things feel overwhelming, consider reaching out to your care team for support.",
        links: [
          {
            label: "Mindfulness Exercise",
            icon: <Heart className="w-4 h-4" />,
            action: "https://back-to-life.com/mindfulness",
            color: "bg-purple-500 hover:bg-purple-600"
          },
          {
            label: "Contact Care Team",
            icon: <Phone className="w-4 h-4" />,
            action: "tel:+1-800-BACK-LIFE",
            color: "bg-orange-500 hover:bg-orange-600"
          }
        ],
        color: "bg-orange-50 border-orange-200"
      };
    }
    
    // Category 4: Very High Pain/Very High Stress/Distressed Mood
    if (pain >= 8 && stress >= 8 && mood >= 9) {
      return {
        category: "Immediate Support",
        message: "You're not alone in this. When pain and stress are intense, it's important to pause and care for yourself. A few minutes of mindful breathing or gentle movement can sometimes help. If you need more support, booking a check-in with your clinician is always an option.",
        links: [
          {
            label: "Emergency Support",
            icon: <Phone className="w-4 h-4" />,
            action: "tel:+1-800-BACK-LIFE",
            color: "bg-red-500 hover:bg-red-600"
          },
          {
            label: "Book Clinician Check-in",
            icon: <Calendar className="w-4 h-4" />,
            action: "https://back-to-life.com/book-appointment",
            color: "bg-btl-600 hover:bg-btl-700"
          }
        ],
        color: "bg-red-50 border-red-200"
      };
    }
    
    // Default fallback
    return {
      category: "General Support",
      message: "Thank you for completing your assessment. We're here to support your recovery journey.",
      links: [
        {
          label: "General Resources",
          icon: <ExternalLink className="w-4 h-4" />,
          action: "https://back-to-life.com/resources",
          color: "bg-btl-600 hover:bg-btl-700"
        }
      ],
      color: "bg-btl-50 border-btl-200"
    };
  };

  const result = getAssessmentResult();

  const handleLinkClick = (action: string) => {
    if (action.startsWith('tel:')) {
      window.location.href = action;
    } else {
      window.open(action, '_blank');
    }
  };

  if (!open) return null;

  return (
    <AssessmentDialog open={open} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-2xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center gap-8">
            <MessageCircle className="w-12 h-12 text-white opacity-90" />
            <h2 className="text-3xl font-bold text-white">Assessment Complete</h2>
          </div>
          <p className="mt-2 text-btl-100 text-sm">
            Based on your responses, here's personalized support for you.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 text-white/90 text-base">
            <div className="flex items-center gap-2 bg-white/15 border border-white/30 rounded-full px-4 py-1.5">
              <span>{result.category}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 font-bold text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142] rounded-full">
              +6 pts
            </div>
          </div>
        </div>

        <AssessmentDialogBody className="flex-1 p-6 pt-0 overflow-y-auto">
          <div className="max-w-xl mx-auto w-full">
            {/* Assessment Summary */}
            <div className="bg-btl-50 rounded-xl p-4 mb-6 border border-btl-200">
              <h3 className="font-semibold text-btl-700 mb-2">Your Assessment Summary</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-btl-600">Pain:</span>
                  <span className="font-semibold text-btl-700">{assessmentData.level}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-btl-600">Stress:</span>
                  <span className="font-semibold text-btl-700">{assessmentData.stress}/10</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-btl-600">Mood:</span>
                  <span className="font-semibold text-btl-700">{assessmentData.moodLabel}</span>
                </div>
              </div>
            </div>

            {/* Personalized Message */}
            <div className={`rounded-xl p-6 mb-6 border ${result.color}`}>
              <div className="flex items-start gap-3">
                <MessageCircle className="w-6 h-6 text-btl-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-btl-700 mb-2">{result.category}</h4>
                  <p className="text-btl-600 leading-relaxed">{result.message}</p>
                </div>
              </div>
            </div>

            {/* Action Links */}
            <div className="space-y-3">
              <h4 className="font-semibold text-btl-700 mb-3">Recommended Actions</h4>
              {result.links.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleLinkClick(link.action)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg ${link.color}`}
                >
                  <div className="flex items-center gap-3">
                    {link.icon}
                    <span>{link.label}</span>
                  </div>
                  <ExternalLink className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </AssessmentDialogBody>

        {/* Celebration Message */}
        {showCelebration && (
          <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
            <div className="flex items-center justify-center">
              <div className="flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-100 border-2 border-yellow-300 shadow-lg animate-pulse">
                <Award className="w-8 h-8 mr-3" style={{ color: '#FFC700' }} />
                <span className="font-extrabold text-xl tracking-wide" style={{ color: '#155fa0' }}>
                  +6 Recovery Points Earned! 🎉
                </span>
              </div>
            </div>
          </div>
        )}

        <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-3">
              <div className="px-4 py-2 font-medium text-sm bg-gradient-to-br from-[#b08d57] via-[#a97142] to-[#7c5c36] text-white shadow border border-[#a97142] rounded-full">
                Total: 6 pts
              </div>
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-full font-medium bg-btl-600 text-white hover:bg-btl-700 transition-colors"
            >
              Close
            </button>
          </div>
        </AssessmentDialogFooter>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
} 