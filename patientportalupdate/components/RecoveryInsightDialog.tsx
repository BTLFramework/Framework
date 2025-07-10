"use client"

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, TrendingUp, TrendingDown, Minus, AlertTriangle, Play } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

interface RecoveryInsightDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (points: number) => void
  snapshot: {
    pain: number
    stress: number
    risk: string
  }
  painDelta: number
  stressDelta: number
  showActionPrompt: boolean
  actionPrompt?: {
    title: string
    action: string
    buttonText: string
  }
}

interface InsightContent {
  id: string
  title: string
  type: 'video' | 'lottie' | 'carousel' | 'interactive'
  asset: string
  description: string
}

const insightContent: InsightContent[] = [
  {
    id: 'pain-science',
    title: 'Danger vs. safety signals',
    type: 'video',
    asset: '/insight/ps-danger.mp4',
    description: 'Understanding how your brain processes pain signals'
  },
  {
    id: 'stress-cortisol',
    title: 'How cortisol slows healing',
    type: 'lottie',
    asset: '/insight/stress-cortisol.json',
    description: 'The science behind stress and recovery'
  },
  {
    id: 'sleep-pain',
    title: 'Sleep debt + pain sensitivity',
    type: 'carousel',
    asset: '/insight/sleep-carousel.json',
    description: 'Why sleep quality affects your pain levels'
  },
  {
    id: 'success-story',
    title: "Jess's 2-week back-to-running win",
    type: 'video',
    asset: '/insight/success-jess.mp4',
    description: 'Real patient success story'
  },
  {
    id: 'flare-plan',
    title: 'Flare plan in two steps',
    type: 'interactive',
    asset: 'flare-plan-v1',
    description: 'Interactive tool to create your flare management plan'
  }
]

export function RecoveryInsightDialog({ 
  open, 
  onOpenChange, 
  onComplete, 
  snapshot, 
  painDelta, 
  stressDelta, 
  showActionPrompt, 
  actionPrompt 
}: RecoveryInsightDialogProps) {
  const [selectedInsight, setSelectedInsight] = useState<InsightContent | null>(null)
  const [actionTaken, setActionTaken] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const getDeltaIcon = (delta: number) => {
    if (delta > 0) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (delta < 0) return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-gray-400" />
  }

  const getRiskColor = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200'
      case 'med': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const handleActionPrompt = () => {
    setActionTaken(true)
    // This would typically open the mindfulness session with mindshift track
    toast({
      title: "Action taken!",
      description: "Opening MindShift session...",
    })
  }

  const handleInsightSelect = (insight: InsightContent) => {
    setSelectedInsight(insight)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/patient-portal/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 1, // This should come from auth context
          taskType: 'recoveryInsight',
          data: {
            insightViewed: selectedInsight?.id,
            actionTaken: actionTaken ? actionPrompt?.action : null
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Insight completed!",
          description: result.message,
        })
        onComplete(result.pointsEarned)
        onOpenChange(false)
      } else {
        throw new Error('Failed to submit')
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete insight. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Recovery Insight
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Snapshot Bar */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  Pain {snapshot.pain}/10
                  {getDeltaIcon(painDelta)}
                </span>
                <span className="text-gray-400">·</span>
                <span className="flex items-center gap-1">
                  Stress {snapshot.stress}/10
                  {getDeltaIcon(stressDelta)}
                </span>
                <span className="text-gray-400">·</span>
                <span className="flex items-center gap-1">
                  Risk 
                  <Badge className={`ml-1 ${getRiskColor(snapshot.risk)}`}>
                    {snapshot.risk.toUpperCase()}
                  </Badge>
                </span>
              </div>
            </div>
          </div>

          {/* Action Prompt */}
          {showActionPrompt && actionPrompt && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-medium text-red-900 mb-2">
                    {actionPrompt.title}
                  </h3>
                  <Button
                    onClick={handleActionPrompt}
                    disabled={actionTaken}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {actionTaken ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Action Taken
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        {actionPrompt.buttonText}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Daily Nudge */}
          {!showActionPrompt && (
            <div className="space-y-4">
              <h3 className="font-medium text-gray-900">Today's Insight</h3>
              
              {/* Risk-aware content selection */}
              {snapshot.risk.toLowerCase() === 'high' ? (
                // High risk: show Self-Efficacy Tool
                <Card className="cursor-pointer hover:bg-gray-50 transition-colors" 
                      onClick={() => handleInsightSelect(insightContent[4])}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">{insightContent[4].title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{insightContent[4].description}</p>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Interactive</Badge>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Low/Med risk: show rotating content
                <div className="grid grid-cols-1 gap-3">
                  {insightContent.slice(0, 4).map((insight) => (
                    <Card 
                      key={insight.id}
                      className="cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleInsightSelect(insight)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">{insight.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                          </div>
                          <Badge className={`${
                            insight.type === 'video' ? 'bg-purple-100 text-purple-800' :
                            insight.type === 'lottie' ? 'bg-green-100 text-green-800' :
                            insight.type === 'carousel' ? 'bg-orange-100 text-orange-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {insight.type.charAt(0).toUpperCase() + insight.type.slice(1)}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Selected Insight Preview */}
          {selectedInsight && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">{selectedInsight.title}</h4>
              <p className="text-sm text-gray-700 mb-3">{selectedInsight.description}</p>
              
              {selectedInsight.type === 'video' && (
                <div className="bg-black rounded-lg p-4 text-center">
                  <Play className="w-8 h-8 text-white mx-auto mb-2" />
                  <p className="text-white text-sm">Video content would play here</p>
                </div>
              )}
              
              {selectedInsight.type === 'interactive' && (
                <div className="bg-white rounded-lg p-4 border">
                  <p className="text-sm text-gray-600">Interactive flare plan tool would load here</p>
                </div>
              )}
            </div>
          )}

          {/* Submit Button */}
          <Button 
            onClick={handleSubmit} 
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isSubmitting ? (
              'Completing...'
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Complete Insight
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 