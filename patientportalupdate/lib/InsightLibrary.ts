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
  explanation?: string; // Brief feedback shown after the patient answers
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
    title: "The foundations of recovery",
    subtitle: "Sleep, food, and hydration support the work your body is doing",
    assetPath: "/insight/recovery-foundations-week1.json",
    quizQ: "Recovery foundations need to be perfect before you can improve. (T/F)",
    quizA: "F",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Sleep, nutrition, and hydration need to be perfect before recovery can continue. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "These foundations support health, energy, adaptation, and participation, but perfection is neither realistic nor required. Look for the most useful next improvement."
      },
      {
        question: "A patient is sleeping poorly and regularly missing meals during a stressful week. What is the most useful first response?",
        options: [
          "Assume these habits are the sole cause of the injury",
          "Stop movement until every habit is corrected",
          "Choose one realistic sleep or meal anchor while continuing the recovery plan",
          "Attempt to overhaul the entire routine immediately"
        ],
        correctAnswer: 2,
        explanation: "Recovery behaviours work best as support, not as another source of blame or an all-or-nothing project. A realistic anchor is more likely to be repeated."
      }
    ]
  },
  {
    id: 24,
    week: 1,
    track: "SelfEfficacy",
    title: "Notice the thought–action loop",
    subtitle: "How the meaning you give symptoms can influence what happens next",
    assetPath: "/insight/recovery-signals-week1.json",
    quizQ: "Complete your thought–action map.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 25,
    week: 1,
    track: "PainScience",
    title: "Treatment creates an opportunity. Movement builds on it.",
    subtitle: "Use improved comfort to rebuild function, confidence, and capacity",
    assetPath: "/insight/motion-lotion-summary.json", // Summary card with movement science content
    quizQ: "What helps turn improved comfort after treatment into longer-term progress?",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "What helps turn improved comfort after treatment into longer-term progress?",
        options: [
          "Avoiding movement so the change is protected",
          "Using the opportunity to move and gradually rebuild function",
          "Waiting until every sensation has disappeared",
          "Receiving the same treatment indefinitely"
        ],
        correctAnswer: 1,
        explanation: "Hands-on care can reduce pain and make movement easier. Movement and activity then help rebuild strength, tolerance, confidence, and function."
      },
      {
        question: "Which is the clearest default message about movement for most MSK patients?",
        options: [
          "Keep moving, start with what you can do, and build from there",
          "Only perform movements selected by a practitioner",
          "Do not move an area until it is completely pain-free",
          "Use maximum effort to test whether the area has healed"
        ],
        correctAnswer: 0,
        explanation: "You do not need the perfect exercise to begin. Specific restrictions or a more precise plan are added when the condition, goals, or response require them."
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

  // ========= WEEK 2 - APPLY THE RECOVERY MODEL =========
  {
    id: 30,
    week: 2,
    track: "PainScience",
    title: "Understanding pain",
    subtitle: "Retrieve the core model and apply it to a real symptom experience",
    assetPath: "https://vimeo.com/245179549", // Understanding Pain in less than 5 minutes - Vimeo (reliable embedding)
    quizQ: "Pain is always a sign of tissue damage. (T/F)",
    quizA: "F",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Pain is always a sign of tissue damage. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Pain can accompany tissue injury, but its intensity is not a precise damage meter. New, severe, or concerning symptoms still deserve appropriate assessment."
      },
      {
        question: "Which statement best describes pain?",
        options: [
          "It is a punishment for injury",
          "It is a real protective experience influenced by many sources of information",
          "It always tells you to stop all movement",
          "It is a sign of personal weakness"
        ],
        correctAnswer: 1,
        explanation: "Pain is real. The nervous system considers many sources of information when producing a protective experience."
      },
      {
        question: "Which information can contribute to a pain experience?",
        options: [
          "Tissue and nerve information only",
          "Stress and expectations only",
          "Biological, psychological, and social information in context",
          "Imaging results only"
        ],
        correctAnswer: 2,
        explanation: "Biological, psychological, and social factors can interact. This does not make pain imaginary or reduce it to one cause."
      }
    ]
  },
  {
    id: 31,
    week: 2,
    track: "PainScience",
    title: "Why pain can vary",
    subtitle: "Use context and patterns to make sense of changing symptoms",
    assetPath: "/insight/pain-variability-summary.json",
    quizQ: "Changes in pain can be influenced by more than changes in tissue condition alone. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Changes in pain can be influenced by more than changes in tissue condition alone. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Symptoms can vary with activity, sensitivity, sleep, stress, context, expectations, health, and tissue information."
      },
      {
        question: "Which can influence a person's pain experience?",
        options: [
          "Health and tissue information",
          "Sleep, stress, and past experience",
          "Context and expectations",
          "All of the above"
        ],
        correctAnswer: 3,
        explanation: "Looking at the whole context can reveal useful patterns without assuming that one factor explains everything."
      },
      {
        question: "Which is the most accurate response to persistent pain?",
        options: [
          "It proves the person is imagining symptoms",
          "It can involve ongoing biological and psychosocial influences that deserve assessment and individualized care",
          "It always means new tissue damage",
          "It has one cause in every person"
        ],
        correctAnswer: 1,
        explanation: "Persistent pain is real and can involve interacting biological and psychosocial influences. Assessment and care should remain individualized."
      }
    ]
  },
  {
    id: 32,
    week: 2,
    track: "Lifestyle",
    title: "Use your flare-up plan",
    subtitle: "Practise responding to a temporary symptom increase without panic or avoidance",
    assetPath: "/insight/flare-up-management-summary.json",
    quizQ: "A flare-up can happen without erasing all of your recovery progress. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "A flare-up can happen without erasing all of your recovery progress. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "A flare-up is information, not automatic proof that all progress has been lost. Check for anything new or concerning, then use the plan that fits the situation."
      },
      {
        question: "A familiar symptom increases after a busier day, with no new concerning features. What is the most useful first response?",
        options: [
          "Panic and stop all activity",
          "Stay calm, review the context, and use your flare-up plan",
          "Push through the pain",
          "Ignore it completely"
        ],
        correctAnswer: 1,
        explanation: "A planned response may include temporarily adjusting the dose, using helpful strategies, continuing manageable activity, and monitoring the response."
      },
      {
        question: "Which plan is least likely to turn a flare-up into prolonged avoidance?",
        options: [
          "Stop every meaningful activity until all symptoms disappear",
          "Use a flexible plan with manageable movement, recovery strategies, and clear reasons to seek help",
          "Test the area repeatedly at maximum effort",
          "Ignore new or concerning symptoms"
        ],
        correctAnswer: 1,
        explanation: "A useful flare-up plan supports safe participation and includes escalation guidance. It is neither complete avoidance nor blind persistence."
      }
    ]
  },
  {
    id: 33,
    week: 2,
    track: "SelfEfficacy",
    title: "Recovery is rarely linear",
    subtitle: "Measure the direction of recovery rather than one difficult hour",
    assetPath: "/insight/recovery-not-linear-summary.json",
    quizQ: "A difficult day means that all previous recovery progress has been lost. (T/F)",
    quizA: "F",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "A difficult day means that all previous recovery progress has been lost. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "A difficult day may be part of recovery. Compare broader trends and look for context before deciding what it means."
      },
      {
        question: "Which is a more useful way to judge recovery?",
        options: [
          "Judge it from the hardest hour of the week",
          "Track trends in function, confidence, symptoms, and participation over time",
          "Expect symptoms to improve in a perfectly straight line",
          "Ignore every increase in symptoms"
        ],
        correctAnswer: 1,
        explanation: "Function, confidence, participation, capacity, and symptoms can each provide useful—but incomplete—information about progress."
      }
    ]
  },
  {
    id: 34,
    week: 2,
    track: "PainScience",
    title: "Pacing without avoidance",
    subtitle: "Build consistency while continuing to expand what you can do",
    assetPath: "/insight/pacing-strategies-summary.json", // Summary card with link to NHS pacing guide
    quizQ: "Pacing helps you plan a manageable amount of activity and recovery rather than repeatedly overdoing it. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Pacing helps you plan a manageable amount of activity and recovery rather than repeatedly overdoing it. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Pacing can reduce repeated overdoing and crashing. The longer-term goal is not permanent restriction; it is sustainable progression."
      },
      {
        question: "Which example best describes a boom–bust cycle?",
        options: [
          "Doing too much on good days, then crashing",
          "Explosive workout routines",
          "Sudden loud noises",
          "A healthy recovery pattern"
        ],
        correctAnswer: 0,
        explanation: "Doing far more on a good day and then needing prolonged recovery can make activity less predictable and harder to progress."
      },
      {
        question: "A patient has found a manageable walking amount. What is the next purpose of pacing?",
        options: [
          "Keep that amount unchanged forever",
          "Gradually build capacity when the response supports it",
          "Avoid walking on any symptomatic day",
          "Double the amount immediately"
        ],
        correctAnswer: 1,
        explanation: "Pacing is a platform for progress. Once an activity is manageable, the dose can be adjusted gradually using the person's response and goals."
      }
    ]
  },
  {
    id: 35,
    week: 2,
    track: "SelfEfficacy",
    title: "Run a sleep-support experiment",
    subtitle: "Choose one realistic change and observe what it affects",
    assetPath: "/insight/sleep-recovery-summary.json", // Summary card with link to NHS guide
    quizQ: "Sleep and pain can influence one another. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Sleep and pain can influence one another. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "The relationship can run both ways: symptoms may disrupt sleep, and difficult sleep may affect sensitivity, energy, mood, and coping."
      },
      {
        question: "Which statement about sleep duration is most accurate?",
        options: [
          "Everyone needs exactly eight hours",
          "Individual needs vary; many adults are advised to get at least seven hours regularly",
          "More sleep is always better",
          "Sleep duration never matters"
        ],
        correctAnswer: 1,
        explanation: "Sleep needs vary. General guidance is a starting point, not a pass–fail target or a reason to blame someone for symptoms."
      },
      {
        question: "Which is the most useful first sleep experiment?",
        options: [
          "Change every part of the routine tonight",
          "Choose one repeatable anchor, such as a consistent wake time, and observe the pattern",
          "Stay in bed longer whenever sleep is difficult",
          "Treat one poor night as failed recovery"
        ],
        correctAnswer: 1,
        explanation: "A small, repeatable experiment provides more useful information than an all-or-nothing overhaul. Persistent sleep problems may warrant individualized support."
      }
    ]
  },
  {
    id: 36,
    week: 2,
    track: "Recap",
    title: "Week 2 application check-in",
    subtitle: "Explain the model in your own words and choose what to test next",
    assetPath: "/insight/week2-application.json",
    quizQ: "Complete your Week 2 application check-in.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 3 - BUILD CAPACITY IN DAILY LIFE =========
  {
    id: 37,
    week: 3,
    track: "PainScience",
    title: "Fuel recovery without chasing a perfect diet",
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
        correctAnswer: 0,
        explanation: "Food supports overall health, energy, and participation. Claims that one food treats MSK pain usually oversimplify the evidence."
      },
      {
        question: "Which is the most useful general approach?",
        options: [
          "Eliminate entire food groups without advice",
          "Build a varied, sustainable eating pattern that fits your needs",
          "Treat one food as medicine for pain",
          "Judge foods only as good or bad"
        ],
        correctAnswer: 1,
        explanation: "A sustainable pattern that fits the person is more useful than rigid food rules or moral labels."
      },
      {
        question: "When should nutrition advice be individualized by a qualified professional?",
        options: [
          "Never",
          "Only for athletes",
          "When health conditions, allergies, access, or eating concerns affect the plan",
          "Only after pain is gone"
        ],
        correctAnswer: 2,
        explanation: "Health conditions, allergies, food access, cultural needs, and eating concerns can all change what appropriate advice looks like."
      }
    ]
  },
  {
    id: 38,
    week: 3,
    track: "StressMood",
    title: "Posture is an option, not a verdict",
    subtitle: "Use comfort, variety, and task demands instead of chasing one perfect position",
    assetPath: "/insight/posture-pain-summary.json",
    quizQ: "Poor posture alone causes chronic pain. (T/F)",
    quizA: "F",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Poor posture alone causes chronic pain. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Posture can affect comfort for some people, but no single posture explains chronic pain or protects everyone from injury."
      },
      {
        question: "Your back feels uncomfortable after a long period at a desk. What is a useful response?",
        options: [
          "Hold a rigid upright posture for the rest of the day",
          "Change position, move briefly, and adjust the task as needed",
          "Assume the posture damaged your spine",
          "Avoid sitting permanently"
        ],
        correctAnswer: 1,
        explanation: "The posture you are in may matter less than how long you stay there, the task demands, and your individual response."
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "One posture prevents pain for everyone",
          "Comfortable posture and position changes can both be options",
          "Rigid posture is always safest",
          "Slouching always causes injury"
        ],
        correctAnswer: 1,
        explanation: "Comfortable positions and regular variation are options—not strict rules that must be followed perfectly."
      }
    ]
  },
  {
    id: 39,
    week: 3,
    track: "Lifestyle",
    title: "Return to work and meaningful activity",
    subtitle: "Match the starting point to the demands, then build participation",
    assetPath: "/insight/return-to-work-summary.json", // Summary card with link to clinical guide
    quizQ: "A return-to-work plan should consider the person, job demands, symptoms, risk, and available support. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "A return-to-work plan should consider the person, job demands, symptoms, risk, and available support. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Return planning should consider the person, actual task demands, safety, symptoms, confidence, support, and opportunities for modification."
      },
      {
        question: "Which is often useful when it fits the person's situation?",
        options: [
          "All or nothing",
          "An individualized plan with appropriate modifications and review",
          "Wait until 100% pain-free",
          "Push through severe pain"
        ],
        correctAnswer: 1,
        explanation: "Appropriate modification can support participation while capacity is rebuilt. The plan should be reviewed rather than treated as permanent."
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "Everyone should return immediately",
          "Everyone must be pain-free first",
          "Work participation can be helpful, but safety and readiness are individualized",
          "Symptoms should always be ignored"
        ],
        correctAnswer: 2,
        explanation: "Neither immediate unrestricted return nor waiting for perfect comfort fits everyone. The plan should match safety and readiness."
      }
    ]
  },
  {
    id: 40,
    week: 3,
    track: "SelfEfficacy",
    title: "Find evidence that capacity is changing",
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
    title: "Test a difficult recovery prediction",
    subtitle: "Use a practical CBT skill to move from an automatic thought to a useful action",
    assetPath: "/insight/cbt-pain-summary.json",
    quizQ: "CBT for pain aims to improve coping and participation; it does not mean pain is imaginary. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "CBT for pain aims to improve coping and participation; it does not mean pain is imaginary. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "CBT skills address real thoughts, emotions, body responses, and actions. They do not claim that pain is imaginary."
      },
      {
        question: "You notice the thought, 'If I move today, I will make everything worse.' What is the most useful next step?",
        options: [
          "Treat the prediction as proven fact",
          "Choose a safe, manageable movement test and observe what actually happens",
          "Ignore every symptom and use maximum effort",
          "Stop meaningful activity indefinitely"
        ],
        correctAnswer: 1,
        explanation: "A behavioural experiment tests a prediction with an appropriate action. The goal is useful evidence—not proving that symptoms do not exist."
      },
      {
        question: "CBT for pain helps you:",
        options: [
          "Eliminate all pain immediately",
          "Ignore your pain",
          "Develop skills for responding to pain and supporting valued activity",
          "Avoid all activities"
        ],
        correctAnswer: 2,
        explanation: "The aim is greater flexibility, coping, and participation—not instant symptom elimination."
      }
    ]
  },
  {
    id: 42,
    week: 3,
    track: "SelfEfficacy",
    title: "Act on what matters",
    subtitle: "Choose one values-guided action without waiting for a perfect symptom day",
    assetPath: "/insight/act-therapy-summary.json", // Summary card with link to ACT manual
    quizQ: "ACT teaches acceptance of pain while living a valued life. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "ACT teaches acceptance of pain while living a valued life. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Acceptance means making room for the present experience while still choosing useful action. It is not resignation or withdrawal of appropriate care."
      },
      {
        question: "What is a core principle of ACT?",
        options: [
          "Fighting pain constantly",
          "Psychological flexibility",
          "Avoiding all discomfort",
          "Ignoring values"
        ],
        correctAnswer: 1,
        explanation: "Psychological flexibility means responding to the situation in a way that serves what matters, rather than automatically obeying every thought or feeling."
      },
      {
        question: "ACT encourages you to:",
        options: [
          "Control all thoughts and feelings",
          "Take action toward your values despite pain",
          "Wait until pain is gone to live",
          "Avoid anything difficult"
        ],
        correctAnswer: 1,
        explanation: "Values can guide a small, adaptable action today. The action can be modified to current capacity."
      }
    ]
  },
  {
    id: 43,
    week: 3,
    track: "Recap",
    title: "Week 3 capacity check-in",
    subtitle: "Connect daily choices, thoughts, and meaningful activity to your recovery",
    assetPath: "/insight/week3-capacity.json",
    quizQ: "Complete your Week 3 capacity check-in.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 4 - PRACTISE REGULATION AND GRADED CAPACITY =========
  {
    id: 44,
    week: 4,
    track: "PainScience",
    title: "Practise noticing without immediately reacting",
    subtitle: "Try mindfulness as an optional attention skill—not a test or a cure",
    assetPath: "https://www.youtube.com/watch?v=2n7FOBFMvXg", // Jon Kabat-Zinn discusses nine mindfulness attitudes
    quizQ: "Mindfulness may help some people relate differently to symptoms or distress, but results vary. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Mindfulness may help some people relate differently to symptoms or distress, but results vary. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Mindfulness is one optional way to practise attention and reduce automatic reactions. It is not a guaranteed pain treatment."
      },
      {
        question: "What is a key aspect of mindfulness practice?",
        options: [
          "Ignoring pain",
          "Non-judgmental awareness",
          "Distraction",
          "Avoidance"
        ],
        correctAnswer: 1,
        explanation: "The aim is to notice what is present with less automatic judgment—not to deny or ignore symptoms."
      },
      {
        question: "Which is a useful way to approach a mindfulness exercise?",
        options: [
          "Force symptoms to disappear",
          "Notice the present experience without grading yourself",
          "Use it to prove pain is psychological",
          "Continue even if it feels unsafe or distressing"
        ],
        correctAnswer: 1,
        explanation: "Mindfulness should not be forced. A person can stop, modify the practice, or choose another skill if it feels unhelpful or distressing."
      }
    ]
  },
  {
    id: 45,
    week: 4,
    track: "SelfEfficacy",
    title: "Build confidence through practice",
    subtitle: "Start with a meaningful, manageable challenge and expand from there",
    assetPath: "/insight/movement-confidence-summary.json",
    quizQ: "A graded approach starts with a manageable challenge and adjusts using your response. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "A graded approach starts with a manageable challenge and adjusts using your response. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Graded practice begins at an achievable level and changes using goals, response, safety, and current capacity."
      },
      {
        question: "What is the purpose of graded movement practice?",
        options: [
          "Prove that symptoms are imaginary",
          "Build capacity and confidence through manageable practice",
          "Avoid the activity permanently",
          "Reach maximum effort immediately"
        ],
        correctAnswer: 1,
        explanation: "The purpose is to build function, tolerance, and confidence—not to prove symptoms are imaginary."
      },
      {
        question: "What should guide the next step?",
        options: [
          "A fixed increase regardless of response",
          "Your goals, current ability, response, and clinical plan",
          "Whether another patient progressed faster",
          "The belief that pain must always be ignored"
        ],
        correctAnswer: 1,
        explanation: "Progression should be responsive rather than automatic. Comparison with another patient is not a useful dosing rule."
      }
    ]
  },
  {
    id: 46,
    week: 4,
    track: "Lifestyle",
    title: "Use movement variety as an option",
    subtitle: "Change position or strategy when it improves comfort, access, or task tolerance",
    assetPath: "/insight/movement-variability-summary.json", // Summary card with link to Physiopedia guide
    quizQ: "Changing position can be a comfort option, but there is no single perfect posture schedule. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Changing position can be a comfort option, but there is no single perfect posture schedule. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Position changes can be useful, but they are options—not another perfect schedule patients must follow."
      },
      {
        question: "Why might someone choose movement variability?",
        options: [
          "It confuses your body",
          "A position change may improve comfort or help vary task demands",
          "It causes more pain",
          "It guarantees pain relief"
        ],
        correctAnswer: 1,
        explanation: "Variation may change comfort or task demands. It does not guarantee relief or mean a previous position was damaging."
      },
      {
        question: "Which statement is most accurate?",
        options: [
          "Perfect alignment is required",
          "There are many acceptable positions and movement options",
          "Complete stillness is always safest",
          "Maximum slouching is required"
        ],
        correctAnswer: 1,
        explanation: "Many positions and movement strategies can be acceptable. The useful choice depends on the task and the person."
      }
    ]
  },
  {
    id: 47,
    week: 4,
    track: "SelfEfficacy",
    title: "Build a graded return ladder",
    subtitle: "Turn one meaningful activity into a series of achievable steps",
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
    title: "Name the emotion, then choose the action",
    subtitle: "Pain and emotional well-being can affect one another without making pain imaginary",
    assetPath: "/insight/pain-emotions-summary.json", // Summary card with link to MedlinePlus
    quizQ: "Emotions can influence pain perception. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Emotions can influence pain perception. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Pain can affect mood and distress, while emotional state can influence symptoms, coping, attention, and participation."
      },
      {
        question: "A patient feels anxious after a symptom increase. Which response is most useful?",
        options: [
          "Treat the anxiety as proof of new damage",
          "Name the feeling, check for concerning changes, and choose one manageable next action",
          "Force the feeling to disappear before moving",
          "Ignore both the symptom and the emotion"
        ],
        correctAnswer: 1,
        explanation: "Naming an emotion can create space to check the situation and choose a response. Persistent or worsening distress deserves appropriate support."
      },
      {
        question: "The relationship between pain and emotions is:",
        options: [
          "One-way (pain affects emotions)",
          "Non-existent",
          "Bidirectional (they affect each other)",
          "Random"
        ],
        correctAnswer: 2,
        explanation: "The relationship can run in both directions. This supports whole-person care; it does not reduce pain to emotion."
      }
    ]
  },
  {
    id: 49,
    week: 4,
    track: "SelfEfficacy",
    title: "Adjust the movement dose",
    subtitle: "Use function, confidence, symptoms, and recovery to decide what comes next",
    assetPath: "/insight/movement-quality-summary.json", // Summary card replacement
    quizQ: "Movement choices should consider both how an activity is performed and whether the dose fits the person. (T/F)",
    quizA: "T",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "Movement choices should consider both how an activity is performed and whether the dose fits the person. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Technique may matter for a task, but dose, goals, confidence, current capacity, and recovery also shape whether movement is useful."
      },
      {
        question: "After an exercise, symptoms settle normally and the activity feels more confident. What is a reasonable next step?",
        options: [
          "Increase every variable at once",
          "Keep or gradually progress one part of the dose",
          "Stop permanently because symptoms were present",
          "Repeat at maximum effort to prove recovery"
        ],
        correctAnswer: 1,
        explanation: "A small progression can provide useful information while keeping the response interpretable."
      },
      {
        question: "Which response suggests the dose may need review?",
        options: [
          "The task is meaningful",
          "The person feels appropriately challenged",
          "Function or recovery is repeatedly worse beyond the expected response",
          "The exercise can be adapted"
        ],
        correctAnswer: 2,
        explanation: "Repeated difficulty recovering or loss of function may signal that the dose, strategy, or plan should be adjusted—not that all movement must stop."
      }
    ]
  },
  {
    id: 50,
    week: 4,
    track: "Recap",
    title: "Week 4 graded-capacity check-in",
    subtitle: "Review what you noticed, practised, and learned from the response",
    assetPath: "/insight/week4-graded-capacity.json",
    quizQ: "Complete your Week 4 graded-capacity check-in.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 5 - STRENGTHEN SELF-MANAGEMENT =========
  {
    id: 51,
    week: 5,
    track: "PainScience",
    title: "Update learned protection",
    subtitle: "Use new, manageable experiences to build a broader picture of what is possible",
    assetPath: "/insight/neurotags-summary.json", // Summary card with link to NOI Group guide
    quizQ: "Pain is influenced by many factors, including context and past experience. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Pain is influenced by many factors, including context and past experience. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Past experience and context can influence protection without making pain imagined. New experiences can add information over time."
      },
      {
        question: "An activity feels threatening because it previously triggered symptoms. What is a useful way to build new evidence?",
        options: [
          "Avoid it forever",
          "Choose an appropriate starting point, practise it, and review the response",
          "Perform it at maximum intensity immediately",
          "Assume the memory is the only cause of pain"
        ],
        correctAnswer: 1,
        explanation: "A manageable, meaningful experience can provide new information. Safety and clinical restrictions still matter when present."
      }
    ]
  },
  {
    id: 52,
    week: 5,
    track: "StressMood",
    title: "Try a brief gratitude practice",
    subtitle: "Notice something meaningful without dismissing what is difficult",
    assetPath: "/insight/gratitude-summary.json", // Summary card replacement
    quizQ: "Gratitude can coexist with pain and difficult emotions. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "Gratitude can coexist with pain and difficult emotions. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Gratitude does not require forced positivity or denial. It is an optional attention practice, not a pain treatment or test of attitude."
      }
    ]
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
    points: 5,
    questions: [
      {
        question: "Caffeine timing affects everyone in exactly the same way. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Sensitivity varies. Timing, amount, medications, pregnancy, health, and routine can all matter."
      },
      {
        question: "How can you learn whether caffeine timing affects your sleep?",
        options: [
          "Remove every possible sleep influence at once",
          "Move the last caffeine earlier for several days and observe the pattern",
          "Judge the result after one night",
          "Assume caffeine never matters if you can fall asleep"
        ],
        correctAnswer: 1,
        explanation: "Changing one variable for several days makes the result easier to interpret and avoids an all-or-nothing overhaul."
      }
    ]
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
    title: "Keep going, modify, or seek support?",
    subtitle: "Use the situation—not fear or stubbornness—to choose the next response",
    assetPath: "/insight/response-decision-summary.json",
    quizQ: "A useful recovery plan includes reasons to continue, modify, and seek support. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "A useful recovery plan includes reasons to continue, modify, and seek support. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Self-management is not ignoring symptoms. It includes responding proportionately and knowing when reassessment is appropriate."
      },
      {
        question: "A familiar activity causes a mild, expected response that settles as planned. What is usually the most useful interpretation?",
        options: [
          "All activity must stop",
          "The response can be monitored while the plan continues or is adjusted as needed",
          "The activity must be doubled immediately",
          "Symptoms should never be considered"
        ],
        correctAnswer: 1,
        explanation: "Expected responses can be monitored in context. New, severe, progressive, or concerning symptoms should be assessed rather than forced through."
      }
    ]
  },
  {
    id: 56,
    week: 5,
    track: "SelfEfficacy",
    title: "Build a realistic wind-down",
    subtitle: "Choose one or two sleep-supporting options and test them consistently",
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
    title: "Week 5 self-management check-in",
    subtitle: "Decide what you can manage, what you may modify, and when support is useful",
    assetPath: "/insight/week5-self-management.json",
    quizQ: "Complete your Week 5 self-management check-in.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 6 - PREPARE FOR SETBACKS AND REAL-WORLD CHANGE =========
  {
    id: 58,
    week: 6,
    track: "PainScience",
    title: "Unhook from a worst-case prediction",
    subtitle: "Create distance from a threatening thought, then choose the next useful action",
    assetPath: "https://www.youtube.com/watch?v=OhNm7ZSiZls", // Russ Harris - Cognitive Defusion for Pain Management
    quizQ: "Threat-focused thoughts can influence distress and behaviour without making pain imaginary. (T/F)",
    quizA: "T",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Threat-focused thoughts can influence distress and behaviour without making pain imaginary. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Threat-focused thoughts can affect distress, confidence, and behaviour. That interaction does not make pain imagined or make the thought a personal failure."
      },
      {
        question: "Which example is a worst-case recovery prediction?",
        options: [
          "This is difficult, so I will review the response and adjust if needed",
          "This sensation proves I have ruined everything and will never recover",
          "I am unsure what this means, so I will seek appropriate advice",
          "I can try a smaller step"
        ],
        correctAnswer: 1,
        explanation: "Worst-case predictions often sound certain, global, and permanent. Naming the thought can create room to examine it."
      },
      {
        question: "After noticing a worst-case thought, what is a useful next step?",
        options: [
          "Argue with yourself until the thought disappears",
          "Name it as a thought, check the evidence and context, then choose a proportionate action",
          "Assume every concern is false",
          "Blame yourself for reacting"
        ],
        correctAnswer: 1,
        explanation: "The goal is not forced positivity. It is enough distance to choose an action based on the situation, your plan, and what matters."
      }
    ]
  },
  {
    id: 59,
    week: 6,
    track: "StressMood",
    title: "Choose a regulation skill that fits",
    subtitle: "Try comfortable paced breathing—or use another grounding strategy",
    assetPath: "https://www.youtube.com/watch?v=HhUoQ6gx6kE", // Kitaro Waga - How breathing affects the nervous system (science-based)
    quizQ: "A paced-breathing exercise may feel calming for some people, but it is optional and effects vary. (T/F)",
    quizA: "T",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "A paced-breathing exercise may feel calming for some people, but it is optional and effects vary. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Paced breathing is one optional regulation skill. Some people prefer movement, grounding, music, social support, or another approach."
      },
      {
        question: "What is the purpose of trying a regulation skill during recovery?",
        options: [
          "Guarantee that symptoms disappear",
          "Create enough steadiness to choose the next useful action",
          "Prove that pain is caused by stress",
          "Avoid every difficult activity"
        ],
        correctAnswer: 1,
        explanation: "Regulation skills can support decision-making and participation even when symptoms do not immediately change."
      },
      {
        question: "What should you do if paced breathing makes you dizzy or uncomfortable?",
        options: [
          "Force a deeper breath",
          "Hold your breath longer",
          "Stop or return to comfortable breathing",
          "Assume it proves something is wrong"
        ],
        correctAnswer: 2,
        explanation: "Breathing should remain comfortable. Stop or change the exercise if it causes dizziness, distress, or discomfort."
      }
    ]
  },
  {
    id: 60,
    week: 6,
    track: "Lifestyle",
    title: "Make hydration easier to repeat",
    subtitle: "Connect a realistic hydration cue to your existing routine",
    assetPath: "/insight/hydration-fascia.json",
    quizQ: "Hydration needs can change with activity, heat, health, and individual circumstances. (T/F)",
    quizA: "T",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "Hydration needs can change with activity, heat, health, and individual circumstances. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "There is no single intake target that fits every person and situation. Health conditions can also change appropriate advice."
      },
      {
        question: "Which approach is most likely to make hydration easier to repeat?",
        options: [
          "Wait until the end of every day and catch up all at once",
          "Connect drinking to an existing cue such as meals, medication, or an activity break",
          "Treat one missed target as failed recovery",
          "Use the same amount in every climate and circumstance"
        ],
        correctAnswer: 1,
        explanation: "A visible cue linked to an existing routine can reduce reliance on memory without turning hydration into another perfection rule."
      }
    ]
  },
  {
    id: 61,
    week: 6,
    track: "SelfEfficacy",
    title: "Rehearse your setback response",
    subtitle: "Decide what you will do before a difficult day makes decisions harder",
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
    title: "Review protection in context",
    subtitle: "Separate familiar recovery challenges from changes that need assessment",
    assetPath: "/insight/protectometer.json",
    quizQ: "The protectometer helps identify safety vs. danger signals. (T/F)",
    quizA: "T",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Context can influence protection, but a checklist cannot determine by itself whether a symptom is safe or dangerous. (True/False)",
        options: ["True", "False"],
        correctAnswer: 0,
        explanation: "Context provides useful information, but new, severe, progressive, unusual, or concerning symptoms still deserve appropriate assessment."
      },
      {
        question: "Which question adds useful context without dismissing symptoms?",
        options: [
          "How much does it hurt—nothing else matters",
          "What changed, what was the task, how did I respond, and is this pattern familiar?",
          "Can I prove that this is safe by pushing harder?",
          "Can I ignore it until it disappears?"
        ],
        correctAnswer: 1,
        explanation: "A broader context check supports proportionate decisions while leaving room for clinical assessment when needed."
      }
    ]
  },
  {
    id: 63,
    week: 6,
    track: "SelfEfficacy",
    title: "Build the next rung",
    subtitle: "Break a meaningful goal into a step you can practise and review",
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
    title: "Rehearse your complete recovery plan",
    subtitle: "Connect symptoms, stress, foundations, movement, support, and meaningful activity",
    assetPath: "/insight/framework-integration-week6.json",
    quizQ: "Complete your Framework integration plan.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 7 - CONSOLIDATE, PERSONALIZE, AND CONTINUE =========
  {
    id: 65,
    week: 7,
    track: "PainScience",
    title: "Self-management includes knowing when to ask for help",
    subtitle: "Use your tools independently while keeping appropriate care available",
    assetPath: "/insight/self-management-partnership.json",
    quizQ: "Self-management means managing recovery entirely without professional support. (T/F)",
    quizA: "F",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Self-management means managing recovery entirely without professional support. (True/False)",
        options: ["True", "False"],
        correctAnswer: 1,
        explanation: "Self-management means taking an active role. It can include professional guidance, reassessment, and shared decisions when appropriate."
      },
      {
        question: "Which is a core self-management skill?",
        options: [
          "Waiting for someone else to make every decision",
          "Problem-solving and choosing manageable actions",
          "Ignoring changes in symptoms",
          "Following the same plan regardless of context"
        ],
        correctAnswer: 1,
        explanation: "Problem-solving helps adapt the plan when symptoms, goals, health, work, or life circumstances change."
      }
    ]
  },
  {
    id: 66,
    week: 7,
    track: "SelfEfficacy",
    title: "Prepare for the next clinical conversation",
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
    title: "Compare where you started with where you are now",
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
    title: "Match your tools to the situation",
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
    title: "Choose the next meaningful direction",
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
    title: "Create a flexible maintenance plan",
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
    title: "Create your recovery handoff",
    subtitle: "Summarize what you understand, what remains difficult, and what support comes next",
    assetPath: "/insight/week7-clinician-handoff.json",
    quizQ: "Complete your recovery handoff.",
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
