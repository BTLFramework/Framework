"use client";

import { useState, useEffect } from "react";
import {
  AssessmentDialog,
  AssessmentDialogContent,
  AssessmentDialogHeader,
  AssessmentDialogTitle,
  AssessmentDialogDescription,
  AssessmentDialogBody,
  AssessmentDialogFooter,
} from "@/components/ui/assessment-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Play, Award, BarChart3, X, Brain } from "lucide-react";
import { Insight, getInsightById } from "@/lib/InsightLibrary";
import FlarePlan, { FlarePlanData } from "./FlarePlan";
import JsonFormRenderer from "./JsonFormRenderer";
import { SummaryCarousel } from "./SummaryCarousel";
import InsightSummaryCard from "./InsightSummaryCard";
import { addRecoveryPoints } from "@/lib/recoveryPointsApi";
import { completeInsight } from "@/services/insights.service";
import { useToast } from "@/hooks/use-toast";
import { mutate } from "swr";

interface InsightDialogProps {
  insightId: number;
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (insightId: number, points?: number) => void;
  patientId: string;
}

interface QuizState {
  isVisible: boolean;
  currentQuestionIndex: number;
  answers: number[];
  isCorrect: boolean | null;
  isSubmitted: boolean;
  score: number;
  totalQuestions: number;
}

