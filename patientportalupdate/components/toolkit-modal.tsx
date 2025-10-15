"use client"

import { X, Play, Download, BookOpen, Search, Filter, Target, Activity, FileText, Wrench, Clock, Moon } from "lucide-react"
import { useState, useRef } from "react"
import { exercises as allExercises } from "@/lib/exerciseLibrary"
import { insightLibrary } from "@/lib/InsightLibrary"
import { BUILD_TAG } from "@/lib/buildInfo"
import { ExerciseVideoModal } from "@/components/exercise-video-modal"
import InsightDialog from "@/components/InsightDialog"
import { generatePainJournalPDF, generateSMARTGoalsPDF } from "@/utils/pdfGenerator"
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
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

interface ToolkitModalProps {
  toolkit: {
    title: string
    description: string
    category: string
    count: number
  }
  onClose: () => void
  patientId?: string
  onInsightComplete?: (insightId: number, points?: number) => void
}

export function ToolkitModal({ toolkit, onClose, patientId = "1", onInsightComplete }: ToolkitModalProps) {
  const [selectedExercise, setSelectedExercise] = useState(null)
  const [selectedInsight, setSelectedInsight] = useState<number | null>(null)
  const [selectedMindfulness, setSelectedMindfulness] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("all")
  const [selectedPhase, setSelectedPhase] = useState("all")
  console.log('🧩 Toolkit build:', BUILD_TAG, 'insights:', Array.isArray(insightLibrary) ? insightLibrary.length : 'n/a')
  
  // Support Tools State
  const [showTimer, setShowTimer] = useState(false)
  const [timerMinutes, setTimerMinutes] = useState(10)
  const [timerSeconds, setTimerSeconds] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [showGoals, setShowGoals] = useState(false)
  const [showSleepTracker, setShowSleepTracker] = useState(false)
  const [sleepData, setSleepData] = useState({
    sleepQuality: 7,
    painLevel: 5,
    sleepHours: 7.5,
    stressLevel: 6
  })

  // New popup states
  const [showPainJournalPopup, setShowPainJournalPopup] = useState(false)
  const [showSMARTGoalsPopup, setShowSMARTGoalsPopup] = useState(false)

  // Timer functionality
  const startTimer = () => {
    setIsTimerRunning(true)
    const interval = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev === 0) {
          if (timerMinutes === 0) {
            setIsTimerRunning(false)
            clearInterval(interval)
            return 0
          }
          setTimerMinutes(prev => prev - 1)
          return 59
        }
        return prev - 1
      })
    }, 1000)
  }

  const resetTimer = () => {
    setIsTimerRunning(false)
    setTimerMinutes(10)
    setTimerSeconds(0)
  }

  // Generate Pain Journal PDF
  const generatePainJournal = async () => {
    try {
      await generatePainJournalPDF()
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to text file if PDF generation fails
      alert('PDF generation failed. Please try again.')
    }
  }

  // Generate SMART Goals PDF
  const generateSMARTGoals = async () => {
    try {
      await generateSMARTGoalsPDF()
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to text file if PDF generation fails
      alert('PDF generation failed. Please try again.')
    }
  }

  // Generate PDF from popup content
  const generatePDFFromPopup = async (contentRef: any, filename: string) => {
    if (!contentRef.current) return
    
    try {
      const canvas = await html2canvas(contentRef.current, {
        useCORS: true,
        allowTaint: true,
        background: '#ffffff'
      })
      
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgWidth = 210
      const pageHeight = 295
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      
      pdf.save(filename)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('PDF generation failed. Please try again.')
    }
  }

  // Pain Journal Popup
  const PainJournalPopup = () => {
    const contentRef = useRef<HTMLDivElement>(null)
    
    // State for Pain Journal form data
    const [painJournalData, setPainJournalData] = useState({
      painLevel: '',
      painLocations: [] as string[],
      otherLocation: '',
      mood: '',
      stressLevel: 5,
      activities: [] as string[],
      restDay: false,
      automaticThought: '',
      copingStrategies: [] as string[],
      otherCoping: '',
      helpfulness: '',
      notes: ''
    })

    const handlePainLocationChange = (location: string) => {
      setPainJournalData(prev => ({
        ...prev,
        painLocations: prev.painLocations.includes(location)
          ? prev.painLocations.filter(l => l !== location)
          : [...prev.painLocations, location]
      }))
    }

    const handleActivityChange = (activity: string) => {
      setPainJournalData(prev => ({
        ...prev,
        activities: prev.activities.includes(activity)
          ? prev.activities.filter(a => a !== activity)
          : [...prev.activities, activity]
      }))
    }

    const handleCopingStrategyChange = (strategy: string) => {
      setPainJournalData(prev => ({
        ...prev,
        copingStrategies: prev.copingStrategies.includes(strategy)
          ? prev.copingStrategies.filter(s => s !== strategy)
          : [...prev.copingStrategies, strategy]
      }))
    }

    return (
      <AssessmentDialog open={showPainJournalPopup} onOpenChange={setShowPainJournalPopup}>
        <AssessmentDialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <AssessmentDialogHeader className="bg-gradient-to-r from-btl-700 to-btl-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4" />
                </svg>
              </div>
              <div>
                <AssessmentDialogTitle>Daily Pain Journal</AssessmentDialogTitle>
                <AssessmentDialogDescription>Fill out the form below, then print your answers or download a blank version using the buttons at the bottom.</AssessmentDialogDescription>
              </div>
            </div>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div ref={contentRef} className="bg-white p-8 rounded-lg mx-auto" style={{ minHeight: '11in', width: '8.5in' }}>
              {/* Header Bar (for PDF date) */}
              <div className="flex items-center justify-between border-b-2 border-btl-600 pb-4 mb-8">
                <div className="flex items-center space-x-4"></div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Date:</div>
                  <div className="text-lg font-semibold text-btl-800">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* Two-Column Grid Layout */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                {/* Left Column: Pain + Mood */}
                <div className="space-y-8">
                  {/* Pain Level Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Pain Level (0-10)</h3>
                    <div className="flex space-x-1">
                      {[0,1,2,3,4,5,6,7,8,9,10].map(num => (
                        <button
                          key={num}
                          onClick={() => setPainJournalData(prev => ({ ...prev, painLevel: num.toString() }))}
                          className={`w-8 h-8 border-2 rounded flex items-center justify-center text-sm font-medium transition-colors ${
                            painJournalData.painLevel === num.toString()
                              ? 'border-btl-600 bg-btl-600 text-white'
                              : 'border-gray-300 hover:bg-btl-50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Pain Location Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Pain Location</h3>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      {['Neck', 'Upper Back', 'Shoulders', 'Lower Back', 'Arms', 'Legs'].map(location => (
                        <div key={location} className="flex items-center space-x-2">
                          <button
                            onClick={() => handlePainLocationChange(location)}
                            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                              painJournalData.painLocations.includes(location)
                                ? 'border-btl-600 bg-btl-600'
                                : 'border-gray-300 hover:border-btl-400'
                            }`}
                          >
                            {painJournalData.painLocations.includes(location) && (
                              <div className="w-2 h-2 bg-white rounded-sm"></div>
                            )}
                          </button>
                          <span className="text-sm">{location}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border border-gray-300 rounded"></div>
                      <span className="text-sm">Other:</span>
                      <input
                        type="text"
                        value={painJournalData.otherLocation}
                        onChange={(e) => setPainJournalData(prev => ({ ...prev, otherLocation: e.target.value }))}
                        className="flex-1 h-6 border-b border-gray-300 focus:border-btl-600 focus:outline-none text-sm"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Mood & Stress Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Mood & Stress</h3>
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">How are you feeling today?</label>
                      <div className="flex space-x-4">
                        {[
                          { emoji: '😄', value: 'Happy' },
                          { emoji: '🙂', value: 'Good' },
                          { emoji: '😐', value: 'Neutral' },
                          { emoji: '🙁', value: 'Sad' },
                          { emoji: '😢', value: 'Very Sad' }
                        ].map((item, index) => (
                          <button
                            key={index}
                            onClick={() => setPainJournalData(prev => ({ ...prev, mood: item.value }))}
                            className={`text-2xl transition-transform hover:scale-110 ${
                              painJournalData.mood === item.value ? 'scale-110 ring-2 ring-btl-600 rounded-full p-1' : ''
                            }`}
                          >
                            {item.emoji}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Stress Level (0-10)</label>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-xs text-gray-500">0</span>
                        <input
                          type="range"
                          min="0"
                          max="10"
                          value={painJournalData.stressLevel}
                          onChange={(e) => setPainJournalData(prev => ({ ...prev, stressLevel: parseInt(e.target.value) }))}
                          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        <span className="text-xs text-gray-500">10</span>
                      </div>
                      <div className="text-center text-sm text-gray-600">{painJournalData.stressLevel}/10</div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Activities + Coping */}
                <div className="space-y-8">
                  {/* Daily Activities Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Daily Activities</h3>
                    <div className="space-y-3 mb-4">
                      {['Movement session', 'Walking', 'Stretching', 'Work activities', 'Household tasks'].map(activity => (
                        <div key={activity} className="flex items-center space-x-2">
                          <button
                            onClick={() => handleActivityChange(activity)}
                            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                              painJournalData.activities.includes(activity)
                                ? 'border-btl-600 bg-btl-600'
                                : 'border-gray-300 hover:border-btl-400'
                            }`}
                          >
                            {painJournalData.activities.includes(activity) && (
                              <div className="w-2 h-2 bg-white rounded-sm"></div>
                            )}
                          </button>
                          <span className="text-sm">{activity}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setPainJournalData(prev => ({ ...prev, restDay: !prev.restDay }))}
                        className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                          painJournalData.restDay
                            ? 'border-btl-600 bg-btl-600'
                            : 'border-gray-300 hover:border-btl-400'
                        }`}
                      >
                        {painJournalData.restDay && (
                          <div className="w-2 h-2 bg-white rounded-sm"></div>
                        )}
                      </button>
                      <span className="text-sm">Rest day</span>
                    </div>
                  </div>

                  {/* Automatic Thought Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Automatic Thought</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">First thought when pain spiked:</label>
                      <input
                        type="text"
                        value={painJournalData.automaticThought}
                        onChange={(e) => setPainJournalData(prev => ({ ...prev, automaticThought: e.target.value }))}
                        maxLength={30}
                        className="w-full h-8 border border-gray-300 rounded px-3 py-1 bg-white focus:border-btl-600 focus:outline-none text-sm"
                        placeholder=""
                      />
                    </div>
                  </div>

                  {/* Coping Strategies Section */}
                  <div className="border-b border-gray-200 pb-6">
                    <h3 className="text-lg font-semibold text-btl-700 mb-4">Coping Strategies</h3>
                    <div className="space-y-3 mb-6">
                      {['Breathing', 'Heat/Ice', 'Stretching', 'Positive self-talk', 'Medication'].map(strategy => (
                        <div key={strategy} className="flex items-center space-x-2">
                          <button
                            onClick={() => handleCopingStrategyChange(strategy)}
                            className={`w-4 h-4 border rounded flex items-center justify-center transition-colors ${
                              painJournalData.copingStrategies.includes(strategy)
                                ? 'border-btl-600 bg-btl-600'
                                : 'border-gray-300 hover:border-btl-400'
                            }`}
                          >
                            {painJournalData.copingStrategies.includes(strategy) && (
                              <div className="w-2 h-2 bg-white rounded-sm"></div>
                            )}
                          </button>
                          <span className="text-sm">{strategy}</span>
                        </div>
                      ))}
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border border-gray-300 rounded"></div>
                        <span className="text-sm">Other:</span>
                        <input
                          type="text"
                          value={painJournalData.otherCoping}
                          onChange={(e) => setPainJournalData(prev => ({ ...prev, otherCoping: e.target.value }))}
                          className="flex-1 h-6 border-b border-gray-300 focus:border-btl-600 focus:outline-none text-sm"
                          placeholder=""
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">How helpful were these strategies?</label>
                      <div className="flex space-x-6">
                        {['Not', 'Some', 'Very'].map((level, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <button
                              onClick={() => setPainJournalData(prev => ({ ...prev, helpfulness: level }))}
                              className={`w-4 h-4 border rounded-full flex items-center justify-center transition-colors ${
                                painJournalData.helpfulness === level
                                  ? 'border-btl-600 bg-btl-600'
                                  : 'border-gray-300 hover:border-btl-400'
                              }`}
                            >
                              {painJournalData.helpfulness === level && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </button>
                            <span className="text-sm">{level}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes & Observations Section - Full Width */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-btl-700 mb-4">Notes & Observations</h3>
                <textarea
                  value={painJournalData.notes}
                  onChange={(e) => setPainJournalData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full h-24 border border-gray-300 rounded bg-white p-3 focus:border-btl-600 focus:outline-none text-sm resize-none"
                  placeholder=""
                  rows={4}
                />
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end text-xs text-gray-500">
                <span>Page 1 of 1</span>
              </div>
            </div>
          </AssessmentDialogBody>
          <AssessmentDialogFooter>
            {/* Use btn-primary-gradient for BTL blue branding on all main action buttons */}
            <div className="flex gap-2">
              <Button className="btn-primary-gradient text-white rounded-xl" onClick={() => generatePDFFromPopup(contentRef, 'Pain-Journal.pdf')}>Open PDF</Button>
              <Button className="btn-primary-gradient text-white rounded-xl" onClick={() => {
                const printContents = contentRef.current?.innerHTML;
                if (printContents) {
                  const printWindow = window.open('', '', 'height=900,width=800');
                  if (printWindow) {
                    printWindow.document.write('<html><head><title>Pain Journal</title>');
                    printWindow.document.write('<style>body{background:white;margin:0;padding:0;}@media print{body{margin:0;padding:0;}}</style>');
                    printWindow.document.write('</head><body >');
                    printWindow.document.write(printContents);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
                  }
                }
              }}>Print Pre-filled Form</Button>
            </div>
          </AssessmentDialogFooter>
        </AssessmentDialogContent>
      </AssessmentDialog>
    )
  }

  // SMART Goals Popup
  const SMARTGoalsPopup = () => {
    const contentRef = useRef<HTMLDivElement>(null)
    // Prefillable SMART goal state
    type SmartGoalFields = 'main' | 'Specific' | 'Measurable' | 'Achievable' | 'Relevant' | 'Time-bound';
    const [smartGoal, setSmartGoal] = useState<Record<SmartGoalFields, string>>({
      main: '',
      Specific: '',
      Measurable: '',
      Achievable: '',
      Relevant: '',
      'Time-bound': ''
    });
    return (
      <AssessmentDialog open={showSMARTGoalsPopup} onOpenChange={setShowSMARTGoalsPopup}>
        <AssessmentDialogContent className="max-w-4xl w-full max-h-[90vh] flex flex-col rounded-2xl shadow-2xl bg-white p-0 overflow-hidden">
          <AssessmentDialogHeader className="bg-gradient-to-r from-btl-700 to-btl-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-4">
              <div className="bg-white bg-opacity-20 rounded-full p-2 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 19.5A2.5 2.5 0 006.5 22h11a2.5 2.5 0 002.5-2.5V6a2 2 0 00-2-2H6a2 2 0 00-2 2v13.5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 2v4m8-4v4" />
                </svg>
              </div>
              <div>
                <AssessmentDialogTitle>SMART Goals Tracker</AssessmentDialogTitle>
                <AssessmentDialogDescription>Fill out the form below, then print your answers or download a blank version using the buttons at the bottom.</AssessmentDialogDescription>
              </div>
            </div>
          </AssessmentDialogHeader>
          <AssessmentDialogBody>
            <div ref={contentRef} className="bg-white p-8 rounded-lg mx-auto" style={{ minHeight: '11in', width: '8.5in' }}>
              {/* Header Bar (for PDF date) */}
              <div className="flex items-center justify-between border-b-2 border-btl-600 pb-4 mb-8">
                <div className="flex items-center space-x-4"></div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">Date:</div>
                  <div className="text-lg font-semibold text-btl-800">{new Date().toLocaleDateString()}</div>
                </div>
              </div>

              {/* SMART Framework Section */}
              <div className="bg-btl-50 rounded-lg p-6 mb-6 border border-btl-200">
                <h3 className="text-lg font-semibold text-btl-700 mb-4">SMART Framework</h3>
                <div className="space-y-4">
                  {[
                    'S - SPECIFIC: Clear, detailed goal with concrete actions',
                    'M - MEASURABLE: Can track progress with numbers or observations',
                    'A - ACHIEVABLE: Realistic for your current situation and abilities',
                    'R - RELEVANT: Important to your recovery journey and long-term health',
                    'T - TIME-BOUND: Has a specific deadline or timeframe'
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div className="w-8 h-8 bg-btl-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {item.charAt(0)}
                      </div>
                      <span className="text-sm text-gray-700 leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Example Goals Note and Two-Column Layout for Goals */}
              <div className="mb-2 flex items-center gap-2 text-btl-700 text-sm font-medium">
                <span role="img" aria-label="lightbulb">💡</span>
                These are example goals to inspire you. Please set your own goals below.
              </div>
              <div className="grid grid-cols-2 gap-8 mb-6">
                {/* Movement Goals */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-btl-700 mb-4 border-b border-gray-200 pb-2">Movement Goals</h3>
                  <div className="space-y-3">
                    {[
                      'Week 1-2: Walk 10 min daily',
                      'Week 2-4: Stand 15 min without pain',
                      'Week 3-6: Light household tasks',
                      'Week 4-8: Movement session 4x/week',
                      'Week 6-12: Return to work'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-btl-600 text-lg" role="img" aria-label="lightbulb">💡</span>
                        <span className="text-sm text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Pain Management Goals */}
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-btl-700 mb-4 border-b border-gray-200 pb-2">Pain Management Goals</h3>
                  <div className="space-y-3">
                    {[
                      'Week 1-2: Breathing exercises 2x/day',
                      'Week 1-4: Reduce catastrophizing',
                      'Week 2-6: Mindfulness 10 min daily',
                      'Week 4-8: Pain self-management skills',
                      'Week 6-12: Master techniques'
                    ].map((goal, index) => (
                      <div key={index} className="flex items-start space-x-2">
                        <span className="text-btl-600 text-lg" role="img" aria-label="lightbulb">💡</span>
                        <span className="text-sm text-gray-700">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Goal Tracking Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-btl-700 mb-4 border-b border-gray-200 pb-2">My SMART Goal Template</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">My SMART Goal:</label>
                    <input
                      type="text"
                      value={smartGoal.main}
                      onChange={e => setSmartGoal(g => ({ ...g, main: e.target.value }))}
                      className="w-full border border-gray-300 rounded bg-white p-3 text-sm focus:ring-2 focus:ring-btl-500 focus:border-btl-500"
                      placeholder="Describe your main goal..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {(['Specific', 'Measurable', 'Achievable', 'Relevant', 'Time-bound'] as SmartGoalFields[]).map(item => (
                      <div key={item}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">{item}:</label>
                        <input
                          type="text"
                          value={smartGoal[item]}
                          onChange={e => setSmartGoal(g => ({ ...g, [item]: e.target.value }))}
                          className="w-full border border-gray-300 rounded bg-white p-2 text-sm focus:ring-2 focus:ring-btl-500 focus:border-btl-500"
                          placeholder={`How is your goal ${item.toLowerCase()}?`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Progress Tracking Section */}
              <div className="mt-6 bg-btl-50 rounded-lg p-6 border border-btl-200">
                <h3 className="text-lg font-semibold text-btl-700 mb-4">Progress Tracking</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-btl-600">0%</div>
                    <div className="text-xs text-gray-600">Week 1</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">25%</div>
                    <div className="text-xs text-gray-600">Week 4</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-400">100%</div>
                    <div className="text-xs text-gray-600">Week 12</div>
                  </div>
                </div>
                <div className="mt-4 h-3 bg-gray-200 rounded-full">
                  <div className="w-0 h-3 bg-btl-600 rounded-full transition-all duration-500"></div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-4 border-t border-gray-200 flex justify-end text-xs text-gray-500">
                <span>Page 1 of 1</span>
              </div>
            </div>
          </AssessmentDialogBody>
          <AssessmentDialogFooter>
            {/* Use btn-primary-gradient for BTL blue branding on all main action buttons */}
            <div className="flex gap-2">
              <Button className="btn-primary-gradient text-white rounded-xl" onClick={() => generatePDFFromPopup(contentRef, 'SMART-Goals-Tracker.pdf')}>Open PDF</Button>
              <Button className="btn-primary-gradient text-white rounded-xl" onClick={() => {
                const printContents = contentRef.current?.innerHTML;
                if (printContents) {
                  const printWindow = window.open('', '', 'height=900,width=800');
                  if (printWindow) {
                    printWindow.document.write('<html><head><title>SMART Goals</title>');
                    printWindow.document.write('<style>body{background:white;margin:0;padding:0;}@media print{body{margin:0;padding:0;}}</style>');
                    printWindow.document.write('</head><body >');
                    printWindow.document.write(printContents);
                    printWindow.document.write('</body></html>');
                    printWindow.document.close();
                    printWindow.focus();
                    setTimeout(() => { printWindow.print(); printWindow.close(); }, 500);
                  }
                }
              }}>Print Pre-filled Form</Button>
            </div>
          </AssessmentDialogFooter>
        </AssessmentDialogContent>
      </AssessmentDialog>
    )
  }

  const getContent = () => {
    switch (toolkit.category) {
      case "videos":
        // Filter exercises based on search and filters
        let filteredExercises = allExercises.filter(exercise => {
          const matchesSearch = exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               exercise.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesRegion = selectedRegion === "all" || exercise.region === selectedRegion
          const matchesPhase = selectedPhase === "all" || exercise.phase === selectedPhase
          return matchesSearch && matchesRegion && matchesPhase
        })

        // Group exercises by region
        const grouped: { [key: string]: any[] } = {}
        filteredExercises.forEach(exercise => {
          const region = exercise.region || 'Other'
          if (!grouped[region]) {
            grouped[region] = []
          }
          grouped[region].push(exercise)
        })

        // Sort exercises within each region by phase (Reset -> Educate -> Rebuild)
        Object.keys(grouped).forEach(region => {
          grouped[region].sort((a, b) => {
            const phaseOrder = { "Reset": 1, "Educate": 2, "Rebuild": 3 }
            return (phaseOrder[a.phase as keyof typeof phaseOrder] || 0) - (phaseOrder[b.phase as keyof typeof phaseOrder] || 0)
          })
        })

        return grouped
      case "guides":
        // Map InsightLibrary to guides format with difficulty levels
        const insightGuides = insightLibrary.map(insight => {
          // Determine difficulty based on week (simplified mapping)
          let difficulty = "Beginner"
          if (insight.week >= 3 && insight.week <= 4) difficulty = "Intermediate"
          if (insight.week >= 5) difficulty = "Advanced"
          
          // Estimate page count based on complexity
          const pageCount = insight.week === 1 ? "8-12 pages" : 
                           insight.week <= 3 ? "10-15 pages" : "15-20 pages"
          
          return {
            id: insight.id,
            title: insight.title,
            description: insight.subtitle,
            duration: pageCount,
            difficulty,
            type: "insight",
            topic: insight.track.toLowerCase().replace(/\s+/g, '-'),
            week: insight.week,
            track: insight.track
          }
        })

        // Static mindfulness practices (keep these as they are)
        const mindfulnessPractices = [
          {
            title: "Mindful Breathing for Pain Relief",
            description: "Deep breathing techniques to reduce pain and stress",
            duration: "5-10 min",
            difficulty: "Beginner",
            type: "mindfulness",
            topic: "pain-management",
            url: "https://www.youtube.com/watch?v=lcUlprEmMtA",
            backupUrl: "https://www.youtube.com/watch?v=BqLDxLzw6Pk"
          },
          {
            title: "Progressive Muscle Relaxation",
            description: "Systematic tension and release for full body relaxation",
            duration: "15-20 min", 
            difficulty: "Beginner",
            type: "mindfulness",
            topic: "pain-management",
            url: "https://www.youtube.com/watch?v=Z95gPdFC7GM",
            backupUrl: "https://www.youtube.com/watch?v=JyRoju2Rscs"
          },
          {
            title: "Body Scan Meditation",
            description: "Mindful awareness of physical sensations throughout the body",
            duration: "10-15 min",
            difficulty: "Beginner", 
            type: "mindfulness",
            topic: "mindfulness",
            url: "https://www.youtube.com/playlist?list=PLbiVpU59JkVaFMGi0A8Im_hfSh-SWsFwg",
            backupUrl: "https://palousemindfulness.com/meditations/bodyscan20min.html"
          },
          {
            title: "Visualization for Recovery",
            description: "Mental imagery techniques to support healing and movement",
            duration: "8-12 min",
            difficulty: "Intermediate",
            type: "mindfulness", 
            topic: "mindset",
            url: "https://www.youtube.com/watch?v=Gv3Z_RnLAO8",
            backupUrl: "https://www.youtube.com/watch?v=fWYUJscRBRw"
          },
          {
            title: "Loving-Kindness Meditation",
            description: "Cultivating compassion for yourself and your recovery journey",
            duration: "10-15 min",
            difficulty: "Intermediate",
            type: "mindfulness",
            topic: "mindset",
            url: "https://www.youtube.com/watch?v=qLbcJwS8V6g",
            backupUrl: "https://www.uclahealth.org/uclamindful/guided-meditations"
          },
          {
            title: "Mindful Movement Awareness",
            description: "Bringing mindfulness to daily movements and activities",
            duration: "5-8 min",
            difficulty: "Beginner",
            type: "mindfulness",
            topic: "movement",
            url: "https://www.youtube.com/watch?v=9hSL89IgRg4",
            backupUrl: "https://www.youtube.com/playlist?list=PLFv7LsNjAzXjitsgPh_MdmCuqh9FJYHUs"
          },
          {
            title: "Stress Response Regulation",
            description: "Techniques to calm your nervous system during pain flares",
            duration: "8-12 min",
            difficulty: "Intermediate",
            type: "mindfulness",
            topic: "flare-ups",
            url: "https://www.youtube.com/watch?v=9fEo9my03Ks",
            backupUrl: "https://www.youtube.com/watch?v=CgYl8P4rTU0"
          },
          {
            title: "Mindful Pain Observation",
            description: "Learning to observe pain without judgment or resistance",
            duration: "10-15 min",
            difficulty: "Advanced",
            type: "mindfulness",
            topic: "pain-management",
            url: "https://www.youtube.com/watch?v=W8e_tAEM80k",
            backupUrl: "https://www.youtube.com/watch?v=wm1t5FyK5Ek"
          },
        ]

        // Combine mindfulness practices and insights
        const guidesContent = [...mindfulnessPractices, ...insightGuides]

        // Filter guides based on search and filters
        let filteredGuides = guidesContent.filter(guide => {
          const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               guide.description.toLowerCase().includes(searchTerm.toLowerCase())
          const matchesTopic = selectedRegion === "all" || guide.topic === selectedRegion
          const matchesDifficulty = selectedPhase === "all" || guide.difficulty.toLowerCase() === selectedPhase
          return matchesSearch && matchesTopic && matchesDifficulty
        })

        // Group guides by type (mindfulness vs insight)
        const groupedGuides: { [key: string]: any[] } = {}
        filteredGuides.forEach(guide => {
          const type = guide.type === "mindfulness" ? "mindfulness" : "insight"
          if (!groupedGuides[type]) {
            groupedGuides[type] = []
          }
          groupedGuides[type].push(guide)
        })

        // Sort guides within each type by difficulty (Beginner -> Intermediate -> Advanced)
        Object.keys(groupedGuides).forEach(type => {
          groupedGuides[type].sort((a, b) => {
            const difficultyOrder = { "Beginner": 1, "Intermediate": 2, "Advanced": 3 }
            return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0)
          })
        })

        return groupedGuides
      case "tools":
        return [
          { title: "Pain Tracking Journal", description: "Downloadable PDF with guided prompts", type: "tool" },
          { title: "Exercise Timer", description: "Customizable intervals for different exercises", type: "tool" },
          { title: "Recovery Goal Setting", description: "SMART goal templates and progress tracking", type: "tool" },
          { title: "Sleep Hygiene Tracker", description: "Sleep quality, pain levels, and correlation insights", type: "tool" },
        ]
      default:
        return []
    }
  }

  const content = getContent()
  try {
    console.log('🪟 ToolkitModal open:', {
      title: toolkit?.title,
      category: toolkit?.category,
      guidesCount: Array.isArray((content as any)?.insight) ? (content as any).insight.length : undefined
    })
  } catch {}

  // Get unique regions and phases for filters
  const regions = ["all", ...Array.from(new Set(allExercises.map(ex => ex.region)))]
  const phases = ["all", "Beginner", "Intermediate", "Advanced"]

  // Type guard for exercises
  const isExercise = (item: any): item is { name: string; duration: string; difficulty: string; region: string } => {
    return item && typeof item.name === 'string' && typeof item.duration === 'string';
  }

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "Beginner": return "bg-[#D0F6FB] text-[#005F75] border-[#D0F6FB]" // Light teal with dark text
      case "Intermediate": return "bg-[#00C7E3] text-white border-[#00C7E3]" // Medium teal with white text
      case "Advanced": return "bg-[#005F75] text-white border-[#005F75]" // Dark teal with white text
      default: return "bg-gray-50 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-br from-btl-900 via-btl-700 to-btl-100 px-8 pt-8 pb-4 border-b border-white/40 rounded-t-xl relative">
          <button onClick={onClose} className="absolute top-6 right-6 p-2 rounded-full text-white hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-white/60">
            <X className="w-6 h-6" />
          </button>
          <div className="flex items-center gap-8">
            {toolkit.category === "videos" ? (
              <Play className="w-12 h-12 text-white opacity-90" />
            ) : toolkit.category === "guides" ? (
              <BookOpen className="w-12 h-12 text-white opacity-90" />
            ) : (
              <Wrench className="w-12 h-12 text-white opacity-90" />
            )}
            <div>
              <h2 className="text-3xl font-bold text-white">{toolkit.title}</h2>
              <p className="mt-2 text-btl-100 text-sm">{toolkit.description}</p>
            </div>
          </div>
        </div>
        {/* Filters */}
        {(toolkit.category === "videos" || toolkit.category === "guides") && (
          <div className="p-6 border-b border-gray-200 bg-white sticky top-0 z-10">
            {/* Search Bar */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={toolkit.category === "videos" ? "Search exercises..." : "Search guides..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-btl-500 focus:border-transparent"
              />
            </div>
            {/* Filter Controls */}
            <div className="flex flex-wrap gap-4">
              {toolkit.category === "videos" ? (
                <>
              {/* Region Filter */}
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region === "all" ? "All Regions" : region}
                    </option>
                  ))}
                </select>
              </div>
              {/* Phase Filter */}
              <div className="flex items-center space-x-2">
                <Target className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedPhase}
                  onChange={(e) => setSelectedPhase(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                >
                  {phases.map(phase => (
                    <option key={phase} value={phase}>
                          {phase === "all" ? "All Levels" : phase}
                    </option>
                  ))}
                </select>
              </div>
                </>
              ) : (
                <>
                  {/* Topic Filter for Guides */}
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <select
                      value={selectedRegion}
                      onChange={(e) => setSelectedRegion(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                    >
                      <option value="all">All Topics</option>
                      <option value="pain-management">Pain Management</option>
                      <option value="mindfulness">Mindfulness</option>
                      <option value="movement">Movement & Function</option>
                      <option value="mindset">Recovery Mindset</option>
                      <option value="flare-ups">Flare-Up Management</option>
                      <option value="education">Pain Education</option>
                    </select>
                  </div>
                  {/* Difficulty Filter for Guides */}
                  <div className="flex items-center space-x-2">
                    <Target className="w-4 h-4 text-gray-500" />
                    <select
                      value={selectedPhase}
                      onChange={(e) => setSelectedPhase(e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded-full text-sm focus:ring-2 focus:ring-btl-500 focus:border-transparent"
                    >
                      <option value="all">All Levels</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </>
              )}
              {/* Clear Filters */}
              {(searchTerm || selectedRegion !== "all" || selectedPhase !== "all") && (
                <button
                  onClick={() => {
                    setSearchTerm("")
                    setSelectedRegion("all")
                    setSelectedPhase("all")
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        )}
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-6">
          {toolkit.category === "videos" ? (
            // Grouped Exercise Videos by Region
            <div className="space-y-8">
              {Object.entries(content as { [key: string]: any[] }).map(([region, exercises]) => (
                <div key={region} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                    <h3 className="text-xl font-semibold text-gray-900">{region}</h3>
                    <p className="text-gray-600 text-sm">{Array.isArray(exercises) ? exercises.length : 0} exercises available</p>
                  </div>
                  <div className="p-6">
                    {Array.isArray(exercises) && exercises.length > 0 ? (
                      <div className="space-y-6">
                        {/* Group exercises by phase */}
                        {["Reset", "Educate", "Rebuild"].map(phase => {
                          const phaseExercises = exercises.filter((exercise: any) => exercise.phase === phase)
                          if (phaseExercises.length === 0) return null
                          
                          return (
                            <div key={phase} className="space-y-3">
                              {/* Phase Sub-header */}
                              <div className="flex items-center space-x-3">
                                <h4 className={`text-lg font-semibold px-3 py-1 rounded-full border ${getPhaseColor(phase)}`}>
                                  {phase} Phase
                                </h4>
                                <span className="text-sm text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                                  {phaseExercises.length} exercise{phaseExercises.length !== 1 ? 's' : ''}
                                </span>
                              </div>
                              
                              {/* Exercises Grid */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {phaseExercises.map((exercise: any, index: number) => (
                                  <div
                                    key={typeof exercise.id === 'string' ? exercise.id : index}
                                    className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-btl-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                    onClick={() => setSelectedExercise(exercise)}
                                  >
                                    <div className="p-2 bg-btl-100 rounded-full border-2 border-btl-600">
                                      <Play className="w-5 h-5 text-btl-600" />
                                    </div>
                                    <div className="flex-1">
                                      <h3 className="font-medium text-gray-900">{exercise.name}</h3>
                                      <p className="text-sm text-gray-600">
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{exercise.duration}</span>
                                        <span className="mx-2">•</span>
                                        <span className="px-2 py-0.5 rounded-full bg-gray-100">{exercise.difficulty}</span>
                                      </p>
                                    </div>
                                    <button className="px-3 py-1 bg-btl-600 text-white text-sm rounded-full hover:bg-btl-700 transition-colors">
                                      Watch
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ) : (
                      <div className="text-center text-gray-500 py-8">No exercises found for this region.</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : toolkit.category === "guides" ? (
            // Grouped Recovery Guides by Type
            <div className="space-y-8">
              {/* Mindfulness Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Mindfulness & Meditation</h3>
                  <p className="text-gray-600 text-sm">
                    {(content as { [key: string]: any[] }).mindfulness ? (content as { [key: string]: any[] }).mindfulness.length : 0} mindfulness practices available
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Group by difficulty */}
                    {["Beginner", "Intermediate", "Advanced"].map(difficulty => {
                      const difficultyGuides = (content as { [key: string]: any[] }).mindfulness ? (content as { [key: string]: any[] }).mindfulness.filter((item: any) => item.difficulty === difficulty) : []
                      if (difficultyGuides.length === 0) return null
                      
                      return (
                        <div key={difficulty} className="space-y-3">
                          {/* Difficulty Sub-header */}
                          <div className="flex items-center space-x-3">
                            <h4 className={`text-lg font-semibold px-3 py-1 rounded-full border ${getPhaseColor(difficulty)}`}>
                              {difficulty} Level
                            </h4>
                            <span className="text-sm text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                              {difficultyGuides.length} practice{difficultyGuides.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {/* Guides Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {difficultyGuides.map((guide: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-btl-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => setSelectedMindfulness(guide)}
                              >
                                <div className="p-2 bg-btl-100 rounded-full border-2 border-btl-600">
                                  <BookOpen className="w-5 h-5 text-btl-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{guide.title}</h3>
                                  <p className="text-sm text-gray-600 mb-1">{guide.description}</p>
                                  <p className="text-sm text-gray-600">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{guide.duration}</span>
                                    <span className="mx-2">•</span>
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{guide.difficulty}</span>
                                  </p>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); setSelectedMindfulness(guide) }}
                                  className="px-3 py-1 bg-btl-600 text-white text-sm rounded-full hover:bg-btl-700 transition-colors"
                                >
                                  Start
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Recovery Insights Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Recovery Insights</h3>
                  <p className="text-gray-600 text-sm">
                    {(content as { [key: string]: any[] }).insight ? (content as { [key: string]: any[] }).insight.length : 0} educational guides available
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Group by difficulty */}
                    {["Beginner", "Intermediate", "Advanced"].map(difficulty => {
                      const difficultyInsights = (content as { [key: string]: any[] }).insight ? (content as { [key: string]: any[] }).insight.filter((item: any) => item.difficulty === difficulty) : []
                      if (difficultyInsights.length === 0) return null
                      
                      return (
                        <div key={difficulty} className="space-y-3">
                          {/* Difficulty Sub-header */}
                          <div className="flex items-center space-x-3">
                            <h4 className={`text-lg font-semibold px-3 py-1 rounded-full border ${getPhaseColor(difficulty)}`}>
                              {difficulty} Level
                            </h4>
                            <span className="text-sm text-gray-500 px-2 py-0.5 rounded-full bg-gray-100">
                              {difficultyInsights.length} guide{difficultyInsights.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                          
                          {/* Insights Grid */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {difficultyInsights.map((insight: any, index: number) => (
                              <div
                                key={index}
                                className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:border-btl-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                                onClick={() => insight.id ? setSelectedInsight(insight.id) : null}
                              >
                                <div className="p-2 bg-btl-100 rounded-full border-2 border-btl-600">
                                  <FileText className="w-5 h-5 text-btl-600" />
                                </div>
                                <div className="flex-1">
                                  <h3 className="font-medium text-gray-900">{insight.title}</h3>
                                  <p className="text-sm text-gray-600 mb-1">{insight.description}</p>
                                  <p className="text-sm text-gray-600">
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{insight.duration}</span>
                                    <span className="mx-2">•</span>
                                    <span className="px-2 py-0.5 rounded-full bg-gray-100">{insight.difficulty}</span>
                                  </p>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (insight.id) setSelectedInsight(insight.id);
                                  }}
                                  className="px-3 py-1 bg-btl-600 text-white text-sm rounded-full hover:bg-btl-700 transition-colors"
                                >
                                  Read
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          ) : toolkit.category === "tools" ? (
            // Support Tools Layout
            <div className="space-y-6">
              {/* Pain Tracking Journal */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Pain Tracking Journal</h3>
                  <p className="text-gray-600 text-sm">Evidence-based daily pain monitoring with guided prompts</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-btl-200 hover:shadow-md transition-all duration-200">
                      <div className="p-2 bg-btl-100 rounded-xl border-2 border-btl-600">
                        <FileText className="w-5 h-5 text-btl-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">Daily Pain Journal</h3>
                        <p className="text-sm text-gray-600 mb-2">Track pain levels, triggers, and recovery progress based on Pain Neuroscience Education</p>
                        <div className="flex space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Evidence-Based</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Guided Prompts</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Sleep Correlation</span>
                        </div>
          ) : null}
          {/* Mindfulness Modal */}
          {selectedMindfulness && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMindfulness.title}</h3>
                    <p className="text-sm text-gray-600">{selectedMindfulness.description}</p>
                  </div>
                  <button onClick={() => setSelectedMindfulness(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {selectedMindfulness.url && (selectedMindfulness.url.includes('youtube.com') || selectedMindfulness.url.includes('youtu.be')) ? (
                    <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                      <iframe
                        src={`https://www.youtube.com/embed/${(selectedMindfulness.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1]) || ''}`}
                        title={selectedMindfulness.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute top-0 left-0 w-full h-full rounded-lg"
                      />
                    </div>
                  ) : (
                    <a
                      href={selectedMindfulness.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-btl-600 text-white rounded-full hover:bg-btl-700"
                    >
                      Open Resource
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <div className="text-xs text-gray-500">
                    Source: educational resource used for patient education.
                  </div>
                </div>
              </div>
            </div>
          )}
                      </div>
                      <button 
                        onClick={() => setShowPainJournalPopup(true)}
                        className="px-4 py-2 bg-btl-600 text-white text-sm rounded-xl hover:bg-btl-700 transition-colors"
                      >
                        Open PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Exercise Timer */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Exercise Timer</h3>
                  <p className="text-gray-600 text-sm">Evidence-based timing for movement sessions and rest periods</p>
                </div>
                <div className="p-6">
                  {!showTimer ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-btl-200 hover:shadow-md transition-all duration-200">
                        <div className="p-2 bg-btl-100 rounded-xl border-2 border-btl-600">
                          <Clock className="w-5 h-5 text-btl-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">Movement Session Timer</h3>
                          <p className="text-sm text-gray-600 mb-2">Set intervals for exercise and rest periods based on activity pacing principles</p>
                          <div className="flex space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Activity Pacing</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Rest Intervals</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Visual Cues</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowTimer(true)}
                          className="px-4 py-2 bg-btl-600 text-white text-sm rounded-xl hover:bg-btl-700 transition-colors"
                        >
                          Start Timer
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-6xl font-bold text-btl-600 mb-4">
                          {String(timerMinutes).padStart(2, '0')}:{String(timerSeconds).padStart(2, '0')}
                        </div>
                        <div className="flex justify-center space-x-4">
                          {!isTimerRunning ? (
                            <button 
                              onClick={startTimer}
                              className="px-6 py-3 bg-btl-600 text-white rounded-xl hover:bg-btl-700 transition-colors"
                            >
                              Start
                            </button>
                          ) : (
                            <button 
                              onClick={() => setIsTimerRunning(false)}
                              className="px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors"
                            >
                              Pause
                            </button>
                          )}
                          <button 
                            onClick={resetTimer}
                            className="px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-colors"
                          >
                            Reset
                          </button>
                          <button 
                            onClick={() => setShowTimer(false)}
                            className="px-6 py-3 btn-primary-gradient text-white rounded-xl hover:bg-btl-700 transition-colors"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Minutes</label>
                          <input
                            type="number"
                            min="0"
                            max="60"
                            value={timerMinutes}
                            onChange={(e) => setTimerMinutes(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-btl-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Seconds</label>
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={timerSeconds}
                            onChange={(e) => setTimerSeconds(parseInt(e.target.value) || 0)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-btl-500"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Recovery Goal Setting */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Recovery Goal Setting</h3>
                  <p className="text-gray-600 text-sm">Evidence-based SMART goal templates and progress tracking</p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-btl-200 hover:shadow-md transition-all duration-200">
                      <div className="p-2 bg-btl-100 rounded-xl border-2 border-btl-600">
                        <Target className="w-5 h-5 text-btl-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">SMART Goal Tracker</h3>
                        <p className="text-sm text-gray-600 mb-2">Set specific, measurable recovery milestones based on graded exposure principles</p>
                        <div className="flex space-x-2">
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Evidence-Based</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Goal Templates</span>
                          <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Progress Tracking</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowSMARTGoalsPopup(true)}
                        className="px-4 py-2 bg-btl-600 text-white text-sm rounded-xl hover:bg-btl-700 transition-colors"
                      >
                        Open PDF
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sleep Hygiene Tracker */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gradient-to-r from-btl-50 to-btl-100 px-6 py-4 border-b border-btl-200">
                  <h3 className="text-xl font-semibold text-gray-900">Sleep Hygiene Tracker</h3>
                  <p className="text-gray-600 text-sm">Evidence-based sleep tracking and pain correlation analysis</p>
                </div>
                <div className="p-6">
                  {!showSleepTracker ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-btl-200 hover:shadow-md transition-all duration-200">
                        <div className="p-2 bg-btl-100 rounded-xl border-2 border-btl-600">
                          <Moon className="w-5 h-5 text-btl-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">Sleep & Pain Correlation</h3>
                          <p className="text-sm text-gray-600 mb-2">Track sleep patterns and pain correlation based on sleep medicine research</p>
                          <div className="flex space-x-2">
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Sleep Quality</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Pain Correlation</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-xs">Evidence-Based</span>
                          </div>
                        </div>
                        <button 
                          onClick={() => setShowSleepTracker(true)}
                          className="px-4 py-2 bg-btl-600 text-white text-sm rounded-xl hover:bg-btl-700 transition-colors"
                        >
                          Track Sleep
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sleep Quality (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={sleepData.sleepQuality}
                            onChange={(e) => setSleepData({...sleepData, sleepQuality: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="text-center text-sm text-gray-600 mt-1">{sleepData.sleepQuality}/10</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Pain Level (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={sleepData.painLevel}
                            onChange={(e) => setSleepData({...sleepData, painLevel: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="text-center text-sm text-gray-600 mt-1">{sleepData.painLevel}/10</div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Hours of Sleep</label>
                          <input
                            type="number"
                            min="0"
                            max="12"
                            step="0.5"
                            value={sleepData.sleepHours}
                            onChange={(e) => setSleepData({...sleepData, sleepHours: parseFloat(e.target.value)})}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-btl-500 focus:border-btl-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Stress Level (1-10)</label>
                          <input
                            type="range"
                            min="1"
                            max="10"
                            value={sleepData.stressLevel}
                            onChange={(e) => setSleepData({...sleepData, stressLevel: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          />
                          <div className="text-center text-sm text-gray-600 mt-1">{sleepData.stressLevel}/10</div>
                        </div>
                      </div>
                      
                      <div className="bg-btl-50 p-4 rounded-xl border border-btl-200">
                        <h4 className="font-semibold text-btl-700 mb-2">Sleep-Pain Correlation Insights</h4>
                        <div className="text-sm text-gray-700 space-y-1">
                          {sleepData.sleepQuality < 6 && (
                            <p>⚠️ Poor sleep quality may be contributing to increased pain sensitivity</p>
                          )}
                          {sleepData.sleepHours < 7 && (
                            <p>⚠️ Less than 7 hours of sleep can amplify pain perception</p>
                          )}
                          {sleepData.stressLevel > 7 && (
                            <p>⚠️ High stress levels can interfere with sleep quality and pain management</p>
                          )}
                          {sleepData.sleepQuality >= 7 && sleepData.sleepHours >= 7 && sleepData.stressLevel <= 6 && (
                            <p>✅ Good sleep hygiene! This should support your pain management efforts</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex justify-center space-x-4">
                        <button 
                          onClick={() => setShowSleepTracker(false)}
                          className="px-6 py-3 bg-btl-600 text-white rounded-xl hover:bg-btl-700 transition-colors"
                        >
                          Save & Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            // Regular Grid Layout for other categories
            <div className="grid gap-4">
              {(content as any[]).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-xl hover:border-teal-200 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="p-2 bg-teal-100 rounded-xl border-2 border-teal-600">
                    {item.type === "video" && <Play className="w-5 h-5 text-teal-600" />}
                    {item.type === "guide" && <BookOpen className="w-5 h-5 text-teal-600" />}
                    {item.type === "tool" && (
                      item.title.includes("Journal") ? <FileText className="w-5 h-5 text-teal-600" /> :
                      item.title.includes("Timer") ? <Clock className="w-5 h-5 text-teal-600" /> :
                      item.title.includes("Goal") ? <Target className="w-5 h-5 text-teal-600" /> :
                      item.title.includes("Sleep") ? <Moon className="w-5 h-5 text-teal-600" /> :
                      <Download className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-600">
                      <span className="px-2 py-0.5 rounded-full bg-gray-100 inline-block">{item.duration || item.pages || item.description}</span>
                    </p>
                  </div>
                  <button className="px-3 py-1 bg-teal-600 text-white text-sm rounded-full hover:bg-teal-700 transition-colors">
                    {item.type === "video" ? "Watch" : item.type === "guide" ? "Read" : "Use"}
                  </button>
                </div>
              ))}
            </div>
          )}
          {selectedExercise && isExercise(selectedExercise) && (
            <ExerciseVideoModal
              exercise={selectedExercise}
              open={!!selectedExercise}
              onClose={() => setSelectedExercise(null)}
            />
          )}
          {selectedInsight && (
            <InsightDialog
              insightId={selectedInsight}
              isOpen={!!selectedInsight}
              onClose={() => setSelectedInsight(null)}
              onComplete={(insightId, points) => {
                if (onInsightComplete) {
                  onInsightComplete(insightId, points);
                }
                setSelectedInsight(null);
              }}
              patientId={patientId}
            />
          )}
          {/* Ensure Mindfulness modal renders for Guides category clicks */}
          {selectedMindfulness && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-4">
              <div className="bg-white rounded-xl max-w-2xl w-full overflow-hidden shadow-2xl border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{selectedMindfulness.title}</h3>
                    <p className="text-sm text-gray-600">{selectedMindfulness.description}</p>
                  </div>
                  <button onClick={() => setSelectedMindfulness(null)} className="text-gray-500 hover:text-gray-700">
                    <X className="w-6 h-6" />
                  </button>
                </div>
                <div className="p-6 space-y-4">
                  {(() => {
                    const url = selectedMindfulness.url || ''
                    const videoMatch = url.match(/(?:youtu\\.be\/|youtube\\.com\/(?:watch\\?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{6,})/)
                    const listMatch = url.match(/[?&]list=([A-Za-z0-9_-]+)/)
                    const videoId = videoMatch?.[1]
                    const listId = listMatch?.[1]
                    const embedSrc = videoId
                      ? `https://www.youtube-nocookie.com/embed/${videoId}`
                      : (listId ? `https://www.youtube-nocookie.com/embed/videoseries?list=${listId}` : null)
                    if (embedSrc) {
                      return (
                        <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                          <iframe
                            src={embedSrc}
                            title={selectedMindfulness.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full rounded-lg"
                          />
                        </div>
                      )
                    }
                    return (
                      <a
                        href={selectedMindfulness.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-btl-600 text-white rounded-full hover:bg-btl-700"
                      >
                        Open Resource
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )
                  })()}
                  {selectedMindfulness.backupUrl && (
                    <a
                      href={selectedMindfulness.backupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-btl-100 text-btl-700 rounded-full hover:bg-btl-200"
                    >
                      Open Backup
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  <div className="text-xs text-gray-500">
                    Source: educational resource used for patient education.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {showPainJournalPopup && <PainJournalPopup />}
      {showSMARTGoalsPopup && <SMARTGoalsPopup />}
    </div>
  )
}
