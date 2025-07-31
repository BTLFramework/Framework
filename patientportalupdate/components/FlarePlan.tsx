"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Clock, 
  Target, 
  CheckCircle, 
  Download, 
  Star,
  Phone,
  Zap,
  Award
} from "lucide-react";

interface FlarePlanProps {
  id?: string;
  onComplete?: (data: FlarePlanData) => void;
}

export interface FlarePlanData {
  warningSign: string;
  commonTriggers: string[];
  immediateActions: string[];
  followUpActions: string[];
  intensityThreshold: number;
  emergencyContact: string;
  successIndicators: string;
  notes: string;
}

const COMMON_TRIGGERS = [
  "Poor sleep",
  "Long drives",
  "Skipped meals", 
  "Stressful situations",
  "Overexertion",
  "Weather changes",
  "Sitting too long",
  "Emotional stress"
];

export default function FlarePlan({ id, onComplete }: FlarePlanProps) {
  const [formData, setFormData] = useState<FlarePlanData>({
    warningSign: "",
    commonTriggers: [],
    immediateActions: [""],
    followUpActions: [""],
    intensityThreshold: 7,
    emergencyContact: "",
    successIndicators: "",
    notes: ""
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showQuickCard, setShowQuickCard] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.warningSign.trim() && 
        formData.immediateActions.some(action => action.trim()) &&
        formData.followUpActions.some(action => action.trim())) {
      setIsSubmitted(true);
      onComplete?.(formData);
    }
  };

  const handleInputChange = (field: keyof FlarePlanData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleTrigger = (trigger: string) => {
    setFormData(prev => ({
      ...prev,
      commonTriggers: prev.commonTriggers.includes(trigger)
        ? prev.commonTriggers.filter(t => t !== trigger)
        : [...prev.commonTriggers, trigger]
    }));
  };

  const addAction = (type: 'immediate' | 'followUp') => {
    setFormData(prev => ({
      ...prev,
      [type === 'immediate' ? 'immediateActions' : 'followUpActions']: 
        [...prev[type === 'immediate' ? 'immediateActions' : 'followUpActions'], ""]
    }));
  };

  const updateAction = (type: 'immediate' | 'followUp', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [type === 'immediate' ? 'immediateActions' : 'followUpActions']: 
        prev[type === 'immediate' ? 'immediateActions' : 'followUpActions'].map((action, i) => 
          i === index ? value : action
        )
    }));
  };

  const removeAction = (type: 'immediate' | 'followUp', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type === 'immediate' ? 'immediateActions' : 'followUpActions']: 
        prev[type === 'immediate' ? 'immediateActions' : 'followUpActions'].filter((_, i) => i !== index)
    }));
  };

  const generateQuickCard = () => {
    const cardContent = `
FLARE PLAN - QUICK REFERENCE

🚨 EARLY WARNING SIGN:
${formData.warningSign}

⚡ IMMEDIATE ACTIONS (1-5 min):
${formData.immediateActions.filter(a => a.trim()).map((action, i) => `${i + 1}. ${action}`).join('\n')}

📋 FOLLOW-UP ACTIONS (10-30 min):
${formData.followUpActions.filter(a => a.trim()).map((action, i) => `${i + 1}. ${action}`).join('\n')}

📞 EMERGENCY CONTACT:
${formData.emergencyContact || 'Your healthcare provider'}

🚨 CALL IF INTENSITY ≥ ${formData.intensityThreshold}/10
    `;
    
    const blob = new Blob([cardContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'flare-plan-quick-reference.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
          {/* Gradient Header */}
          <div className="bg-gradient-to-br from-btl-600 to-btl-700 p-8 border-b border-white/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            <div>
                <h2 className="text-2xl font-bold text-white">Flare Plan Created!</h2>
              </div>
            </div>
          </div>
          
          <div className="p-8 space-y-8">
            {/* Points Celebration */}
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-200 rounded-2xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <span className="text-2xl font-bold text-yellow-800">+5 Recovery Points Earned!</span>
              </div>
              <p className="text-yellow-700">Great work creating your personalized flare management strategy!</p>
            </div>

            {/* Plan Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-5 h-5 text-btl-600" />
                    <h3 className="text-lg font-bold text-btl-900">Early Warning Sign</h3>
                  </div>
                  <p className="text-btl-800 bg-white border border-btl-200 rounded-xl p-4">
                {formData.warningSign}
              </p>
            </div>
                
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-btl-900 mb-4">Common Triggers</h3>
                  <div className="flex flex-wrap gap-2">
                    {formData.commonTriggers.map(trigger => (
                      <Badge key={trigger} className="bg-btl-600 text-white border-btl-600">
                        {trigger}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Clock className="w-5 h-5 text-btl-600" />
                    <h3 className="text-lg font-bold text-btl-900">Immediate Actions (1-5 min)</h3>
                  </div>
                  <div className="space-y-3">
                    {formData.immediateActions.filter(a => a.trim()).map((action, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-btl-800 text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <Target className="w-5 h-5 text-btl-600" />
                    <h3 className="text-lg font-bold text-btl-900">Follow-up Actions (10-30 min)</h3>
                  </div>
                  <div className="space-y-3">
                    {formData.followUpActions.filter(a => a.trim()).map((action, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-btl-800 text-sm">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-lg font-bold text-btl-900 mb-4">Safety Threshold</h3>
                  <div className="bg-white border border-btl-200 rounded-xl p-4">
                    <p className="text-btl-800 font-medium">
                      Call healthcare provider if intensity ≥ <span className="text-red-600 font-bold">{formData.intensityThreshold}/10</span>
                    </p>
                  </div>
                </div>

                {formData.emergencyContact && (
                  <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                      <Phone className="w-5 h-5 text-btl-600" />
                      <h3 className="text-lg font-bold text-btl-900">Emergency Contact</h3>
                    </div>
                    <p className="text-btl-800 bg-white border border-btl-200 rounded-xl p-4">
                      {formData.emergencyContact}
                    </p>
                  </div>
                )}

                {formData.successIndicators && (
                  <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                    <h3 className="text-lg font-bold text-btl-900 mb-4">Success Indicators</h3>
                    <p className="text-btl-800 bg-white border border-btl-200 rounded-xl p-4">
                      {formData.successIndicators}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-6 h-6 text-white" />
                <h3 className="text-xl font-bold text-white">Quick Reference Tools</h3>
              </div>
              <p className="text-btl-100 mb-6">Download your flare plan for easy access during flares</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={() => setShowQuickCard(true)}
                  variant="outline"
                  className="flex items-center gap-2 bg-white/10 border-white/20 text-white hover:bg-white/20"
                >
                  <Download className="w-4 h-4" />
                  Download Quick Reference Card
                </Button>
                <Button 
                  onClick={generateQuickCard}
                  className="flex items-center gap-2 bg-white text-btl-700 hover:bg-gray-100"
                >
                  <Zap className="w-4 h-4" />
                  Generate Flare Card
                </Button>
              </div>
            </div>

            {showQuickCard && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800">
                  <strong>Quick Reference Card Generated!</strong> Save this to your phone or print it out. 
                  Keep it easily accessible during flares for quick guidance.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <div className="w-16 h-1 bg-btl-600 mx-2"></div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div className="w-16 h-1 bg-btl-600 mx-2"></div>
              </div>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
              </div>
            </div>
          </div>

          {/* Introduction */}
          <div className="mb-6">
            <h3 className="text-xl font-bold text-btl-900 mb-1">Your Personal Flare Management Plan</h3>
            <p className="text-btl-700 leading-relaxed">
              Let's create a step-by-step plan to help you recognize early warning signs and take action before flares escalate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Warning Signs */}
            <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-btl-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                  1
                </div>
                <h3 className="text-xl font-bold text-btl-900">Identify Your Early Warning Sign</h3>
              </div>
            <Textarea
                id="warning-sign"
                name="warning-sign"
                placeholder="What's the first thing you notice when a flare is starting? (e.g., Increased muscle tension, racing thoughts, irritability, specific pain patterns...)"
              value={formData.warningSign}
              onChange={(e) => handleInputChange("warningSign", e.target.value)}
                className="min-h-[100px] border-btl-200 focus:border-btl-400 focus:ring-btl-400"
              required
            />
          </div>
          
            {/* Common Triggers */}
            <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-btl-900 mb-4">Common Triggers</h3>
              <p className="text-btl-700 mb-6">Select all that apply - these patterns can help you anticipate and prevent flares</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {COMMON_TRIGGERS.map(trigger => (
                  <button
                    key={trigger}
                    type="button"
                    onClick={() => toggleTrigger(trigger)}
                    className={`p-4 rounded-xl border-2 text-sm font-medium transition-all ${
                      formData.commonTriggers.includes(trigger)
                        ? 'bg-btl-600 text-white border-btl-600 shadow-lg hover:bg-btl-700'
                        : 'bg-white text-btl-700 border-btl-200 hover:border-btl-300 hover:bg-btl-100'
                    }`}
                  >
                    {trigger}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Action Plan */}
            <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-btl-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                  2
                </div>
                <h3 className="text-xl font-bold text-btl-900">Plan Your Calm-Down Actions</h3>
              </div>

              {/* Immediate Actions */}
              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-5 h-5 text-btl-600" />
                  <h4 className="text-lg font-semibold text-btl-900">Immediate Actions (1-5 minutes)</h4>
                </div>
                <p className="text-btl-700 mb-4">What can you do right away when you notice your warning sign?</p>
                {formData.immediateActions.map((action, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      id={`immediate-action-${index}`}
                      name={`immediate-action-${index}`}
                      placeholder={`Action ${index + 1} (e.g., Take 5 deep breaths, gentle stretching, step outside...)`}
                      value={action}
                      onChange={(e) => updateAction('immediate', index, e.target.value)}
                      className="flex-1 border-btl-200 focus:border-btl-400 focus:ring-btl-400"
                      required={index === 0}
                    />
                    {formData.immediateActions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAction('immediate', index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAction('immediate')}
                  className="w-full border-btl-200 text-btl-700 hover:bg-btl-50"
                >
                  + Add Another Immediate Action
                </Button>
              </div>

              {/* Follow-up Actions */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-btl-600" />
                  <h4 className="text-lg font-semibold text-btl-900">Follow-up Actions (10-30 minutes)</h4>
                </div>
                <p className="text-btl-700 mb-4">What helps you reliably reduce flare intensity or stress?</p>
                {formData.followUpActions.map((action, index) => (
                  <div key={index} className="flex gap-3">
                    <Input
                      id={`follow-up-action-${index}`}
                      name={`follow-up-action-${index}`}
                      placeholder={`Action ${index + 1} (e.g., Go for a walk, call a friend, practice mindfulness...)`}
                      value={action}
                      onChange={(e) => updateAction('followUp', index, e.target.value)}
                      className="flex-1 border-btl-200 focus:border-btl-400 focus:ring-btl-400"
                      required={index === 0}
                    />
                    {formData.followUpActions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeAction('followUp', index)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => addAction('followUp')}
                  className="w-full border-btl-200 text-btl-700 hover:bg-btl-50"
                >
                  + Add Another Follow-up Action
                </Button>
              </div>
            </div>

            {/* Step 3: Safety & Tracking */}
            <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-btl-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                  3
                </div>
                <h3 className="text-xl font-bold text-btl-900">Safety & Success Tracking</h3>
              </div>

              {/* Intensity Threshold */}
              <div className="space-y-4 mb-6">
                <h4 className="text-lg font-semibold text-btl-900">Flare Intensity Threshold</h4>
                <p className="text-btl-700">At what pain/intensity level should you seek professional help?</p>
                <div className="bg-white border border-btl-200 rounded-xl p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <input
                      type="range"
                      min="5"
                      max="10"
                      value={formData.intensityThreshold}
                      onChange={(e) => handleInputChange("intensityThreshold", parseInt(e.target.value))}
                      className="flex-1 accent-btl-600"
                      id="intensity-threshold"
                      name="intensity-threshold"
                    />
                    <span className="text-2xl font-bold text-btl-600 min-w-[4rem]">
                      {formData.intensityThreshold}/10
                    </span>
                  </div>
                  <p className="text-sm text-btl-700">
                    If intensity ≥ <span className="font-bold text-red-600">{formData.intensityThreshold}/10</span> or symptoms change suddenly, call your healthcare provider
                  </p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-btl-900">Emergency Contact (Optional)</h4>
                <Input
                  id="emergency-contact"
                  name="emergency-contact"
                  placeholder="Healthcare provider name and phone number"
                  value={formData.emergencyContact}
                  onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                  className="border-btl-200 focus:border-btl-400 focus:ring-btl-400"
                />
              </div>

              {/* Success Indicators */}
              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-btl-900">How will you know it's working?</h4>
            <Textarea
                  id="success-indicators"
                  name="success-indicators"
                  placeholder="What changes will you notice when your strategies are effective? (e.g., Reduced tension, calmer breathing, decreased pain intensity...)"
                  value={formData.successIndicators}
                  onChange={(e) => handleInputChange("successIndicators", e.target.value)}
                  className="min-h-[80px] border-btl-200 focus:border-btl-400 focus:ring-btl-400"
            />
          </div>
          
              {/* Additional Notes */}
              <div className="space-y-3">
                <h4 className="text-lg font-semibold text-btl-900">Anything else you've noticed?</h4>
                <Textarea
                  id="additional-notes"
                  name="additional-notes"
                  placeholder="Additional observations, patterns, or strategies that work for you..."
                  value={formData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  className="min-h-[80px] border-btl-200 focus:border-btl-400 focus:ring-btl-400"
                />
              </div>
            </div>

                        {/* Submit Button */}
            <div className="text-center">
              <Button 
                type="submit" 
                className="px-8 py-4 text-lg bg-transparent text-btl-600 shadow-none disabled:text-btl-600 disabled:opacity-100"
                disabled={!formData.warningSign.trim() || 
                         !formData.immediateActions.some(a => a.trim()) ||
                         !formData.followUpActions.some(a => a.trim())}
              >
                <Star className="w-5 h-5 mr-2" />
                Complete Session & Earn +5 Points
              </Button>
              <p className="text-sm text-gray-600 mt-3">
                Your flare plan will be saved and accessible whenever you need it
              </p>
            </div>
        </form>
        </div>
      </div>
    </div>
  );
} 