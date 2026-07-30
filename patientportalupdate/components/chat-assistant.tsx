"use client"

import { useState, useEffect, useRef } from "react"
import { X, Send, Bot, User, Sparkles, Heart, Brain, Activity } from "lucide-react"

interface ChatAssistantProps {
  onClose: () => void
}

interface Message {
  id: number
  type: "bot" | "user"
  content: string
  timestamp: Date
  isLoading?: boolean
}

export function ChatAssistant({ onClose }: ChatAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      type: "bot",
      content: "Hi! I'm your Back to Life recovery assistant. I'm here to help you navigate your recovery plan and the educational resources selected for your portal. I can explain the framework, but I cannot diagnose symptoms or replace advice from your clinician. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Ref for auto-scrolling to bottom
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Back to Life Framework knowledge base - Updated 2025
  const backToLifeKnowledge = {
    phases: {
      reset: {
        description: "The RESET phase (SRS 0-3) focuses on symptom control, movement reassurance, and establishing foundational patterns.",
        interventions: ["Breathing exercises", "Gentle mobility work", "Pain education", "Stress management techniques", "Postural awareness"],
        goals: ["Reduce pain and stress", "Establish daily routines", "Build confidence in movement", "Understand pain patterns"],
        srsRange: "0-3 points"
      },
      educate: {
        description: "The EDUCATE phase (SRS 4-7) emphasizes graded exposure, education, and habit change.",
        interventions: ["Movement education", "Lifestyle optimization", "Recovery science", "Goal setting", "Progressive challenges"],
        goals: ["Understand your recovery", "Build healthy habits", "Improve movement quality", "Develop self-efficacy"],
        srsRange: "4-7 points"
      },
      rebuild: {
        description: "The REBUILD phase (SRS 8-11) focuses on higher-load rehabilitation, capacity building, and performance optimization.",
        interventions: ["Progressive strength training", "Advanced movement patterns", "Performance optimization", "Lifestyle mastery", "Return to activities"],
        goals: ["Build strength and resilience", "Master movement patterns", "Achieve long-term health", "Return to meaningful activities"],
        srsRange: "8-11 points"
      }
    },
    principles: [
      "Movement is medicine",
      "Recovery is a journey, not a destination",
      "Small consistent actions create big changes",
      "Your body has an incredible capacity to heal",
      "Progress over perfection",
      "Pain is information, not damage",
      "Consistency beats intensity"
    ],
    domains: {
      movement: "Physical movement and exercise patterns (60 points/week)",
      mindset: "Mental health and psychological resilience (40 points/week)",
      lifestyle: "Daily habits and environmental factors (40 points/week)",
      education: "Knowledge and understanding of recovery (30 points/week)",
      adherence: "Clinical compliance and follow-through (30 points/week)"
    },
    srsScoring: {
      baseline: "0-11 points based on pain, disability, confidence, and beliefs",
      followUp: "0-11 points including improvement bonuses and GROC ratings",
      components: [
        "Pain assessment (VAS ≤3: +1 point)",
        "Disability index (≤20%: +1 point)",
        "Task function (PSFS ≥4: +1 point)",
        "Recovery confidence (≥8: +2 points, ≥5: +1 point)",
        "Negative beliefs (resolved: +1 point)",
        "Fear-avoidance (TSK-7 ≤30%: +1 point)",
        "Clinician assessments (+2 points max)"
      ]
    },
    exerciseSystem: {
      assignment: "3 exercises per session based on SRS score and region",
      phases: {
        reset: "Gentle breathing, postural work, basic mobility",
        educate: "Progressive movement, education, habit building",
        rebuild: "Strength training, advanced patterns, performance"
      },
      regions: ["Neck/Cervical", "Thoracic/Mid-Back", "Lumbar/Low Back", "Upper Extremity", "Lower Extremity"]
    },
    recoveryPoints: {
      weeklyTarget: "150 points total",
      categories: {
        movement: "Exercise, walking, stretching (45 points)",
        lifestyle: "Sleep, hydration, nutrition (30 points)",
        mindset: "Mindfulness, journaling, gratitude (30 points)",
        education: "Learning modules, quizzes (25 points)",
        adherence: "Clinic visits, form completion (20 points)"
      },
      achievements: {
        bronze: "50+ points - Getting Started",
        silver: "100+ points - Making Progress",
        gold: "150+ points - Recovery Champion",
        platinum: "200+ points - Recovery Master"
      }
    }
  }

  const generateResponse = async (userMessage: string): Promise<string> => {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000))

    const lowerMessage = userMessage.toLowerCase()

    // Phase-specific responses using authentic Back to Life clinical language
    if (lowerMessage.includes("phase") || lowerMessage.includes("reset") || lowerMessage.includes("educate") || lowerMessage.includes("rebuild")) {
      if (lowerMessage.includes("reset")) {
        return `The RESET phase is your foundation - this is where we calm sensitivity, decompress, and reintroduce safe movement.

🔹 **Clinical Focus:**
We're calming your nervous system's protective responses and creating space for efficient movement to return. Think of it as hitting the "reset button" on your body's alarm system.

🔹 **What We're Actually Doing:**
• Manual therapy with targeted adjustments/decompression techniques
• Early postural retraining and breathwork
• Patient-centered pain education
• Foundational movement resets

🔹 **The Science Behind It:**
Your nervous system has been in "protective mode" - we're teaching it that movement is safe again. This isn't just about pain relief; it's about rebuilding trust in your body's capacity to move.

🔹 **Real Patient Example:**
Take Sarah, who had persistent neck pain from a car accident. In RESET, we focused on calming her nervous system's sensitivity to movement, especially around shoulder checking while driving. We didn't rush her back to normal - we built a foundation of safety first.

🔹 **Your Signature Recovery Score™:**
In RESET, you're typically scoring 0-3 points. This isn't about being "behind" - it's about where your system needs to start. We're not judging your progress; we're meeting you where you are.

Remember: This phase is about creating space for healing, not forcing recovery. We calm the system to create space for efficient movement to return. 🌱`
      } else if (lowerMessage.includes("educate")) {
        return `The EDUCATE phase is where we restore efficient, confident movement patterns through guided movement retraining.

🔹 **Clinical Focus:**
We're teaching your body to move with confidence again. This isn't just exercise - it's movement re-education for spinal control, hinge patterns, squat mechanics, and locomotion.

🔹 **What We're Actually Doing:**
• Guided movement retraining for spinal control/hinge/squat/locomotion
• Load introduction through graded exposure
• Patient-centered coaching for autonomy and movement optimism
• Cognitive reframing: "Why did this happen? How do I prevent it?"

🔹 **The Science Behind It:**
Your body has learned protective movement patterns. We're teaching it new, efficient patterns that serve you long-term. This is about building movement literacy, not just strength.

🔹 **Real Patient Example:**
Sarah's shoulder checking while driving was rated 2/10 on her Patient-Specific Functional Scale. In EDUCATE, we didn't just strengthen her neck - we taught her how to move her entire spine efficiently, how to breathe during movement, and how to trust her body again.

🔹 **Your Signature Recovery Score™:**
In EDUCATE, you're typically scoring 4-7 points. This is where the real work happens - where knowledge becomes power and movement becomes medicine.

🔹 **Cognitive Reframing:**
We explore questions like "Why did this happen?" and "How do I prevent it?" This isn't about blame - it's about understanding your body's story and writing a new chapter.

We restore trust in movement by rebuilding strong, sustainable patterns. This is where you become your own recovery expert. 📚`
      } else if (lowerMessage.includes("rebuild")) {
        return `The REBUILD phase is where we strengthen, integrate function, and sustain results for the long haul.

🔹 **Clinical Focus:**
We're building functional capacity that lasts beyond the clinic. This isn't just about getting better - it's about becoming stronger than you were before.

🔹 **What We're Actually Doing:**
• Progressive strength training with real-world application
• Advanced movement pattern integration
• Performance optimization for your specific goals
• Return to meaningful activities with confidence

🔹 **The Science Behind It:**
Your body has adapted to injury - now we're adapting it to strength, resilience, and performance. This is about building a system that can handle life's demands, not just survive them.

🔹 **Real Patient Example:**
Sarah's goal was to return to confident driving without fear of flare-ups. In REBUILD, we didn't just strengthen her neck - we built her entire system to handle the demands of daily life, work, and the activities she loves.

🔹 **Your Signature Recovery Score™:**
In REBUILD, you're typically scoring 8-11 points. This represents not just recovery, but optimization. You're not just back to baseline - you're building something better.

🔹 **The Long Game:**
This phase is about sustainability. We're not just fixing a problem - we're building a system that prevents problems. Built for recovery. Built for real life. Built to last.

You're not just recovering - you're building something better than before. This is about long-term resilience and sustainable results. 💪`
      }
    }

    // Pain management responses using real Back to Life clinical language
    if (lowerMessage.includes("pain") || lowerMessage.includes("hurt") || lowerMessage.includes("ache")) {
      return `Pain is your body's communication system - let's listen to what it's telling us.

🔹 **The Back to Life Approach:**
Pain doesn't mean you're doing something wrong - it's information. We use it to guide your recovery journey, not to judge your progress.

🔹 **Immediate Strategies:**
• Deep breathing exercises (4-7-8 technique)
• Gentle movement and mobility work
• Heat or ice therapy as clinically appropriate
• Restorative positions that feel good

🔹 **The Reality of Pain Relief:**
Pain relief isn't always linear. Some people feel dramatic relief early in RESET, while others progress more gradually through EDUCATE. What matters more is your overall Signature Recovery Score™, which looks at pain, function, confidence, and beliefs together.

🔹 **Real Patient Example:**
Sarah's neck pain was 6/10 on the VAS scale. But we didn't just focus on the pain number - we looked at her function (shoulder checking 2/10), her confidence (4/10), and her fear of movement. Pain was just one piece of her recovery puzzle.

🔹 **When Pain Persists:**
A drop in your Signature Recovery Score™ doesn't mean you're failing—it signals a shift in your body's response. Maybe you missed a visit, changed routines, or had a flare-up. The score helps us catch those changes early and make smart adjustments.

🔹 **The Long Game:**
We're not just managing pain - we're building a system that prevents pain. This is about creating sustainable movement patterns that serve you for life.

Trust the process—you're still moving forward, even when it doesn't feel like it. 🧘‍♀️`
    }

    // Movement responses using real Back to Life exercise system
    if (lowerMessage.includes("exercise") || lowerMessage.includes("movement") || lowerMessage.includes("workout")) {
      return `Movement is medicine! Here's how our Back to Life exercise system actually works:

🔹 **Our Exercise Assignment:**
• 3 exercises per session based on your SRS score and region
• Progressive difficulty as you improve
• Video demonstrations and clear instructions
• Integration with your recovery points system

🔹 **Phase-Specific Movement:**
• **RESET:** Gentle breathing, postural work, basic mobility - we're teaching your body that movement is safe
• **EDUCATE:** Progressive movement, education, habit building - we're building movement literacy
• **REBUILD:** Strength training, advanced patterns, performance - we're optimizing your system

🔹 **The Real Deal:**
This isn't just "do these exercises." It's about understanding why each movement matters for your specific situation. We're building movement patterns that serve you in real life.

🔹 **Real Patient Example:**
Sarah's exercises weren't just generic neck stretches. They were specifically designed to improve her shoulder checking while driving - her main functional limitation. Each exercise had a purpose beyond just "strengthening."

🔹 **What to Expect:**
• 10-15 minutes total per session
• Exercises that feel good (not necessarily easy)
• Progressive challenges as your SRS score improves
• Integration with your daily life and goals

🔹 **The Key:**
Start where you are - no judgment. Quality over quantity. Listen to your body's feedback. Progress happens in small increments. Consistency beats intensity.

Remember: Movement should feel good (not necessarily easy). Your body is designed to move! 🏃‍♀️`
    }

    // SRS scoring responses using real Back to Life language
    if (lowerMessage.includes("srs") || lowerMessage.includes("score") || lowerMessage.includes("recovery score")) {
      return `The Signature Recovery Score™ (SRS) is your personalized recovery metric - this is how we actually track your progress.

🔹 **What Your Score Really Means:**
It's not about being "good" or "bad" - it's about understanding where your system is and what it needs next. Every point represents real progress in your journey.

🔹 **The Scoring System:**
• **Baseline (Intake):** 0-11 points based on pain, disability, confidence, and beliefs
• **Follow-up:** 0-11 points including improvement bonuses and GROC ratings

🔹 **Score Components (The Real Deal):**
• Pain assessment (VAS ≤3: +1 point)
• Disability index (≤20%: +1 point)
• Task function (PSFS ≥4: +1 point)
• Recovery confidence (≥8: +2 points, ≥5: +1 point)
• Negative beliefs (resolved: +1 point)
• Fear-avoidance (TSK-7 ≤30%: +1 point)
• Clinician assessments (+2 points max)

🔹 **Phase Classification:**
• **RESET:** 0-3 points (symptom control & movement reassurance)
• **EDUCATE:** 4-7 points (graded exposure & education)
• **REBUILD:** 8-11 points (higher-load rehab & performance)

🔹 **Real Patient Example:**
Sarah's baseline SRS was 3/10. This told us she was in RESET phase, needing symptom control and movement reassurance. Her score guided every decision about her care - from exercise selection to visit frequency.

🔹 **The Important Truth:**
A drop in your Signature Recovery Score™ doesn't mean you're failing—it signals a shift in your body's response. The score helps us catch those changes early and make smart adjustments. It's not a judgment—it's a guide.

🔹 **How We Use It:**
Your SRS score determines your exercise program, visit frequency, and recovery strategies. It's not just a number - it's your roadmap to recovery.

Your SRS score helps us tailor your exercise program and recovery strategies! 📊`
    }

    // Timeline and duration responses using real Back to Life expectations
    if (lowerMessage.includes("how long") || lowerMessage.includes("duration") || lowerMessage.includes("timeline")) {
      return `Great question about your recovery timeline - let's talk about what's realistic.

🔹 **The Typical Timeline:**
Most people move through RESET, EDUCATE, and REBUILD over the course of 6 to 8 weeks. But here's the real deal: your body sets the pace, not a calendar.

🔹 **What Actually Affects Your Timeline:**
• Some people move faster through RESET, others need more time
• Chronic or complex issues may require additional support
• What matters most is consistent progress—not rushing the outcome

🔹 **Phase Durations (The Real Deal):**
• **RESET (Weeks 0-2):** Calm, supportive, safety-first - we're not rushing this
• **EDUCATE (Weeks 2-4+):** Encouraging, engaging, collaborative - this is where the real work happens
• **REBUILD (Weeks 4-8+):** Progressive loading and movement - building for the long haul

🔹 **Real Patient Example:**
Sarah's timeline wasn't linear. She moved quickly through RESET (felt better in 10 days), but needed extra time in EDUCATE to build confidence in movement. Her body told us what it needed.

🔹 **The Important Truth:**
Your recovery is guided by what your body needs, not a cookie-cutter schedule. We're building something that lasts - built for recovery, built for real life, built to last.

🔹 **What to Expect:**
• Regular reassessment of your SRS score
• Adjustments to your program based on your progress
• Support through the ups and downs
• Focus on sustainable results, not quick fixes

Trust the process and focus on consistent progress! ⏰`
    }

    // General encouragement using real Back to Life principles
    if (lowerMessage.includes("help") || lowerMessage.includes("stuck") || lowerMessage.includes("frustrated")) {
      return `I hear you, and you're not alone in this journey. Recovery isn't always linear - that's normal.

🔹 **The Reality:**
Recovery has ups and downs. Some days you'll feel great, others you'll feel stuck. This doesn't mean you're doing something wrong - it means you're human.

🔹 **When You're Feeling Stuck:**
• Take a deep breath and reset
• Focus on one small action
• Celebrate what you ARE doing
• Reach out to your care team

🔹 **Real Patient Example:**
Sarah had days where she felt like she was going backwards. But we looked at her overall trend - her SRS score was improving, her function was getting better, and her confidence was growing. The bad days didn't define her progress.

🔹 **Back to Life Principles:**
• Movement is medicine
• Recovery is a journey, not a destination
• Small consistent actions create big changes
• Your body has an incredible capacity to heal
• Progress over perfection
• Pain is information, not damage
• Consistency beats intensity

🔹 **The Key Question:**
What's one small thing you can do right now to support your recovery? It doesn't have to be big - just one step forward.

🔹 **Remember:**
At Back to Life, we're guiding you from pain, to education, to resilience. This isn't just about fixing a problem - it's about building a better you.

You're stronger than you think, and you're doing better than you realize. 🌟`
    }

    // Default response using authentic Back to Life language
    return `Thank you for sharing that with me!

As your Back to Life recovery assistant, I'm here to support you through your journey using our structured, evidence-informed recovery blueprint.

🔹 **Our Framework:**
We blend manual therapy, movement education, and patient-centered coaching within the Back to Life Framework: guiding you from pain, to education, to resilience.

🔹 **What Makes Us Different:**
This isn't just treatment - it's a complete recovery system. We're not just managing symptoms; we're building a foundation for long-term health and function.

🔹 **How I Can Help:**
• Explain recovery phases and principles
• Suggest movement and mindset strategies
• Provide encouragement and support
• Guide you through Back to Life concepts
• Help you understand your progress

🔹 **Remember:**
Built for recovery. Built for real life. Built to last.

What aspect of your recovery would you like to explore today? 💪`
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    const newUserMessage: Message = {
      id: messages.length + 1,
      type: "user",
      content: userMessage,
      timestamp: new Date(),
    }

    setMessages(prev => [...prev, newUserMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await generateResponse(userMessage)

      const botResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: response,
        timestamp: new Date(),
      }

      setMessages(prev => [...prev, botResponse])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorResponse: Message = {
        id: messages.length + 2,
        type: "bot",
        content: "I'm having trouble processing that right now. Please try again or reach out to your care team for immediate support.",
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-lg h-[650px] flex flex-col shadow-2xl border border-charcoal-100">
        {/* Header with Back to Life gradient */}
        <div className="bg-gradient-to-r from-btl-900 via-btl-700 to-btl-600 text-white p-6 rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
                <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
                <h3 className="font-bold text-white text-xl">Back to Life Assistant</h3>
                <p className="text-btl-100 text-sm font-medium">Powered by the Back to Life Framework</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-br from-btl-50/40 via-white to-btl-100/30">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-3 max-w-[88%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center shadow-md ${
                    message.type === "user"
                      ? "bg-gradient-to-br from-btl-500 to-btl-600"
                      : "bg-gradient-to-br from-btl-100 to-btl-200 border border-btl-200"
                  }`}
                >
                  {message.type === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-btl-600" />
                  )}
                </div>
                <div
                  className={`p-4 rounded-2xl shadow-md ${
                    message.type === "user"
                      ? "btn-primary-gradient text-white"
                      : "bg-white border border-charcoal-200 text-charcoal-900"
                  }`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3 max-w-[88%]">
                <div className="w-10 h-10 bg-gradient-to-br from-btl-100 to-btl-200 rounded-2xl flex items-center justify-center shadow-md border border-btl-200">
                  <Bot className="w-5 h-5 text-btl-600" />
                </div>
                <div className="bg-white border border-charcoal-200 p-4 rounded-2xl shadow-md">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-btl-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-btl-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-btl-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-charcoal-200 bg-white rounded-b-3xl">
          <div className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Ask about your recovery journey..."
              className="flex-1 p-4 border border-charcoal-200 rounded-2xl focus:ring-2 focus:ring-btl-500 focus:border-btl-500 transition-all duration-200 text-sm bg-white shadow-sm"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="p-4 btn-primary-gradient text-white rounded-2xl hover:shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-md"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 flex items-center justify-center space-x-4 text-xs text-charcoal-500">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Secure patient portal</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-btl-500 rounded-full"></div>
              <span>Back to Life Framework</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