// Quiz Popup Component
function QuizPopup({ 
  insight, 
  isOpen, 
  onClose, 
  onQuizComplete 
}: { 
  insight: Insight | null; 
  isOpen: boolean; 
  onClose: () => void; 
  onQuizComplete: () => void; 
}) {
  const [quizState, setQuizState] = useState<QuizState>({
    isVisible: false,
    currentQuestionIndex: 0,
    answers: [],
    isCorrect: null,
    isSubmitted: false,
    score: 0,
    totalQuestions: 1
  });

  useEffect(() => {
    if (isOpen && insight) {
      const totalQuestions = insight.questions?.length || 1;
      setQuizState({
        isVisible: true,
        currentQuestionIndex: 0,
        answers: Array(totalQuestions).fill(undefined), // Initialize with undefined
        isCorrect: null,
        isSubmitted: false,
        score: 0,
        totalQuestions
      });
    }
  }, [isOpen, insight]);

  const handleAnswerSelect = (answerIndex: number) => {
    setQuizState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestionIndex] = answerIndex;
      return {
        ...prev,
        answers: newAnswers
      };
    });
  };

  const handleQuizSubmit = () => {
    if (!insight) return;
    
    const currentAnswer = quizState.answers[quizState.currentQuestionIndex];
    let isCorrect = false;
    
    console.log('🎯 Quiz submit - currentAnswer:', currentAnswer, 'questionIndex:', quizState.currentQuestionIndex);
    
    if (insight.questions && insight.questions[quizState.currentQuestionIndex]) {
      // Multiple choice question
      const correctAnswer = insight.questions[quizState.currentQuestionIndex].correctAnswer;
      isCorrect = currentAnswer === correctAnswer;
      console.log('🎯 Multiple choice - correctAnswer:', correctAnswer, 'isCorrect:', isCorrect);
    } else {
      // Legacy single question
      const answerText = currentAnswer === 0 ? "T" : currentAnswer === 1 ? "F" : "";
      isCorrect = answerText.toUpperCase() === insight.quizA.toUpperCase();
      console.log('🎯 Legacy question - answerText:', answerText, 'expected:', insight.quizA, 'isCorrect:', isCorrect);
    }
    
    setQuizState(prev => ({
      ...prev,
      isCorrect,
      isSubmitted: true,
      score: isCorrect ? prev.score + 1 : prev.score
    }));

    if (isCorrect) {
      console.log('🎯 Answer is correct! Moving to next question or completing...');
      // Move to next question or complete quiz
      setTimeout(() => {
        if (quizState.currentQuestionIndex < quizState.totalQuestions - 1) {
          // Move to next question
          console.log('🎯 Moving to next question...');
          setQuizState(prev => ({
            ...prev,
            currentQuestionIndex: prev.currentQuestionIndex + 1,
            isSubmitted: false,
            isCorrect: null
          }));
        } else {
          // Quiz completed successfully
          console.log('🎯 Quiz completed successfully! Calling onQuizComplete()');
          onQuizComplete();
          // Don't close here - let parent handle it
        }
      }, 1500);
    } else {
      console.log('🎯 Answer is incorrect! Quiz not completed.');
    }
  };

  const handleRetry = () => {
    setQuizState(prev => ({
      ...prev,
      isSubmitted: false,
      isCorrect: null
    }));
  };

  if (!insight) return null;

  // Get current question data
  const currentQuestion = insight.questions?.[quizState.currentQuestionIndex];
  const isLastQuestion = quizState.currentQuestionIndex === quizState.totalQuestions - 1;

  return (
    <AssessmentDialog open={isOpen} onOpenChange={onClose}>
      <AssessmentDialogContent className="max-w-2xl h-[80vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
        <AssessmentDialogHeader className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40">
          <div className="flex items-center gap-6">
            <Brain className="w-10 h-10 text-white opacity-90" />
            <div>
              <AssessmentDialogTitle className="text-2xl font-bold text-white">
                Knowledge Check
              </AssessmentDialogTitle>
              <AssessmentDialogDescription className="text-btl-100 text-sm">
                Test your understanding to complete this insight
              </AssessmentDialogDescription>
            </div>
          </div>
        </AssessmentDialogHeader>
        
        <AssessmentDialogBody className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-xl mx-auto">
            <Card className="border-2 border-btl-100 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-btl-50 to-btl-100 border-b border-btl-200">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-3 text-btl-800">
                    <Award className="h-6 w-6 text-yellow-500" />
                    Question {quizState.currentQuestionIndex + 1} of {quizState.totalQuestions}
                  </CardTitle>
                  <div className="w-16 h-2 bg-btl-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-btl-600 transition-all duration-300"
                      style={{ width: `${((quizState.currentQuestionIndex + 1) / quizState.totalQuestions) * 100}%` }}
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-6">
                <div className="bg-white rounded-lg p-6 border border-btl-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {currentQuestion ? currentQuestion.question : insight.quizQ}
                  </h3>
                  <div className="space-y-3">
                    {currentQuestion ? (
                      // Multiple choice options
                      <div className="space-y-3">
                        {currentQuestion.options.map((option, index) => (
                          <Button
                            key={index}
                            variant="outline"
                            onClick={() => handleAnswerSelect(index)}
                            disabled={quizState.isSubmitted}
                            className={`w-full h-14 text-left justify-start text-base font-medium mb-4 transition-all duration-150
                              border-2 rounded-full
                              ${quizState.answers[quizState.currentQuestionIndex] === index
                                ? 'bg-gradient-to-r from-yellow-100 via-yellow-200 to-yellow-100 border-yellow-500 text-yellow-900 shadow-lg font-bold'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-btl-50 hover:border-btl-400 shadow-sm'}
                              focus:ring-2 focus:ring-yellow-400 focus:z-10`}
                            tabIndex={0}
                          >
                            <span className="mr-3 font-bold text-yellow-700">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      // Legacy true/false question
                      <div className="grid grid-cols-2 gap-3">
                        <Button
                          variant={quizState.answers[quizState.currentQuestionIndex] === 0 ? "default" : "outline"}
                          onClick={() => handleAnswerSelect(0)}
                          disabled={quizState.isSubmitted}
                          className="h-12 text-base font-medium"
                        >
                          ✓ True
                        </Button>
                        <Button
                          variant={quizState.answers[quizState.currentQuestionIndex] === 1 ? "default" : "outline"}
                          onClick={() => handleAnswerSelect(1)}
                          disabled={quizState.isSubmitted}
                          className="h-12 text-base font-medium"
                        >
                          ✗ False
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {!quizState.isSubmitted ? (
                  <div className="flex justify-center">
                    <Button 
                      onClick={handleQuizSubmit}
                      disabled={quizState.answers[quizState.currentQuestionIndex] === undefined}
                      className="px-8 py-3 text-base font-semibold bg-gradient-to-r from-btl-600 to-btl-700 hover:from-btl-700 hover:to-btl-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 rounded-full"
                      size="lg"
                    >
                      {isLastQuestion ? 'Complete Quiz' : 'Next Question'}
                    </Button>
                  </div>
                ) : (
                  <div className="text-center p-6 rounded-xl border-2">
                    {quizState.isCorrect ? (
                      <div className="flex flex-col items-center gap-3 text-green-700 bg-green-50 border-green-200 p-6 rounded-xl">
                        <CheckCircle className="h-12 w-12 text-green-500" />
                        <h3 className="text-xl font-bold text-green-800">Correct!</h3>
                        <p className="text-green-600 font-medium">
                          {isLastQuestion ? "Great job! You've completed this insight." : "Moving to next question..."}
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-3 text-red-700 bg-red-50 border-red-200 p-6 rounded-xl">
                        <XCircle className="h-12 w-12 text-red-500" />
                        <h3 className="text-xl font-bold text-red-800">Incorrect</h3>
                        <p className="text-red-600">
                          The correct answer was: <span className="font-semibold">
                            {currentQuestion 
                              ? currentQuestion.options[currentQuestion.correctAnswer]
                              : insight.quizA
                            }
                          </span>
                        </p>
                        <Button 
                          onClick={handleRetry}
                          className="mt-2 bg-red-600 hover:bg-red-700 rounded-xl"
                        >
                          Try Again
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </AssessmentDialogBody>
      </AssessmentDialogContent>
    </AssessmentDialog>
  );
}

export default function InsightDialog({ 
  insightId, 
  isOpen, 
  onClose, 
  onComplete, 
  patientId 
}: InsightDialogProps) {
  console.log('🎯 InsightDialog rendered with:', { insightId, isOpen, patientId });
  
      // Check if patientId is an email and get numeric ID
  useEffect(() => {
    if (patientId && patientId.includes('@')) {
      console.log('🎯 PatientId is an email, fetching numeric ID...');
      fetch(`/api/patients/portal-data/${patientId}`)
        .then(response => response.json())
        .then(data => {
          console.log('🎯 Patient data for numeric ID:', data);
        })
        .catch(error => {
          console.log('🎯 Error fetching patient data:', error);
        });
    }
  }, [patientId]);
  const { toast } = useToast();
  const [insight, setInsight] = useState<Insight | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [flarePlanData, setFlarePlanData] = useState<FlarePlanData | null>(null);
  const [jsonFormData, setJsonFormData] = useState<any>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (insightId) {
      const foundInsight = getInsightById(insightId);
      setInsight(foundInsight || null);
      // Reset states when insight changes
      setIsCompleted(false);
      setFlarePlanData(null);
      setJsonFormData(null);
      setIsLoadingForm(false);
      setShowQuiz(false);
      setQuizCompleted(false);
    }
  }, [insightId]);

  useEffect(() => {
    // Only load JSON as form data if it's not a special content file
    if (insight?.assetPath.endsWith('.json') && 
        !insight.assetPath.includes('sleep-carousel') && 
        !insight.assetPath.includes('cortisol') && 
        !insight.assetPath.includes('recap') &&
        !jsonFormData && 
        !isLoadingForm) {
      setIsLoadingForm(true);
      fetch(insight.assetPath)
        .then(response => response.json())
        .then(data => {
          setJsonFormData(data);
          setIsLoadingForm(false);
        })
        .catch(error => {
          console.error('Error loading form data:', error);
          setIsLoadingForm(false);
        });
    }
  }, [insight, jsonFormData, isLoadingForm]);

  const handleFlarePlanComplete = (data: FlarePlanData) => {
    setFlarePlanData(data);
    setIsCompleted(true);
    onComplete?.(insightId, 15); // Award 15 points for form completion
  };

  const handleJsonFormComplete = (data: any) => {
    setIsCompleted(true);
    onComplete?.(insightId, 15); // Award 15 points for form completion
  };

  const handleQuizComplete = () => {
    console.log('🎯 Quiz completed! Setting quizCompleted to true and completing insight');
    setQuizCompleted(true);
    setShowQuiz(false); // Close the quiz popup
    // Immediately complete the insight after quiz
    handleComplete();
  };

  // DEV MODE: Allow testing completion popup for already completed insights
  const handleTestCompletion = () => {
    console.log('🎯 DEV MODE: Testing completion popup');
    setIsCompleted(true);
    // Auto-close after showing celebration
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleCompleteSession = async () => {
    if (!insight || !patientId) return;
    setIsSubmitting(true);
    try {
      // Get numeric patient ID from backend (if email is used)
      let numericPatientId = patientId;
      if (isNaN(Number(patientId))) {
        // Fetch patient data to get numeric ID
        const patientResponse = await fetch(`/api/patients/portal-data/${patientId}`);
        if (!patientResponse.ok) throw new Error('Failed to get patient data');
        const patientData = await patientResponse.json();
        numericPatientId = patientData.data.patient.id;
      }
      // Add recovery points
      const result = await addRecoveryPoints(
        numericPatientId.toString(),
        'INSIGHT',
        insight.title,
        insight.points || 2
      );
      if (result.success) {
        setIsCompleted(true);
        if (onComplete) onComplete(insightId, insight.points || 2);
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        // Still call onComplete for UI feedback
        if (onComplete) onComplete(insightId, insight.points || 2);
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      // Log error, but still close
      if (onComplete) onComplete(insightId, insight.points || 2);
      setTimeout(() => {
        onClose();
      }, 1000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleComplete = async () => {
    console.log('🎯 handleComplete called with patientId:', patientId, 'insightId:', insightId);
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('🎯 Already submitting, ignoring duplicate call');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Ensure we have a valid patientId
      const validPatientId = patientId || '1';
      console.log('🎯 Using validPatientId:', validPatientId);
      
      console.log('🎯 Step 1: Calling completeInsight...');
      const insightResult = await completeInsight(validPatientId, insightId.toString());
      console.log('🎯 Step 1 result:', insightResult);
      
      console.log('🎯 Step 2: Calling addRecoveryPoints...');
      // Use the patientId passed to the component instead of relying on localStorage
      try {
        const pointsResult = await addRecoveryPoints(validPatientId, 'EDUCATION', `Completed insight: ${insight?.title || 'Unknown'}`, insight?.points || 5);
        console.log('🎯 Step 2 result:', pointsResult);
      } catch (pointsError) {
        console.warn('🎯 Points award failed, but continuing with insight completion:', pointsError);
        // Continue with insight completion even if points fail
      }
      
      console.log('🎯 Step 3: Calling SWR mutate...');
      try {
        mutate(['/api/v1/recovery-points', validPatientId]);
        console.log('🎯 SWR mutate called successfully');
      } catch (mutateError) {
        console.log('🎯 SWR mutate error (non-critical):', mutateError);
      }
      
      console.log('🎯 Step 4: Setting isCompleted to show congratulations...');
      setIsCompleted(true);                                              // Show congratulations message
      
      // Call onComplete callback
      if (onComplete) {
        onComplete(insightId, insight?.points || 2);
      }
      
      // Close after a delay to show the congratulations message (matching MovementSessionDialog)
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error('Insight complete failed', err);
      toast({
        title: "Error",
        description: "Something went wrong—please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderMediaContent = () => {
    if (!insight) return null;

    const assetPath = insight.assetPath;

    // Handle FORM: prefixed assets first (React components)
    if (assetPath.startsWith("FORM:")) {
      const formId = assetPath.replace("FORM:", "");
      if (formId === "flare-up-plan") {
        return (
          <div className="flex justify-center">
            <FlarePlan 
              id={formId} 
              onComplete={handleFlarePlanComplete}
            />
          </div>
        );
      }
    }

    // Handle JSON files - determine type and render appropriately
    if (assetPath.endsWith('.json')) {
      // Handle form definition files
      if (jsonFormData && jsonFormData.type === 'form') {
        return (
          <div className="flex justify-center">
            <JsonFormRenderer 
              formData={jsonFormData}
              onComplete={handleJsonFormComplete}
            />
          </div>
        );
      }

      // Handle loading state for JSON forms
      if (isLoadingForm) {
        return (
          <div className="flex justify-center items-center h-32">
            <div className="text-gray-500">Loading form...</div>
          </div>
        );
      }

      // Handle summary cards with cortisol-style single page
      if (assetPath.includes('-summary.json')) {
        return <InsightSummaryCard assetPath={assetPath} />;
      }

      // Sleep debt card should also use cortisol-style single page
      if (assetPath.includes('sleep-carousel')) {
        return <InsightSummaryCard assetPath={assetPath} />;
      }

      // Handle specific content files (DEPRECATED - now using SummaryCarousel)
      if (assetPath.includes('sleep-carousel-OLD')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sleep & Pain Connection</h3>
                <p className="text-gray-600">Understanding how sleep quality directly impacts your pain perception and recovery</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Sleep Debt Impact</h4>
                  <p className="text-gray-700 mb-4">Sleep deprivation doesn't just make you tired—it fundamentally changes how your brain processes pain signals.</p>
                  <div className="bg-btl-50 border border-btl-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-btl-800 font-medium">Research Finding:</p>
                    <p className="text-sm text-btl-700">Sleeping less than 6 hours increases pain sensitivity by approximately 20%</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Pain threshold decreases significantly
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Existing pain feels more intense
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Pain tolerance drops by up to 30%
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Recovery Connection</h4>
                  <p className="text-gray-700 mb-4">Quality sleep is essential for tissue repair and recovery processes that directly impact your healing journey.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">During Sleep</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Growth hormone release peaks</li>
                        <li>• Tissue repair accelerates</li>
                        <li>• Inflammation decreases</li>
                        <li>• Immune system strengthens</li>
                      </ul>
                    </div>
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Without Sleep</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Healing processes slow down</li>
                        <li>• Inflammation increases</li>
                        <li>• Pain sensitivity rises</li>
                        <li>• Recovery time extends</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Sleep Hygiene Tips</h4>
                  <p className="text-gray-700 mb-4">Establish a consistent sleep schedule and create a relaxing bedtime routine to optimize your recovery.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Evening Routine</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Dim lights 1 hour before bed</li>
                        <li>• Avoid screens 30 minutes prior</li>
                        <li>• Create a relaxing ritual</li>
                        <li>• Keep bedroom cool (65-68°F)</li>
                      </ul>
                    </div>
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Sleep Environment</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Dark, quiet, and comfortable</li>
                        <li>• Use white noise if needed</li>
                        <li>• Invest in quality bedding</li>
                        <li>• Reserve bed for sleep only</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Prioritizing sleep isn't a luxury—it's a critical component of your recovery strategy. Better sleep means less pain, faster healing, and improved quality of life.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Handle Lottie animation files (like cortisol.json)
      if (assetPath.includes('cortisol')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-btl-50 to-btl-100 p-6 border-b border-btl-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-btl-600 rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-btl-900">Cortisol & Stress Impact</h3>
                    <p className="text-btl-700">Understanding how stress hormones affect your recovery and healing processes</p>
                  </div>
                </div>
              </div>
              
              <div className="p-8 space-y-8">
                {/* Main Impact Section */}
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-btl-900">High Cortisol Effects</h4>
                  </div>
                  <p className="text-btl-800 mb-6 leading-relaxed">Cortisol, your body's primary stress hormone, plays a crucial role in your recovery journey. When elevated for extended periods, it can significantly impact your healing process and create a cascade of negative effects.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-btl-900 text-sm">Slows Tissue Repair</p>
                          <p className="text-btl-700 text-sm">Reduces collagen production and delays healing</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-btl-900 text-sm">Reduces Blood Flow</p>
                          <p className="text-btl-700 text-sm">Limits oxygen and nutrients to injured areas</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-btl-900 text-sm">Suppresses Immunity</p>
                          <p className="text-btl-700 text-sm">Weakens your body's natural defense system</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                        <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-btl-900 text-sm">Increases Inflammation</p>
                          <p className="text-btl-700 text-sm">Elevates inflammatory markers in your body</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Stress Cycle Section */}
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-btl-900">The Stress-Pain Cycle</h4>
                  </div>
                  <p className="text-btl-800 mb-6 leading-relaxed">Understanding how chronic stress creates a <span className="text-red-600 font-semibold">vicious cycle</span> that can prolong your recovery and amplify pain signals.</p>
                  
                  <div className="bg-white border-2 border-btl-200 rounded-xl p-4 mb-6">
                    <p className="text-sm text-btl-800 font-bold mb-2">The Dangerous Cycle:</p>
                    <div className="flex items-center justify-center gap-2 text-sm text-btl-700">
                      <span className="bg-btl-100 px-3 py-1 rounded-full border border-btl-200">Pain</span>
                      <span className="text-btl-400">→</span>
                      <span className="bg-btl-100 px-3 py-1 rounded-full border border-btl-200">Stress</span>
                      <span className="text-btl-400">→</span>
                      <span className="bg-red-100 px-3 py-1 rounded-full border border-red-200 text-red-700">High Cortisol</span>
                      <span className="text-btl-400">→</span>
                      <span className="bg-btl-100 px-3 py-1 rounded-full border border-btl-200">Slower Healing</span>
                      <span className="text-btl-400">→</span>
                      <span className="bg-btl-100 px-3 py-1 rounded-full border border-btl-200">More Pain</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                      <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-btl-900 text-sm">24/7 Elevated Levels</p>
                        <p className="text-btl-700 text-sm">Chronic stress keeps cortisol <span className="text-red-600 font-semibold">elevated around the clock</span></p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                      <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-btl-900 text-sm">Hypersensitive Nervous System</p>
                        <p className="text-btl-700 text-sm">Your body becomes <span className="text-red-600 font-semibold">overly reactive</span> to threats</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-btl-200">
                      <div className="w-2 h-2 bg-btl-600 rounded-full mt-2 flex-shrink-0"></div>
                      <div>
                        <p className="font-semibold text-btl-900 text-sm">Amplified Pain Signals</p>
                        <p className="text-btl-700 text-sm">Pain becomes <span className="text-red-600 font-semibold">more intense and persistent</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solutions Section */}
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="mb-4">
                    <h4 className="text-xl font-bold text-btl-900">Recovery Optimization</h4>
                  </div>
                  <p className="text-btl-800 mb-6 leading-relaxed">The good news: you can actively <span className="text-green-600 font-semibold">reduce cortisol levels</span> and accelerate your healing through specific strategies.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white border-2 border-btl-200 rounded-xl p-5">
                      <h5 className="font-bold text-btl-900 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-btl-600 rounded-full"></span>
                        Immediate Actions
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Deep breathing</span> exercises
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Gentle movement</span> and stretching
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Progressive muscle</span> relaxation
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Mindfulness</span> meditation
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border-2 border-btl-200 rounded-xl p-5">
                      <h5 className="font-bold text-btl-900 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-btl-600 rounded-full"></span>
                        Lifestyle Changes
                      </h5>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Quality sleep</span> (7-9 hours)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Regular exercise</span> (gentle, not intense)
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Balanced nutrition</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-btl-700">
                          <span className="w-1.5 h-1.5 bg-btl-600 rounded-full"></span>
                          <span className="text-green-600 font-semibold">Social connection</span> and support
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Takeaway */}
                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Managing stress isn't just about feeling better—it's about healing faster. Every time you reduce cortisol levels, you're giving your body the optimal conditions for tissue repair and recovery. Your healing journey starts with stress management.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Handle missing JSON files with appropriate fallback content
      if (assetPath.includes('recap-week')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Weekly Reflection</h3>
                <p className="text-gray-600">Review your week's learning and progress to reinforce your recovery journey</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-btl-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                      1
                    </div>
                    <h4 className="text-xl font-bold text-btl-900">Review Your Progress</h4>
                  </div>
                  <p className="text-btl-700 mb-6 text-base">Take time to reflect on what you've learned and how it's helping your recovery journey.</p>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-4 bg-white border border-btl-200 rounded-xl hover:border-btl-300 hover:bg-btl-50 transition-all duration-200">
                      <div className="w-6 h-6 bg-btl-100 text-btl-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        1
                      </div>
                      <span className="text-btl-800 font-medium">Identify which insights resonated most with you</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white border border-btl-200 rounded-xl hover:border-btl-300 hover:bg-btl-50 transition-all duration-200">
                      <div className="w-6 h-6 bg-btl-100 text-btl-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        2
                      </div>
                      <span className="text-btl-800 font-medium">Note your biggest "aha moments" this week</span>
                    </div>
                    <div className="flex items-start gap-3 p-4 bg-white border border-btl-200 rounded-xl hover:border-btl-300 hover:bg-btl-50 transition-all duration-200">
                      <div className="w-6 h-6 bg-btl-100 text-btl-600 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-0.5">
                        3
                      </div>
                      <span className="text-btl-800 font-medium">Track how your perspective on pain has shifted</span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-btl-600 text-white rounded-xl flex items-center justify-center text-lg font-bold">
                      2
                    </div>
                    <h4 className="text-xl font-bold text-btl-900">Celebrate Wins</h4>
                  </div>
                  <p className="text-btl-700 mb-6 text-base">Acknowledge your achievements, no matter how small they may seem.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">What Went Well</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Strategies that helped you most</li>
                        <li>• Moments of progress</li>
                        <li>• New insights gained</li>
                        <li>• Positive changes noticed</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">Areas for Growth</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Challenges you faced</li>
                        <li>• Situations that were difficult</li>
                        <li>• Goals for next week</li>
                        <li>• Skills to develop further</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Regular reflection builds self-awareness and reinforces your learning. Each week's insights compound to create lasting change in your recovery journey.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (assetPath.includes('caffeine-sleep')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Caffeine & Sleep</h3>
                <p className="text-gray-600">Understanding how caffeine timing affects your sleep quality and recovery</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Timing Matters
                  </h4>
                  <p className="text-gray-700 mb-4">Caffeine can stay in your system for 6-8 hours, affecting sleep quality even when you don't feel its effects.</p>
                  <div className="bg-btl-50 border border-btl-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-btl-800 font-medium">Key Fact:</p>
                    <p className="text-sm text-btl-700">Even small amounts of caffeine can reduce deep sleep and increase wakefulness</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Caffeine blocks adenosine receptors in the brain
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Reduces total sleep time and quality
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Increases time to fall asleep
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Better Alternatives
                  </h4>
                  <p className="text-gray-700 mb-4">Consider these alternatives in the afternoon and evening to support better sleep.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Herbal Options</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Chamomile tea</li>
                        <li>• Peppermint tea</li>
                        <li>• Lavender tea</li>
                        <li>• Decaf green tea</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">Other Choices</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Warm water with lemon</li>
                        <li>• Golden milk (turmeric)</li>
                        <li>• Hot chocolate (low sugar)</li>
                        <li>• Sparkling water</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Cut off caffeine by 2 PM to ensure it doesn't interfere with your sleep. Better sleep means better recovery and reduced pain sensitivity.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (assetPath.includes('sleep-winddown')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Sleep Wind-Down Routine</h3>
                <p className="text-gray-600">Create a relaxing evening routine to signal your body it's time to sleep</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Create a Routine
                  </h4>
                  <p className="text-gray-700 mb-4">Establish consistent bedtime habits to signal your body it's time to sleep.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">1 Hour Before Bed</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Dim the lights</li>
                        <li>• Start reducing activity</li>
                        <li>• Begin relaxation routine</li>
                        <li>• Prepare for tomorrow</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">30 Minutes Before</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Avoid screens</li>
                        <li>• Read a book</li>
                        <li>• Practice deep breathing</li>
                        <li>• Set bedroom temperature</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Environment Matters
                  </h4>
                  <p className="text-gray-700 mb-4">Keep your bedroom cool, dark, and quiet for optimal sleep conditions.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Temperature: 65-68°F (18-20°C) is ideal
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Use blackout curtains or eye mask
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      White noise machine or earplugs if needed
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Invest in comfortable, supportive bedding
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">A consistent wind-down routine trains your body to recognize sleep signals. Better sleep environment and habits lead to deeper, more restorative sleep.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (assetPath.includes('hydration-fascia')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Hydration & Fascia Health</h3>
                <p className="text-gray-600">Understanding how proper hydration supports your connective tissue and recovery</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Fascia Function
                  </h4>
                  <p className="text-gray-700 mb-4">Fascia is connective tissue that needs proper hydration to function optimally and support your movement.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Fascia is 70% water by weight
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Provides structural support and flexibility
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Transmits force throughout the body
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Plays role in pain perception
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Hydration Benefits
                  </h4>
                  <p className="text-gray-700 mb-4">Adequate water intake helps maintain tissue flexibility and reduces stiffness.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">When Hydrated</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Tissues are more flexible</li>
                        <li>• Movement feels easier</li>
                        <li>• Recovery is faster</li>
                        <li>• Pain sensitivity reduced</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">When Dehydrated</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Tissues become stiff</li>
                        <li>• Movement feels restricted</li>
                        <li>• Recovery slows down</li>
                        <li>• Pain may increase</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Aim for 8-10 glasses of water daily, more if you're active or in pain. Proper hydration is essential for tissue health and optimal recovery.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (assetPath.includes('protectometer')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pain Protection System</h3>
                <p className="text-gray-600">Understanding how your nervous system can become overprotective and amplify pain signals</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Protective Response
                  </h4>
                  <p className="text-gray-700 mb-4">Your nervous system can become overprotective, amplifying pain signals even when tissue damage has healed.</p>
                  <div className="bg-btl-50 border border-btl-200 rounded-lg p-4 mb-4">
                    <p className="text-sm text-btl-800 font-medium">The Science:</p>
                    <p className="text-sm text-btl-700">Your brain can misinterpret safe movements as dangerous, triggering pain responses</p>
                  </div>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Brain becomes hypersensitive to movement
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Pain signals are amplified unnecessarily
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Safe movements feel threatening
                    </li>
                  </ul>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Calming Signals
                  </h4>
                  <p className="text-gray-700 mb-4">Gentle movement and positive experiences can help calm your protection system.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Safe Movements</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• Gentle stretching</li>
                        <li>• Slow walking</li>
                        <li>• Breathing exercises</li>
                        <li>• Mindful movement</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">Positive Experiences</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Relaxation techniques</li>
                        <li>• Social connection</li>
                        <li>• Enjoyable activities</li>
                        <li>• Success experiences</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Slow, consistent exposure to safe movements helps retrain your nervous system. Gradual progress builds confidence and reduces protective responses.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      if (assetPath.includes('goal-ladder')) {
        return (
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Goal Setting Ladder</h3>
                <p className="text-gray-600">Break big goals into smaller, achievable steps that build confidence</p>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Start Small
                  </h4>
                  <p className="text-gray-700 mb-4">Break big goals into smaller, achievable steps that build confidence and momentum.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-btl-50 rounded-lg p-4 border border-btl-200">
                      <h5 className="font-semibold text-btl-800 mb-2">Micro Goals</h5>
                      <ul className="text-sm text-btl-700 space-y-1">
                        <li>• 5 minutes of movement</li>
                        <li>• One deep breath exercise</li>
                        <li>• Read one insight</li>
                        <li>• Track one symptom</li>
                      </ul>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-4 border border-gray-300">
                      <h5 className="font-semibold text-gray-800 mb-2">Building Up</h5>
                      <ul className="text-sm text-gray-700 space-y-1">
                        <li>• Increase duration gradually</li>
                        <li>• Add new exercises slowly</li>
                        <li>• Celebrate each step</li>
                        <li>• Adjust based on response</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                    Adapt & Adjust
                  </h4>
                  <p className="text-gray-700 mb-4">Be flexible with your goals and adjust them based on your current capacity.</p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Listen to your body's signals
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Modify goals on difficult days
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Celebrate progress, not perfection
                    </li>
                    <li className="flex items-start">
                      <span className="text-btl-600 mr-2">•</span>
                      Focus on consistency over intensity
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <Award className="w-6 h-6 text-white" />
                    <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                  </div>
                  <p className="text-btl-100 font-medium leading-relaxed">Small steps lead to big changes. Acknowledge each step forward, no matter how small it may seem. Consistency builds lasting progress.</p>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Handle other missing JSON files with generic fallback
      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Interactive Content</h3>
              <p className="text-gray-600">This insight contains valuable information to support your recovery journey</p>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                  Learning Opportunity
                </h4>
                <p className="text-gray-700 mb-4">This insight contains valuable information to support your recovery journey.</p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="text-btl-600 mr-2">•</span>
                    Evidence-based recovery strategies
                  </li>
                  <li className="flex items-start">
                    <span className="text-btl-600 mr-2">•</span>
                    Practical tips for daily implementation
                  </li>
                  <li className="flex items-start">
                    <span className="text-btl-600 mr-2">•</span>
                    Understanding of pain science
                  </li>
                </ul>
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <span className="w-2 h-2 bg-btl-600 rounded-full mr-3"></span>
                  Complete the Quiz
                </h4>
                <p className="text-gray-700 mb-4">Test your understanding to earn points and track your progress.</p>
                <div className="bg-btl-50 border border-btl-200 rounded-lg p-4">
                  <p className="text-sm text-btl-800 font-medium">Quiz Benefits:</p>
                  <ul className="text-sm text-btl-700 space-y-1 mt-2">
                    <li>• Reinforces learning</li>
                    <li>• Earn recovery points</li>
                    <li>• Track your progress</li>
                    <li>• Build confidence</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-white" />
                  <h4 className="text-xl font-bold text-white">Key Takeaway</h4>
                </div>
                <p className="text-btl-100 font-medium leading-relaxed">Regular completion of insights helps build knowledge and confidence. Each insight contributes to your overall recovery strategy.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle external URLs (YouTube, PDFs, articles, etc.)
    if (assetPath.startsWith('http://') || assetPath.startsWith('https://')) {
      const isYouTube = assetPath.includes('youtube.com') || assetPath.includes('youtu.be');
      const isPDF = assetPath.toLowerCase().endsWith('.pdf');

      // Extract YouTube video ID for embed (support watch, youtu.be, embed, shorts, live)
      let youtubeEmbedUrl = '';
      if (isYouTube) {
        const extractYouTubeId = (url: string): string | null => {
          try {
            // Try URL API first
            const u = new URL(url);
            // Standard watch URL
            const v = u.searchParams.get('v');
            if (v) return v;
            // Shorts, embed, live, youtu.be
            const path = u.pathname.split('/').filter(Boolean);
            // youtu.be/<id>
            if (u.hostname === 'youtu.be' && path[0]) return path[0];
            // /embed/<id>
            const embedIdx = path.indexOf('embed');
            if (embedIdx !== -1 && path[embedIdx + 1]) return path[embedIdx + 1];
            // /shorts/<id>
            const shortsIdx = path.indexOf('shorts');
            if (shortsIdx !== -1 && path[shortsIdx + 1]) return path[shortsIdx + 1];
            // /live/<id>
            const liveIdx = path.indexOf('live');
            if (liveIdx !== -1 && path[liveIdx + 1]) return path[liveIdx + 1];
          } catch {}
          // Regex fallback
          const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([^&\s?/]+)/);
          return m?.[1] || null;
        };

        const videoId = extractYouTubeId(assetPath);
        if (videoId) {
          youtubeEmbedUrl = `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`;
        }
      }

      return (
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{insight.title}</h3>
              <p className="text-gray-600">{insight.subtitle}</p>
            </div>
            
            {/* YouTube Embed */}
            {isYouTube && youtubeEmbedUrl && (
              <>
                <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                  <iframe
                    src={youtubeEmbedUrl}
                    title={insight.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute top-0 left-0 w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <a
                    href={assetPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-btl-600 text-white font-semibold rounded-full hover:bg-btl-700 transition-colors shadow"
                  >
                    <span>Open on YouTube</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </>
            )}
            {/* Fallback: Open on YouTube if we couldn't extract an embeddable ID */}
            {isYouTube && !youtubeEmbedUrl && (
              <div className="p-8">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                  <p className="text-yellow-800 mb-3 font-medium">Video embedding is unavailable for this link.</p>
                  <a
                    href={assetPath}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-btl-600 text-white font-semibold rounded-full hover:bg-btl-700 transition-colors shadow-lg hover:shadow-xl"
                  >
                    <span>Open on YouTube</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            )}
            
            {/* PDF or Article Link */}
            {!isYouTube && (
              <div className="p-8">
                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm mb-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 bg-btl-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      {isPDF ? (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-btl-900 mb-2">
                        {isPDF ? 'PDF Resource' : 'Web Resource'}
                      </h4>
                      <p className="text-btl-700 mb-4">
                        {isPDF 
                          ? 'Click below to view the PDF guide in a new tab. Take your time to read through the material.' 
                          : 'Click below to access the article or resource. Review the content and return here to complete the quiz.'}
                      </p>
                      <a
                        href={assetPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-btl-600 text-white font-semibold rounded-full hover:bg-btl-700 transition-colors shadow-lg hover:shadow-xl"
                      >
                        <span>Open Resource</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-btl-50 to-white border-2 border-btl-200 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xl font-bold text-btl-900 mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 bg-btl-600 rounded-full"></span>
                    Key Learning Points
                  </h4>
                  <p className="text-btl-700 mb-4">
                    After reviewing the resource, you'll be able to:
                  </p>
                  <ul className="space-y-2 text-sm text-btl-700">
                    <li className="flex items-start gap-2">
                      <span className="text-btl-600">•</span>
                      <span>Understand evidence-based strategies for pain management</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-btl-600">•</span>
                      <span>Apply practical techniques to your recovery journey</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-btl-600">•</span>
                      <span>Gain confidence through knowledge and education</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="px-8 pb-8">
              {/* Attribution Section */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-4">
                <p className="text-xs text-gray-600">
                  <span className="font-semibold">Source:</span>{' '}
                  {isYouTube && assetPath.includes('youtube.com') && (
                    <span>Video hosted on YouTube. Content is used for educational purposes in accordance with fair use guidelines.</span>
                  )}
                  {isPDF && assetPath.includes('.gov') && (
                    <span>U.S. Government public domain resource. Free for educational use.</span>
                  )}
                  {isPDF && assetPath.includes('nhs.uk') && (
                    <span>NHS resource licensed under the Open Government Licence. Free for educational use.</span>
                  )}
                  {isPDF && assetPath.includes('va.gov') && (
                    <span>U.S. Department of Veterans Affairs public resource. Free for educational use.</span>
                  )}
                  {assetPath.includes('harvard.edu') && (
                    <span>Harvard Health Publishing. Used for educational purposes.</span>
                  )}
                  {assetPath.includes('berkeley.edu') && (
                    <span>UC Berkeley Greater Good Science Center. Used for educational purposes.</span>
                  )}
                  {assetPath.includes('noigroup.com') && (
                    <span>NOI Group educational resource. Used for clinical education purposes.</span>
                  )}
                  {assetPath.includes('ncbi.nlm.nih.gov') && (
                    <span>National Institutes of Health public domain research. Free for educational use.</span>
                  )}
                  {assetPath.includes('pain-ed.com') && (
                    <span>Content by Greg Lehman. Used for educational purposes.</span>
                  )}
                  {assetPath.includes('palousemindfulness.com') && (
                    <span>Palouse Mindfulness free MBSR course. Used with permission for educational purposes.</span>
                  )}
                  {!isYouTube && !isPDF && !assetPath.includes('harvard.edu') && !assetPath.includes('berkeley.edu') && 
                   !assetPath.includes('noigroup.com') && !assetPath.includes('ncbi.nlm.nih.gov') && 
                   !assetPath.includes('pain-ed.com') && !assetPath.includes('palousemindfulness.com') && (
                    <span>External educational resource. Used for clinical education purposes.</span>
                  )}
                  {' '}All content is provided for educational purposes to support patient recovery.
                </p>
              </div>

              <div className="bg-gradient-to-br from-btl-600 to-btl-700 border-2 border-btl-500 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-3">
                  <Award className="w-6 h-6 text-white" />
                  <h4 className="text-xl font-bold text-white">Complete the Quiz</h4>
                </div>
                <p className="text-btl-100 font-medium leading-relaxed">
                  After reviewing the resource, test your understanding to earn recovery points and reinforce your learning.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Handle video files
    if (assetPath.endsWith('.mp4')) {
      return (
        <div className="w-full max-w-2xl mx-auto">
          <video 
            controls 
            className="w-full rounded-lg shadow-lg"
            preload="metadata"
          >
            <source src={assetPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    }

    // Default fallback
    return (
      <div className="text-center text-gray-500">
        <div className="bg-gray-100 rounded-lg p-8">
          <div className="text-4xl mb-4">📚</div>
          <p className="text-gray-600 font-medium">Content Loading</p>
          <p className="text-sm text-gray-500 mt-2">
            This insight content is being prepared
          </p>
        </div>
      </div>
    );
  };

  if (!insight) {
    return null;
  }

  return (
    <>
      <AssessmentDialog open={isOpen} onOpenChange={onClose}>
        <AssessmentDialogContent className="max-w-3xl h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <AssessmentDialogTitle className="sr-only">{insight.title}</AssessmentDialogTitle>
          <AssessmentDialogDescription className="sr-only">{insight.subtitle}</AssessmentDialogDescription>
          
          {/* Gradient Header with Icon, Title, Close Button */}
          <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 relative">
            <div className="flex items-center gap-8">
              <BarChart3 className="w-12 h-12 text-white opacity-90" />
              <div>
                <h2 className="text-3xl font-bold text-white">{insight.title}</h2>
                <p className="mt-2 text-btl-100 text-sm">{insight.subtitle}</p>
              </div>
            </div>
          </div>
          
          <AssessmentDialogBody className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-3xl mx-auto space-y-6">
              {renderMediaContent()}
            </div>
          </AssessmentDialogBody>
          
          {/* Celebration Message - moved outside scrollable area */}
          {isCompleted && (
            <div className="px-6 py-4 bg-yellow-50 border-t border-yellow-200">
              <div className="flex items-center justify-center">
                <div
                  className="flex items-center justify-center px-5 py-3 rounded-xl bg-yellow-100 border-2 border-yellow-300 shadow-lg animate-pulse"
                  style={{
                    borderColor: '#FFC700',
                    boxShadow: '0 4px 16px 0 rgba(255,199,0,0.20)',
                  }}
                >
                  <Award className="w-8 h-8 mr-3" style={{ color: '#FFC700' }} />
                  <span
                    className="font-extrabold text-xl tracking-wide text-blue-800"
                    style={{
                      color: '#155fa0',
                    }}
                  >
                                            +{insight?.points || 5} Recovery Points Earned! 🎉
                  </span>
                </div>
              </div>
            </div>
          )}
          
          <AssessmentDialogFooter className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <span className="inline-block px-4 py-1 text-sm font-bold rounded-full bg-gradient-to-r from-gray-400 via-gray-500 to-gray-600 text-white shadow border border-gray-600">
              +{insight?.points || 5} pts
            </span>
            <button
              onClick={(e) => {
                console.log('🎯 Button clicked! quizCompleted:', quizCompleted, 'isSubmitting:', isSubmitting);
                if (isCompleted) {
                  onClose();
                } else if (quizCompleted) {
                  // If quiz is completed but insight not yet completed, complete it
                  handleComplete();
                } else {
                  setShowQuiz(true);
                }
              }}
              className={`px-6 py-2 rounded-full font-medium transition-colors ${
                isCompleted
                  ? 'bg-gray-500 text-white hover:bg-gray-600' 
                  : 'bg-btl-600 text-white hover:bg-btl-700'
              } disabled:opacity-60 disabled:cursor-not-allowed`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Completing...' : 
               isCompleted ? 'Close' : 
               quizCompleted ? 'Complete Insight' : 
               insight?.assetPath?.startsWith('FORM:') ? 'Complete Session' : 'Take Quiz'}
            </button>
            
            {/* DEV MODE: Test completion popup button for completed insights */}
            {isCompleted && (
              <button
                onClick={handleTestCompletion}
                className="ml-2 px-4 py-2 rounded-full font-medium bg-yellow-500 text-white hover:bg-yellow-600 transition-colors"
              >
                Test Popup
              </button>
            )}
          </AssessmentDialogFooter>

        </AssessmentDialogContent>
      </AssessmentDialog>

      {/* Quiz Popup */}
      <QuizPopup
        insight={insight}
        isOpen={showQuiz}
        onClose={() => {
          console.log('🎯 Quiz popup closing, showQuiz was:', showQuiz);
          setShowQuiz(false);
        }}
        onQuizComplete={handleQuizComplete}
      />
    </>
  );
} 