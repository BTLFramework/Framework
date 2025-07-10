"use client"

import React, { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Brain } from "lucide-react";
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

interface MindfulnessSessionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onComplete: (points: number) => void
  tracks: {
    [key: string]: {
      title: string
      video: string
      default: boolean
    }
  }
  defaultTrack: string
}

interface Quiz {
  quizId: number
  question: string
  options: string[]
  correctIndex: number
}

const sampleQuizzes: Quiz[] = [
  {
    quizId: 12,
    question: "Which breathing rhythm lowers heart-rate fastest?",
    options: ["Box 4-4-4-4", "4-7-8", "Fast mouth breaths", "Panting"],
    correctIndex: 1
  },
  {
    quizId: 13,
    question: "What's the best position for NSDR?",
    options: ["Sitting upright", "Lying flat", "Standing", "Walking"],
    correctIndex: 1
  },
  {
    quizId: 14,
    question: "How long should you hold the 4-7-8 breath?",
    options: ["4 seconds", "7 seconds", "8 seconds", "15 seconds"],
    correctIndex: 2
  }
]

export function MindfulnessSessionDialog({ 
  open, 
  onOpenChange, 
  onComplete, 
  tracks, 
  defaultTrack 
}: MindfulnessSessionDialogProps) {
  const [selectedTrack, setSelectedTrack] = useState(defaultTrack)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [showQuiz, setShowQuiz] = useState(false)
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const { toast } = useToast()

  // 50% chance to show quiz
  React.useEffect(() => {
    if (Math.random() < 0.5) {
      const randomQuiz = sampleQuizzes[Math.floor(Math.random() * sampleQuizzes.length)]
      setCurrentQuiz(randomQuiz)
      setShowQuiz(true)
    }
  }, [])

  const handleTrackSelect = (trackKey: string) => {
    setSelectedTrack(trackKey)
    setIsPlaying(false)
    setCurrentTime(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
    }
  }

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration)
    }
  }

  const handleVideoEnd = () => {
    setIsPlaying(false)
    setCurrentTime(0)
  }

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      setCurrentTime(0)
      setIsPlaying(false)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleQuizAnswer = (index: number) => {
    setSelectedAnswer(index)
    setQuizAnswered(true)
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/patient-portal/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: 1, // This should come from auth context
          taskType: 'mindfulness',
          data: {
            track: selectedTrack,
            completed: true,
            quizCompleted: showQuiz && quizAnswered,
            quizCorrect: showQuiz && selectedAnswer === currentQuiz?.correctIndex
          }
        })
      })

      if (response.ok) {
        const result = await response.json()
        toast({
          title: "Session completed!",
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
        description: "Failed to complete session. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedTrackData = tracks[selectedTrack]

  const { data: patientData, error: patientError, isLoading: patientLoading } = usePatientRecoveryData(/* patientId, 'mindfulness', open */);

  // Only show skeleton while data is truly undefined
  if (patientData === undefined) {
    return (
      <AssessmentDialog open={open} onOpenChange={onOpenChange}>
        <AssessmentDialogContent>
          <AssessmentDialogHeader>
            <AssessmentDialogTitle className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-white" />
              Mindfulness Session
            </AssessmentDialogTitle>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div className="animate-pulse flex flex-col items-center py-16">
              <div className="w-14 h-14 bg-btl-200 rounded-xl mb-4 mt-1"></div>
              <div className="h-6 bg-btl-200 rounded mb-1 w-32"></div>
              <div className="h-4 bg-btl-200 rounded mb-3 w-48"></div>
              <div className="h-5 bg-btl-200 rounded mb-3 w-24"></div>
              <div className="h-5 bg-btl-200 rounded mb-2 w-16"></div>
              <div className="h-4 bg-btl-200 rounded mb-2 w-20"></div>
              <div className="h-4 bg-btl-200 rounded mt-auto w-16"></div>
            </div>
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  if (patientError) {
    return (
      <AssessmentDialog open={open} onOpenChange={onOpenChange}>
        <AssessmentDialogContent>
          <AssessmentDialogHeader>
            <AssessmentDialogTitle className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-white" />
              Mindfulness Session
            </AssessmentDialogTitle>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div className="text-center text-red-500 py-8">
              Error loading patient data.
            </div>
          </AssessmentDialogBody>
        </AssessmentDialogContent>
      </AssessmentDialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Mindfulness Session
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Track Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Choose your session
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {Object.entries(tracks).map(([key, track]) => (
                <Card
                  key={key}
                  className={`cursor-pointer transition-colors ${
                    selectedTrack === key
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleTrackSelect(key)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{track.title}</h3>
                        <p className="text-sm text-gray-500">+5 Recovery Points</p>
                      </div>
                      {track.default && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                          Recommended
                        </span>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div className="space-y-4">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                src={selectedTrackData?.video}
                className="w-full h-64 object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={handleVideoEnd}
                muted={isMuted}
              />
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={togglePlay}
                    className="text-white hover:bg-white/20"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={restartVideo}
                    className="text-white hover:bg-white/20"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleMute}
                    className="text-white hover:bg-white/20"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                  
                  <div className="flex-1 text-white text-sm">
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </div>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-white/30 rounded-full h-1 mt-2">
                  <div 
                    className="bg-white h-1 rounded-full transition-all"
                    style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quiz Section */}
          {showQuiz && currentQuiz && (
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-gray-900">Quick Check-in</h3>
              <p className="text-sm text-gray-700">{currentQuiz.question}</p>
              
              <div className="space-y-2">
                {currentQuiz.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuizAnswer(index)}
                    disabled={quizAnswered}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-colors ${
                      selectedAnswer === index
                        ? index === currentQuiz.correctIndex
                          ? 'border-green-500 bg-green-50'
                          : 'border-red-500 bg-red-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${quizAnswered ? 'cursor-default' : 'cursor-pointer'}`}
                  >
                    {option}
                    {quizAnswered && selectedAnswer === index && (
                      <span className="ml-2 text-sm">
                        {index === currentQuiz.correctIndex ? '✓' : '✗'}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              
              {quizAnswered && (
                <div className="text-sm text-gray-600">
                  {selectedAnswer === currentQuiz.correctIndex 
                    ? "Great job! You're learning well." 
                    : "Good try! The correct answer was highlighted."
                  }
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
                Complete Session
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 