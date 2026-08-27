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
  // --- Week 1: Understand, notice, and participate ---
  {
    id: 21,
    week: 1,
    track: "PainScience",
    title: "What can influence pain?",
    subtitle: "How context, protection, and safety can change your experience",
    assetPath: "/insight/ps-danger.mp4",
    quizQ: "Which can help create a sense of safety during recovery?",
    quizA: "A manageable movement you feel confident doing",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Which can help create a sense of safety during recovery?",
        options: [
          "A movement you must complete despite severe symptoms",
          "A manageable movement you feel confident doing",
          "Any exercise that makes you sweat",
          "Avoiding every activity that feels uncertain"
        ],
        correctAnswer: 1
      },
      {
        question: "Which statement best describes pain?",
        options: [
          "Pain always measures the amount of tissue damage",
          "Pain is imaginary when scans are normal",
          "Pain is a real protective experience influenced by many factors",
          "Pain should always be ignored"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 22,
    week: 1,
    track: "StressMood",
    title: "Stress and recovery",
    subtitle: "Why stress deserves attention without becoming another threat",
    assetPath: "/insight/stress-recovery-summary.json",
    quizQ: "Stress can influence recovery, but it is only one part of the picture. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Stress can influence sleep, pain, mood, and recovery, but it is only one part of the picture. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which is the most useful response to a stressful recovery day?",
        options: [
          "Blame yourself for slowing your healing",
          "Stop all activity until stress disappears",
          "Choose one manageable action such as breathing, movement, rest, or support",
          "Assume stress is the only cause of your symptoms"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 23,
    week: 1,
    track: "Lifestyle",
    title: "Sleep and pain sensitivity",
    subtitle: "Professor Colin Espie's five principles of good sleep health",
    assetPath: "https://www.youtube.com/watch?v=OvQTjAlIvI8",
    quizQ: "Good sleep health should be personalized rather than built around one perfect routine. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Good sleep health should be personalized rather than built around one perfect routine. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which is one of Professor Espie's five principles of good sleep health?",
        options: [
          "Perfect your sleep every night",
          "Personalize your sleep",
          "Measure every stage of sleep",
          "Force yourself to sleep"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 24,
    week: 1,
    track: "SelfEfficacy",
    title: "Map your recovery signals",
    subtitle: "Notice what increases concern and what builds confidence",
    assetPath: "/insight/recovery-signals-week1.json",
    quizQ: "Complete your recovery signals map.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 25,
    week: 1,
    track: "PainScience",
    title: "Movement as a recovery tool",
    subtitle: "Find a manageable dose and build from there",
    assetPath: "/insight/motion-lotion-summary.json", // Summary card with movement science content
    quizQ: "A manageable amount of movement can support function and confidence for many people. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "A manageable amount of movement can support function and confidence for many people. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which is the best starting point for movement during recovery?",
        options: [
          "The same exercise and dose for every person",
          "A manageable activity matched to your current ability and plan",
          "Only movement that produces absolutely no sensation",
          "Maximum effort to test whether you are healed"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 28,
    week: 1,
    track: "SelfEfficacy",
    title: "Build your flare-up plan",
    subtitle: "Prepare flexible steps for a temporary increase in symptoms.",
    assetPath: "FORM:flare-up-plan",
    quizQ: "Complete your personalized flare-up plan.",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5
  },
  {
    id: 29,
    week: 1,
    track: "Recap",
    title: "Week 1 check-in",
    subtitle: "Connect this week's learning to your own recovery",
    assetPath: "/insight/week1-reflection.json",
    quizQ: "Complete your Week 1 check-in.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 2 - UPDATED WITH REAL RESOURCES =========
  {
    id: 30,
    week: 2,
    track: "PainScience",
    title: "Understanding Your Pain",
    subtitle: "Pain neuroscience basics to reframe pain safely",
    assetPath: "https://vimeo.com/245179549", // Understanding Pain in less than 5 minutes - Vimeo (reliable embedding)
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
        question: "Which statement best describes pain?",
        options: [
          "It is a punishment for injury",
          "It is a real protective experience influenced by many sources of information",
          "It always tells you to stop all movement",
          "It is a sign of personal weakness"
        ],
        correctAnswer: 1
      },
      {
        question: "Which information can contribute to a pain experience?",
        options: [
          "Tissue and nerve information only",
          "Stress and expectations only",
          "Biological, psychological, and social information in context",
          "Imaging results only"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 31,
    week: 2,
    track: "PainScience",
    title: "Why pain can vary",
    subtitle: "Why symptoms can change even when tissue condition has not",
    assetPath: "/insight/pain-variability-summary.json",
    quizQ: "Changes in pain can be influenced by more than changes in tissue condition alone. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Changes in pain can be influenced by more than changes in tissue condition alone. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which can influence a person's pain experience?",
        options: [
          "Health and tissue information",
          "Sleep, stress, and past experience",
          "Context and expectations",
          "All of the above"
        ],
        correctAnswer: 3
      },
      {
        question: "Which is the most accurate response to persistent pain?",
        options: [
          "It proves the person is imagining symptoms",
          "It can involve ongoing biological and psychosocial influences that deserve assessment and individualized care",
          "It always means new tissue damage",
          "It has one cause in every person"
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
    assetPath: "/insight/flare-up-management-summary.json",
    quizQ: "A flare-up can happen without erasing all of your recovery progress. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "A flare-up can happen without erasing all of your recovery progress. (True/False)",
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
    track: "SelfEfficacy",
    title: "Recovery is rarely linear",
    subtitle: "Measure the direction of recovery, not one difficult day",
    assetPath: "/insight/recovery-not-linear-summary.json",
    quizQ: "A difficult day means that all previous recovery progress has been lost. (T/F)",
    quizA: "F",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "A difficult day means that all previous recovery progress has been lost. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1
      },
      {
        question: "Which is a more useful way to judge recovery?",
        options: [
          "Judge it from the hardest hour of the week",
          "Track trends in function, confidence, symptoms, and participation over time",
          "Expect symptoms to improve in a perfectly straight line",
          "Ignore every increase in symptoms"
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
    assetPath: "/insight/pacing-strategies-summary.json", // Summary card with link to NHS pacing guide
    quizQ: "Pacing helps you plan a manageable amount of activity and recovery rather than repeatedly overdoing it. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Pacing helps you plan a manageable amount of activity and recovery rather than repeatedly overdoing it. (True/False)",
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
    subtitle: "How sleep can influence symptoms, energy, and participation",
    assetPath: "/insight/sleep-recovery-summary.json", // Summary card with link to NHS guide
    quizQ: "Sleep and pain can influence one another. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Sleep and pain can influence one another. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which statement about sleep duration is most accurate?",
        options: [
          "Everyone needs exactly eight hours",
          "Individual needs vary; many adults are advised to get at least seven hours regularly",
          "More sleep is always better",
          "Sleep duration never matters"
        ],
        correctAnswer: 1
      },
      {
        question: "A difficult period of sleep may affect:",
        options: [
          "Pain sensitivity, energy, and mood",
          "Only bone strength",
          "Everyone in exactly the same way",
          "Nothing related to recovery"
        ],
        correctAnswer: 0
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
    subtitle: "Balanced eating to support health, energy, and participation",
    assetPath: "/insight/nutrition-summary.json", // Summary card with link to Harvard guide
    quizQ: "No single food is a treatment for pain. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "No single food is a treatment for pain. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which is the most useful general approach?",
        options: [
          "Eliminate entire food groups without advice",
          "Build a varied, sustainable eating pattern that fits your needs",
          "Treat one food as medicine for pain",
          "Judge foods only as good or bad"
        ],
        correctAnswer: 1
      },
      {
        question: "When should nutrition advice be individualized by a qualified professional?",
        options: [
          "Never",
          "Only for athletes",
          "When health conditions, allergies, access, or eating concerns affect the plan",
          "Only after pain is gone"
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
    subtitle: "There is no single perfect posture",
    assetPath: "/insight/posture-pain-summary.json",
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
        question: "Which is a reasonable alternative to chasing one 'perfect posture'?",
        options: [
          "Staying rigid",
          "Movement variability",
          "Never slouching",
          "Sitting perfectly straight"
        ],
        correctAnswer: 1
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "One posture prevents pain for everyone",
          "Comfortable posture and position changes can both be options",
          "Rigid posture is always safest",
          "Slouching always causes injury"
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
    quizQ: "A return-to-work plan should consider the person, job demands, symptoms, risk, and available support. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "A return-to-work plan should consider the person, job demands, symptoms, risk, and available support. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Which is often useful when it fits the person's situation?",
        options: [
          "All or nothing",
          "An individualized plan with appropriate modifications and review",
          "Wait until 100% pain-free",
          "Push through severe pain"
        ],
        correctAnswer: 1
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "Everyone should return immediately",
          "Everyone must be pain-free first",
          "Work participation can be helpful, but safety and readiness are individualized",
          "Symptoms should always be ignored"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 40,
    week: 3,
    track: "SelfEfficacy",
    title: "Find your recovery evidence",
    subtitle: "Notice small signs of capacity, confidence, and participation",
    assetPath: "/insight/recovery-evidence-week3.json",
    quizQ: "Complete your recovery evidence check-in.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 41,
    week: 3,
    track: "PainScience",
    title: "CBT skills for persistent pain",
    subtitle: "How thoughts, actions, emotions, and symptoms can interact",
    assetPath: "/insight/cbt-pain-summary.json",
    quizQ: "CBT for pain aims to improve coping and participation; it does not mean pain is imaginary. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "CBT for pain aims to improve coping and participation; it does not mean pain is imaginary. (True/False)",
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
          "Develop skills for responding to pain and supporting valued activity",
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
    title: "Mindfulness attitudes",
    subtitle: "An introduction to non-judgmental awareness",
    assetPath: "https://www.youtube.com/watch?v=2n7FOBFMvXg", // Jon Kabat-Zinn discusses nine mindfulness attitudes
    quizQ: "Mindfulness may help some people relate differently to symptoms or distress, but results vary. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Mindfulness may help some people relate differently to symptoms or distress, but results vary. (True/False)",
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
        question: "Which is a useful way to approach a mindfulness exercise?",
        options: [
          "Force symptoms to disappear",
          "Notice the present experience without grading yourself",
          "Use it to prove pain is psychological",
          "Continue even if it feels unsafe or distressing"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 45,
    week: 4,
    track: "SelfEfficacy",
    title: "Building confidence with movement",
    subtitle: "Use manageable practice to expand what feels possible",
    assetPath: "/insight/movement-confidence-summary.json",
    quizQ: "A graded approach starts with a manageable challenge and adjusts using your response. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "A graded approach starts with a manageable challenge and adjusts using your response. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "What is the purpose of graded movement practice?",
        options: [
          "Prove that symptoms are imaginary",
          "Build capacity and confidence through manageable practice",
          "Avoid the activity permanently",
          "Reach maximum effort immediately"
        ],
        correctAnswer: 1
      },
      {
        question: "What should guide the next step?",
        options: [
          "A fixed increase regardless of response",
          "Your goals, current ability, response, and clinical plan",
          "Whether another patient progressed faster",
          "The belief that pain must always be ignored"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 46,
    week: 4,
    track: "Lifestyle",
    title: "Movement Variability",
    subtitle: "Why changing positions matters",
    assetPath: "/insight/movement-variability-summary.json", // Summary card with link to Physiopedia guide
    quizQ: "Changing position can be a comfort option, but there is no single perfect posture schedule. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Changing position can be a comfort option, but there is no single perfect posture schedule. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0
      },
      {
        question: "Why might someone choose movement variability?",
        options: [
          "It confuses your body",
          "A position change may improve comfort or help vary task demands",
          "It causes more pain",
          "It guarantees pain relief"
        ],
        correctAnswer: 1
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "Perfect alignment is required",
          "There are many acceptable positions and movement options",
          "Complete stillness is always safest",
          "Maximum slouching is required"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 47,
    week: 4,
    track: "SelfEfficacy",
    title: "Plan a graded return",
    subtitle: "Break one meaningful activity into manageable steps",
    assetPath: "/insight/graded-return-plan.json",
    quizQ: "Complete your graded return plan.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
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
    title: "Finding the right movement dose",
    subtitle: "Balance control, capacity, confidence, and your goals",
    assetPath: "/insight/movement-quality-summary.json", // Summary card replacement
    quizQ: "Movement choices should consider both how an activity is performed and whether the dose fits the person. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Movement choices should consider both how an activity is performed and whether the dose fits the person. (True/False)",
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
    title: "Pain and learned associations",
    subtitle: "How context, memory, and experience can influence protection",
    assetPath: "/insight/neurotags-summary.json", // Summary card with link to NOI Group guide
    quizQ: "Pain is influenced by many factors, including context and past experience. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5
  },
  {
    id: 52,
    week: 5,
    track: "StressMood",
    title: "A brief gratitude practice",
    subtitle: "Notice something meaningful without dismissing what is difficult",
    assetPath: "/insight/gratitude-summary.json", // Summary card replacement
    quizQ: "Gratitude can coexist with pain and difficult emotions. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5
  },
  {
    id: 53,
    week: 5,
    track: "Lifestyle",
    title: "Caffeine and your sleep",
    subtitle: "Test a cutoff that fits your sensitivity and schedule",
    assetPath: "/insight/caffeine-summary.json",
    quizQ: "Caffeine timing affects everyone in exactly the same way. (T/F)",
    quizA: "F",
    releaseOffset: 2,
    points: 5
  },
  {
    id: 54,
    week: 5,
    track: "SelfEfficacy",
    title: "Build your support team",
    subtitle: "Make it easier to ask for the kind of help you need",
    assetPath: "/insight/support-team-plan.json",
    quizQ: "Complete your support team plan.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 55,
    week: 5,
    track: "PainScience",
    title: "Making sense of pain and movement",
    subtitle: "Build confidence with an individualized, gradual approach",
    assetPath: "https://www.tamethebeast.org/",
    quizQ: "Pain does not provide a precise measure of tissue damage, but new or concerning symptoms still deserve assessment. (T/F)",
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
    assetPath: "https://www.youtube.com/watch?v=OhNm7ZSiZls", // Russ Harris - Cognitive Defusion for Pain Management
    quizQ: "Threat-focused thoughts can influence distress and behaviour without making pain imaginary. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Threat-focused thoughts can influence distress and behaviour without making pain imaginary. (True/False)",
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
    assetPath: "https://www.youtube.com/watch?v=HhUoQ6gx6kE", // Kitaro Waga - How breathing affects the nervous system (science-based)
    quizQ: "A paced-breathing exercise may feel calming for some people, but it is optional and effects vary. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "A paced-breathing exercise may feel calming for some people, but it is optional and effects vary. (True/False)",
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
        question: "What should you do if paced breathing makes you dizzy or uncomfortable?",
        options: [
          "Force a deeper breath",
          "Hold your breath longer",
          "Stop or return to comfortable breathing",
          "Assume it proves something is wrong"
        ],
        correctAnswer: 2
      }
    ]
  },
  {
    id: 60,
    week: 6,
    track: "Lifestyle",
    title: "Hydration and recovery habits",
    subtitle: "Use thirst, routine, activity, and conditions as practical guides",
    assetPath: "/insight/hydration-fascia.json",
    quizQ: "Hydration needs can change with activity, heat, health, and individual circumstances. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5
  },
  {
    id: 61,
    week: 6,
    track: "SelfEfficacy",
    title: "Prepare for setbacks",
    subtitle: "Decide what you will do when symptoms temporarily increase",
    assetPath: "/insight/setback-plan.json",
    quizQ: "Complete your setback plan.",
    quizA: "(user input)",
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
    title: "Putting the Framework together",
    subtitle: "Connect the recovery tools that matter most to you",
    assetPath: "/insight/framework-integration-week6.json",
    quizQ: "Complete your Framework integration plan.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // --- Week 7: Consolidate, personalize, and continue ---
  {
    id: 65,
    week: 7,
    track: "PainScience",
    title: "Self-management is a skill",
    subtitle: "Build confidence through practice, problem-solving, and partnership",
    assetPath: "https://www.iasp-pain.org/resources/fact-sheets/promoting-chronic-pain-self-management-education/",
    quizQ: "Self-management means managing recovery entirely without professional support. (T/F)",
    quizA: "F",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Self-management means managing recovery entirely without professional support. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1
      },
      {
        question: "Which is a core self-management skill?",
        options: [
          "Waiting for someone else to make every decision",
          "Problem-solving and choosing manageable actions",
          "Ignoring changes in symptoms",
          "Following the same plan regardless of context"
        ],
        correctAnswer: 1
      }
    ]
  },
  {
    id: 66,
    week: 7,
    track: "SelfEfficacy",
    title: "Prepare for a shared decision",
    subtitle: "Bring your priorities, questions, and preferences into the conversation",
    assetPath: "/insight/shared-decision-plan.json",
    quizQ: "Complete your shared decision plan.",
    quizA: "(user input)",
    releaseOffset: 1,
    points: 5
  },
  {
    id: 67,
    week: 7,
    track: "SelfEfficacy",
    title: "Review your recovery evidence",
    subtitle: "Compare what matters now with where you started",
    assetPath: "/insight/progress-review-week7.json",
    quizQ: "Complete your progress review.",
    quizA: "(user input)",
    releaseOffset: 2,
    points: 5
  },
  {
    id: 68,
    week: 7,
    track: "SelfEfficacy",
    title: "Build your personal toolkit",
    subtitle: "Choose the strategies that fit different situations",
    assetPath: "/insight/recovery-toolkit-plan.json",
    quizQ: "Complete your personal recovery toolkit.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 69,
    week: 7,
    track: "SelfEfficacy",
    title: "Choose your next meaningful goal",
    subtitle: "Connect one realistic step to an activity that matters to you",
    assetPath: "/insight/next-goal-plan.json",
    quizQ: "Complete your next-goal plan.",
    quizA: "(user input)",
    releaseOffset: 4,
    points: 5
  },
  {
    id: 70,
    week: 7,
    track: "Lifestyle",
    title: "Create your maintenance plan",
    subtitle: "Decide what to continue, monitor, and adjust",
    assetPath: "/insight/maintenance-plan.json",
    quizQ: "Complete your maintenance plan.",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5
  },
  {
    id: 71,
    week: 7,
    track: "Recap",
    title: "Your seven-week review",
    subtitle: "Recognize what changed and decide what comes next",
    assetPath: "/insight/week7-reflection.json",
    quizQ: "Complete your seven-week review.",
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
