export interface Insight {
  id: number;
  week: number; // 1-based week number
  track: 'PainScience'|'StressMood'|'Lifestyle'|'SuccessStory'|'SelfEfficacy'|'Recap'|'DeepDive';
  title: string;
  subtitle: string;
  assetPath: string;
  quizQ: string;
  quizA: string;
  releaseOffset: number; // 0 = Day 1 (Mon), 1 = Day 2 (Tue), … 6 = Day 7 (Sun)
  points?: number; // Optional points awarded for completing this insight
  questions?: QuizQuestion[]; // Multiple choice questions
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option (0-based)
}

export const insightLibrary: Insight[] = [
  // --- Week 1 (Keep existing Week 1 content) ---
  {
    id: 21,
    week: 1,
    track: "PainScience",
    title: "Danger vs. safety signals",
    subtitle: "How your brain turns pain up or down",
    assetPath: "/insight/ps-danger.mp4",
    quizQ: "Which best describes a safety signal?",
    quizA: "Trusted movement pattern",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Which best describes a safety signal?",
        options: [
          "A movement that always causes pain",
          "A trusted movement pattern that feels safe",
          "Any exercise that makes you sweat",
          "A movement that requires maximum effort"
        ],
        correctAnswer: 1
      },
      {
        question: "What happens when your brain perceives a movement as dangerous?",
        options: [
          "Pain signals are turned down",
          "Pain signals are amplified",
          "Nothing changes",
          "Movement becomes easier"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 22,
    week: 1,
    track: "StressMood",
    title: "How cortisol slows healing",
    subtitle: "Stress and tissue repair",
    assetPath: "/insight/cortisol.json",
    quizQ: "High cortisol can slow tissue repair. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "High cortisol levels can slow tissue repair. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which of the following is NOT a way to reduce cortisol?",
        options: [
          "Deep breathing exercises",
          "Regular exercise",
          "Chronic stress",
          "Adequate sleep"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 23,
    week: 1,
    track: "Lifestyle",
    title: "Sleep debt + pain sensitivity",
    subtitle: "Less sleep, louder pain",
    assetPath: "/insight/sleep-carousel.json",
    quizQ: "Sleeping < 6 h raises pain sensitivity by about 20 %. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Sleeping < 6 h raises pain sensitivity by about 20 %. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the most effective way to combat sleep debt?",
        options: [
          "Catching up on sleep",
          "Reducing caffeine intake",
          "Increasing exercise",
          "Eating a large meal"
        ],
        correctAnswer: 0
      }
    ]
  },
  {
    id: 24,
    week: 1,
    track: "SuccessStory",
    title: "Jess's 2-week back-to-run win",
    subtitle: "Real patient clip",
    assetPath: "/insight/jess-success.mp4",
    quizQ: "Jess cut her pain from 7/10 to 2/10 after 2 weeks. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "Jess cut her pain from 7/10 to 2/10 after 2 weeks. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What was the primary factor in Jess's successful pain reduction?",
        options: [
          "Medication",
          "Physical therapy",
          "Mindfulness",
          "Diet"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 25,
    week: 1,
    track: "PainScience",
    title: "Motion is Lotion",
    subtitle: "Gentle movement can quiet pain",
    assetPath: "/insight/motion-lotion.mp4",
    quizQ: "Gentle movement can help reduce pain sensitivity. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Gentle movement can help reduce pain sensitivity. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which of the following is NOT a recommended pain-reducing movement?",
        options: [
          "Stretching",
          "Yoga",
          "Heavy lifting",
          "Walking"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 28,
    week: 1,
    track: "SelfEfficacy",
    title: "Flare Up Plan",
    subtitle: "Build your personalized flare up plan to stay in control when symptoms spike.",
    assetPath: "FORM:flare-up-plan",
    quizQ: "What is one thing you can do to calm a flare?",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "What is one thing you can do to calm a flare?",
        options: [
          "Take a hot bath",
          "Watch TV",
          "Go for a walk",
          "Eat a large meal"
        ],
        correctAnswer: 2
      },
      {
        question: "Which of the following is NOT a recommended self-soothing technique?",
        options: [
          "Mindfulness meditation",
          "Distraction",
          "Self-criticism",
          "Deep breathing"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 29,
    week: 1,
    track: "Recap",
    title: "Weekly Insight Recap & reflection",
    subtitle: "Reflect on your week",
    assetPath: "/insight/recap-week1.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5,
    questions: [
      {
        question: "What was your biggest learning this week?",
        options: [
          "Mindfulness meditation",
          "Distraction",
          "Self-criticism",
          "Deep breathing"
        ],
        correctAnswer: 0
      },
      {
        question: "Which of the following is NOT a recommended self-soothing technique?",
        options: [
          "Mindfulness meditation",
          "Distraction",
          "Self-criticism",
          "Deep breathing"
        ],
        correctAnswer: 2
      }
    ]
  },
  
  // ========= WEEK 2 - UPDATED WITH REAL RESOURCES =========
  {
    id: 30,
    week: 2,
    track: "PainScience",
    title: "Understanding Your Pain",
    subtitle: "Pain neuroscience basics to reframe pain safely",
    assetPath: "https://www.youtube.com/watch?v=C_3phB93rvI", // Brainman explains pain
    quizQ: "Pain is always a sign of tissue damage. (T/F)",
    quizA: "F",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Pain is always a sign of tissue damage. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1
      },
      {
        question: "What is the primary role of pain?",
        options: [
          "To punish you for injury",
          "To protect you from perceived threats",
          "To limit all movement",
          "To indicate weakness"
        ],
        correctAnswer: 1
      },
      {
        question: "According to pain neuroscience, pain is an output of the:",
        options: [
          "Spinal cord only",
          "Brain",
          "Muscles",
          "Damaged tissues"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 31,
    week: 2,
    track: "StressMood",
    title: "The Science of Pain",
    subtitle: "How pain is produced and why it can change",
    assetPath: "https://www.youtube.com/watch?v=03U7tn6xkHo", // TEDx talk on pain science
    quizQ: "The brain can amplify or reduce pain signals based on context. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "The brain can amplify or reduce pain signals based on context. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which factor does NOT influence pain perception?",
        options: [
          "Stress levels",
          "Past experiences",
          "Your shoe size",
          "Current mood"
        ],
        correctAnswer: 2
      },
      {
        question: "Pain can persist even after tissues have healed because:",
        options: [
          "The brain is broken",
          "The nervous system remains sensitized",
          "You're imagining it",
          "You need more medication"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 32,
    week: 2,
    track: "Lifestyle",
    title: "Flare-Up Management",
    subtitle: "Practical strategies for managing pain spikes",
    assetPath: "https://www.youtube.com/watch?v=xOmPfKZpzqw", // Pain Toolkit - Managing Flare-Ups
    quizQ: "Flare-ups are a normal part of recovery. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Flare-ups are a normal part of recovery. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the best first response to a flare-up?",
        options: [
          "Panic and stop all activity",
          "Stay calm and use your flare-up plan",
          "Push through the pain",
          "Ignore it completely"
        ],
        correctAnswer: 1
      },
      {
        question: "A flare-up plan should include:",
        options: [
          "Only medication",
          "Complete bed rest",
          "Multiple self-management strategies",
          "Ignoring symptoms"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 33,
    week: 2,
    track: "SuccessStory",
    title: "Recovery Success Stories",
    subtitle: "Real patients who turned their pain around",
    assetPath: "/insight/success-stories.mp4",
    quizQ: "Success stories can increase your confidence in recovery. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "Success stories can increase your confidence in recovery. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is a key factor in most recovery success stories?",
        options: [
          "Expensive treatments",
          "Consistent effort and belief",
          "Avoiding all movement",
          "Quick fixes"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 34,
    week: 2,
    track: "PainScience",
    title: "Pacing Strategies",
    subtitle: "Finding the right balance between rest and activity",
    assetPath: "https://www.youtube.com/watch?v=pqD4vNJK8gI", // Greg Lehman - Pacing for Pain (evidence-based physio)
    quizQ: "Pacing means gradually increasing activity without overloading. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Pacing means gradually increasing activity without overloading. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the 'boom-bust cycle'?",
        options: [
          "Doing too much on good days, then crashing",
          "Explosive workout routines",
          "Sudden loud noises",
          "A healthy recovery pattern"
        ],
        correctAnswer: 0
      },
      {
        question: "The goal of pacing is to:",
        options: [
          "Do as little as possible",
          "Push through pain every day",
          "Maintain consistent activity levels",
          "Only move on pain-free days"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 35,
    week: 2,
    track: "SelfEfficacy",
    title: "Sleep & Recovery",
    subtitle: "How quality sleep accelerates healing",
    assetPath: "/insight/sleep-recovery-summary.json", // Summary card with link to NHS guide
    quizQ: "Quality sleep is essential for tissue repair. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Quality sleep is essential for tissue repair. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the ideal sleep duration for recovery?",
        options: [
          "4-5 hours",
          "6-7 hours",
          "7-9 hours",
          "10-12 hours"
        ],
        correctAnswer: 2
      },
      {
        question: "Poor sleep can:",
        options: [
          "Increase pain sensitivity",
          "Slow healing",
          "Both of the above",
          "Neither of the above"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 36,
    week: 2,
    track: "Recap",
    title: "Weekly reflection",
    subtitle: "Reflect on your week",
    assetPath: "/insight/recap-week2.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5,
    questions: [
      {
        question: "What was your biggest learning this week?",
        options: [
          "Understanding pain neuroscience",
          "Flare-up management",
          "Pacing strategies",
          "Sleep importance"
        ],
        correctAnswer: 0
      }
    ]
  },
  
  // ========= WEEK 3 - UPDATED WITH REAL RESOURCES =========
  {
    id: 37,
    week: 3,
    track: "PainScience",
    title: "Nutrition for Recovery",
    subtitle: "Anti-inflammatory foods that support healing",
    assetPath: "/insight/nutrition-summary.json", // Summary card with link to Harvard guide
    quizQ: "Anti-inflammatory foods can support tissue healing. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Anti-inflammatory foods can support tissue healing. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which food is known for anti-inflammatory properties?",
        options: [
          "Processed sugar",
          "Leafy greens",
          "Fried foods",
          "White bread"
        ],
        correctAnswer: 1
      },
      {
        question: "Foods that can increase inflammation include:",
        options: [
          "Berries and nuts",
          "Vegetables",
          "Processed foods and refined sugars",
          "Fatty fish"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 38,
    week: 3,
    track: "StressMood",
    title: "Posture & Pain",
    subtitle: "How posture affects pain perception",
    assetPath: "https://www.youtube.com/watch?v=yUSyMqDUwhY", // Greg Lehman - Sitting Posture Myths (evidence-based)
    quizQ: "Poor posture alone causes chronic pain. (T/F)",
    quizA: "F",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Poor posture alone causes chronic pain. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1
      },
      {
        question: "What is more important than 'perfect posture'?",
        options: [
          "Staying rigid",
          "Movement variability",
          "Never slouching",
          "Sitting perfectly straight"
        ],
        correctAnswer: 1
      },
      {
        question: "The best posture is:",
        options: [
          "The one you hold the longest",
          "The next posture",
          "Military-style rigid",
          "Completely relaxed"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 39,
    week: 3,
    track: "Lifestyle",
    title: "Return to Work Strategies",
    subtitle: "Managing pain while returning to daily activities",
    assetPath: "/insight/return-to-work-summary.json", // Summary card with link to clinical guide
    quizQ: "Gradual exposure to work tasks is safer than avoiding them. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Gradual exposure to work tasks is safer than avoiding them. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the best approach for returning to work?",
        options: [
          "All or nothing",
          "Gradual, paced return",
          "Wait until 100% pain-free",
          "Push through severe pain"
        ],
        correctAnswer: 1
      },
      {
        question: "Avoiding work due to pain can lead to:",
        options: [
          "Faster recovery",
          "Increased fear and disability",
          "Complete healing",
          "Stronger muscles"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 40,
    week: 3,
    track: "SuccessStory",
    title: "Patient Success: Chronic Pain Overcome",
    subtitle: "How John went from bedridden to active",
    assetPath: "/insight/john-success.mp4",
    quizQ: "Chronic pain recovery is possible with the right approach. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "Chronic pain recovery is possible with the right approach. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What was key to John's recovery?",
        options: [
          "Surgery",
          "Expensive medication",
          "Gradual movement and education",
          "Complete rest"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 41,
    week: 3,
    track: "PainScience",
    title: "CBT for Pain",
    subtitle: "Cognitive Behavioral Therapy basics",
    assetPath: "https://www.youtube.com/watch?v=2X4qCSbWAW4", // Mayo Clinic - CBT for Chronic Pain
    quizQ: "CBT can help change pain-related thoughts and behaviors. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "CBT can help change pain-related thoughts and behaviors. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What does CBT focus on?",
        options: [
          "Only physical symptoms",
          "Thoughts, emotions, and behaviors",
          "Medication only",
          "Ignoring pain"
        ],
        correctAnswer: 1
      },
      {
        question: "CBT for pain helps you:",
        options: [
          "Eliminate all pain immediately",
          "Ignore your pain",
          "Change how you think about and respond to pain",
          "Avoid all activities"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 42,
    week: 3,
    track: "SelfEfficacy",
    title: "ACT for Chronic Pain",
    subtitle: "Acceptance and Commitment Therapy principles",
    assetPath: "/insight/act-therapy-summary.json", // Summary card with link to ACT manual
    quizQ: "ACT teaches acceptance of pain while living a valued life. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "ACT teaches acceptance of pain while living a valued life. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is a core principle of ACT?",
        options: [
          "Fighting pain constantly",
          "Psychological flexibility",
          "Avoiding all discomfort",
          "Ignoring values"
        ],
        correctAnswer: 1
      },
      {
        question: "ACT encourages you to:",
        options: [
          "Control all thoughts and feelings",
          "Take action toward your values despite pain",
          "Wait until pain is gone to live",
          "Avoid anything difficult"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 43,
    week: 3,
    track: "Recap",
    title: "Weekly reflection",
    subtitle: "Reflect on your week",
    assetPath: "/insight/recap-week3.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5,
    questions: [
      {
        question: "What was your biggest learning this week?",
        options: [
          "Nutrition for recovery",
          "Posture myths",
          "CBT and ACT principles",
          "Return to work strategies"
        ],
        correctAnswer: 2
      }
    ]
  },
  
  // ========= WEEK 4 - UPDATED WITH REAL RESOURCES =========
  {
    id: 44,
    week: 4,
    track: "PainScience",
    title: "MBSR for Pain",
    subtitle: "Mindfulness-Based Stress Reduction techniques",
    assetPath: "https://www.youtube.com/watch?v=2n7FOBFMvXg", // Jon Kabat-Zinn - Mindfulness for Pain (founder of MBSR)
    quizQ: "Mindfulness can reduce pain intensity and distress. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Mindfulness can reduce pain intensity and distress. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is a key aspect of mindfulness practice?",
        options: [
          "Ignoring pain",
          "Non-judgmental awareness",
          "Distraction",
          "Avoidance"
        ],
        correctAnswer: 1
      },
      {
        question: "MBSR was developed by:",
        options: [
          "A pharmaceutical company",
          "Jon Kabat-Zinn",
          "A yoga instructor",
          "A physical therapist"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 45,
    week: 4,
    track: "StressMood",
    title: "Graded Motor Imagery",
    subtitle: "Using your mind to retrain movement",
    assetPath: "/insight/gmi-summary.json", // Summary card with link to NOI Group
    quizQ: "Mental imagery can help reduce pain and improve movement. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Mental imagery can help reduce pain and improve movement. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the first step in Graded Motor Imagery?",
        options: [
          "Mirror therapy",
          "Left/right discrimination",
          "Physical movement",
          "Surgery"
        ],
        correctAnswer: 1
      },
      {
        question: "GMI helps retrain your:",
        options: [
          "Muscles only",
          "Joints",
          "Brain's movement maps",
          "Bones"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 46,
    week: 4,
    track: "Lifestyle",
    title: "Movement Variability",
    subtitle: "Why changing positions matters",
    assetPath: "https://www.youtube.com/watch?v=jYRwyW2m1kU", // Physio explains movement variability
    quizQ: "Staying in one position for long periods increases stiffness. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Staying in one position for long periods increases stiffness. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the benefit of movement variability?",
        options: [
          "It confuses your body",
          "It prevents tissue adaptation to one position",
          "It causes more pain",
          "It's not beneficial"
        ],
        correctAnswer: 1
      },
      {
        question: "The best posture is:",
        options: [
          "Perfect alignment",
          "The next one",
          "Complete stillness",
          "Maximum slouching"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 47,
    week: 4,
    track: "SuccessStory",
    title: "Patient Success: From Surgery to Strength",
    subtitle: "Maria's post-op recovery story",
    assetPath: "/insight/maria-success.mp4",
    quizQ: "Post-surgical rehabilitation is key to full recovery. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "Post-surgical rehabilitation is key to full recovery. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What helped Maria recover fully?",
        options: [
          "Surgery alone",
          "Complete rest for months",
          "Progressive rehabilitation",
          "Avoiding all exercise"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 48,
    week: 4,
    track: "PainScience",
    title: "Pain and Emotions",
    subtitle: "The bidirectional relationship",
    assetPath: "/insight/pain-emotions-summary.json", // Summary card with link to MedlinePlus
    quizQ: "Emotions can influence pain perception. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Emotions can influence pain perception. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which emotion is most commonly linked to increased pain?",
        options: [
          "Joy",
          "Anxiety",
          "Curiosity",
          "Excitement"
        ],
        correctAnswer: 1
      },
      {
        question: "The relationship between pain and emotions is:",
        options: [
          "One-way (pain affects emotions)",
          "Non-existent",
          "Bidirectional (they affect each other)",
          "Random"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 49,
    week: 4,
    track: "SelfEfficacy",
    title: "Movement Quality vs. Quantity",
    subtitle: "Why how you move matters",
    assetPath: "/insight/movement-quality-summary.json", // Summary card replacement
    quizQ: "Quality movement is more important than sheer volume. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Quality movement is more important than sheer volume. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What defines movement quality?",
        options: [
          "Speed only",
          "How much it hurts",
          "Control, awareness, and intention",
          "Doing as many reps as possible"
        ],
        correctAnswer: 2
      },
      {
        question: "High-quality movement emphasizes:",
        options: [
          "Maximum weight",
          "Pain tolerance",
          "Proper form and control",
          "Speed and intensity"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 50,
    week: 4,
    track: "Recap",
    title: "Weekly reflection",
    subtitle: "Reflect on your week",
    assetPath: "/insight/recap-week4.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5,
    questions: [
      {
        question: "What was your biggest learning this week?",
        options: [
          "Mindfulness techniques",
          "Movement variability",
          "Pain-emotion connection",
          "Movement quality"
        ],
        correctAnswer: 3
      }
    ]
  },
  
  // WEEK 5 (Keep existing Week 5 content - mostly good)
  {
    id: 51,
    week: 5,
    track: "PainScience",
    title: "Neurotags 101",
    subtitle: "Networks that create pain",
    assetPath: "/insight/neurotags-101.mp4",
    quizQ: "Neurotags are networks in your brain that can create pain. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5
  },
  {
    id: 52,
    week: 5,
    track: "StressMood",
    title: "Gratitude & pain",
    subtitle: "Simple journal practice",
    assetPath: "/insight/gratitude-summary.json", // Summary card replacement
    quizQ: "Gratitude practice can help reduce pain sensitivity. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5
  },
  {
    id: 53,
    week: 5,
    track: "Lifestyle",
    title: "Caffeine & sleep",
    subtitle: "The 2 pm cutoff rule",
    assetPath: "/insight/caffeine-summary.json",
    quizQ: "You should stop caffeine by 2 pm for better sleep. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5
  },
  {
    id: 54,
    week: 5,
    track: "SuccessStory",
    title: "Nina's postpartum win",
    subtitle: "Core rehab journey",
    assetPath: "/insight/nina-postpartum.mp4",
    quizQ: "Nina's story shows the importance of postpartum core rehab. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 55,
    week: 5,
    track: "PainScience",
    title: "Reassure & re-load",
    subtitle: "Safe to move test",
    assetPath: "/insight/reassure-reload.mp4",
    quizQ: "The 'safe to move test' helps build confidence in movement. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5
  },
  {
    id: 56,
    week: 5,
    track: "SelfEfficacy",
    title: "Sleep wind-down checklist",
    subtitle: "CBT-I starter",
    assetPath: "/insight/sleep-winddown.json",
    quizQ: "What is one item on your sleep wind-down checklist?",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5
  },
  {
    id: 57,
    week: 5,
    track: "Recap",
    title: "Weekly reflection",
    subtitle: "Reflect on your week",
    assetPath: "/insight/recap-week5.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },
  
  // WEEK 6 - UPDATED WITH REAL RESOURCES
  {
    id: 58,
    week: 6,
    track: "PainScience",
    title: "Sticky thoughts vs. sticky tissues",
    subtitle: "Catastrophising",
    assetPath: "https://www.youtube.com/watch?v=vq6FPIudk94", // Pain catastrophizing explained (evidence-based)
    quizQ: "Catastrophising can make pain feel worse than tissue damage. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Catastrophising can make pain feel worse than tissue damage. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Pain catastrophizing involves:",
        options: [
          "Realistic thinking",
          "Magnifying pain threats",
          "Ignoring pain",
          "Accepting pain"
        ],
        correctAnswer: 1
      },
      {
        question: "To reduce catastrophizing, you should:",
        options: [
          "Focus only on worst-case scenarios",
          "Challenge unhelpful thoughts",
          "Avoid thinking about pain",
          "Blame yourself"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 59,
    week: 6,
    track: "StressMood",
    title: "Stress-breath connection",
    subtitle: "Box breathing basics",
    assetPath: "https://www.youtube.com/watch?v=9fEo9my03Ks", // Kitaro box breathing
    quizQ: "Box breathing can help reduce stress and pain. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Box breathing can help reduce stress and pain. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Box breathing involves equal counts for:",
        options: [
          "Inhale only",
          "Exhale only",
          "Inhale, hold, exhale, hold",
          "Random breathing"
        ],
        correctAnswer: 2
      },
      {
        question: "Box breathing activates the:",
        options: [
          "Sympathetic nervous system",
          "Parasympathetic nervous system",
          "Neither system",
          "Both equally"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 60,
    week: 6,
    track: "Lifestyle",
    title: "Hydration & fascia",
    subtitle: "Why water counts",
    assetPath: "/insight/hydration-fascia.json",
    quizQ: "Proper hydration helps maintain healthy fascia. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5
  },
  {
    id: 61,
    week: 6,
    track: "SuccessStory",
    title: "Future story slot",
    subtitle: "New patient success",
    assetPath: "/insight/future-story.mp4",
    quizQ: "Success stories can inspire and motivate recovery. (T/F)",
    quizA: "T",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 62,
    week: 6,
    track: "PainScience",
    title: "Protectometer",
    subtitle: "Finding safety cues",
    assetPath: "/insight/protectometer.json",
    quizQ: "The protectometer helps identify safety vs. danger signals. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5
  },
  {
    id: 63,
    week: 6,
    track: "SelfEfficacy",
    title: "Goal ladder mini-tool",
    subtitle: "Break big steps down",
    assetPath: "/insight/goal-ladder.json",
    quizQ: "What is one small step toward your recovery goal?",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5
  },
  {
    id: 64,
    week: 6,
    track: "DeepDive",
    title: "Monthly mini-course",
    subtitle: "5-min article + 5-Q quiz",
    assetPath: "/insight/monthly-deepdive.md",
    quizQ: "What was the main takeaway from this month's deep dive?",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  }
];

export const getInsightById = (id: number): Insight | undefined => {
  return insightLibrary.find(insight => insight.id === id);
};

export const getInsightsByTrack = (track: string): Insight[] => {
  return insightLibrary.filter(insight => insight.track === track);
};

export const getAllTracks = (): string[] => {
  return [...new Set(insightLibrary.map(insight => insight.track))];
};

