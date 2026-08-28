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
    title: "Understanding your pain",
    subtitle: "Pain is real. Understanding it can help you decide what to do next.",
    assetPath: "/insight/ps-danger.mp4",
    quizQ: "Someone says, 'If it hurts more today, I must have caused more damage.' What is the most useful explanation?",
    quizA: "Pain matters, but its intensity alone cannot tell us how much damage there is.",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Someone says, 'If it hurts more today, I must have caused more damage.' What is the most useful explanation?",
        options: [
          "Pain tells us exactly how much an injury has changed.",
          "Pain matters, but its intensity alone cannot tell us how much damage there is.",
          "If stress is involved, the pain is mainly psychological."
        ],
        correctAnswer: 1,
        explanation: "Pain is real. Injury and health matter, and so can sleep, stress, past experience, and the situation. We look at symptoms alongside function and assessment—not dismiss them or use intensity as an exact damage report."
      },
      {
        question: "You want to understand a change in symptoms. Which information gives the fuller picture?",
        options: [
          "The highest pain number you noticed.",
          "Whether an exercise was uncomfortable.",
          "What changed, what you were doing, how you functioned, and whether this is a familiar pattern."
        ],
        correctAnswer: 2,
        explanation: "A fuller picture helps guide the next step. New or concerning changes need advice; understanding pain is not permission to ignore them."
      }
    ]
  },
  {
    id: 22,
    week: 1,
    track: "StressMood",
    title: "When stress adds to the picture",
    subtitle: "Understand the connection, then try one tool that fits your day.",
    assetPath: "/insight/stress-recovery-summary.json",
    quizQ: "After a demanding day, your familiar symptoms feel more noticeable. What can you reasonably conclude?",
    quizA: "Stress may be part of the picture, alongside the day's activity and other factors.",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "After a demanding day, your familiar symptoms feel more noticeable. What can you reasonably conclude?",
        options: [
          "Stress may be part of the picture, alongside the day's activity and other factors.",
          "Stress explains the symptoms, so physical factors no longer matter.",
          "You need to get stress under control before recovery can continue."
        ],
        correctAnswer: 0,
        explanation: "Stress can affect how you feel and respond without being the only explanation. You can support yourself while continuing your recovery plan; you do not need a stress-free life."
      },
      {
        question: "You try comfortable breathing and feel a little steadier, but the pain is unchanged. What does that tell you?",
        options: [
          "The exercise failed because the pain did not fall.",
          "It may be useful for feeling steadier, even without immediate pain relief.",
          "It proves that stress was causing the pain."
        ],
        correctAnswer: 1,
        explanation: "Different tools have different jobs. Feeling steadier may help you choose your next step. It does not prove a cause or guarantee pain relief. We'll continue building your toolbox."
      }
    ]
  },
  {
    id: 23,
    week: 1,
    track: "Lifestyle",
    title: "Giving your body the support it needs",
    subtitle: "Sleep, food, and hydration: useful foundations, not another list to perfect.",
    assetPath: "/insight/recovery-foundations-week1.json",
    quizQ: "A busy week has meant irregular meals and less time for sleep. What is a practical starting point?",
    quizA: "Choose one repeatable improvement while continuing the recovery plan.",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "A busy week has meant irregular meals and less time for sleep. What is a practical starting point?",
        options: [
          "Change every routine at once so nothing is missed.",
          "Choose one repeatable improvement while continuing the recovery plan.",
          "Put activity on hold until sleep and eating are consistent."
        ],
        correctAnswer: 1,
        explanation: "You don't need to change everything at once. A reliable meal or realistic sleep routine can support your day without turning recovery into another full-time job."
      },
      {
        question: "Why are we discussing these habits alongside treatment and movement?",
        options: [
          "They help support energy, normal body function, and participation in recovery.",
          "They tell us which habit caused the pain.",
          "They replace the need to build movement and strength."
        ],
        correctAnswer: 0,
        explanation: "These are supports, not a diagnosis or a replacement for the rest of your care. Personal health needs and circumstances can change what is useful."
      }
    ]
  },
  {
    id: 24,
    week: 1,
    track: "SelfEfficacy",
    title: "What went through your mind?",
    subtitle: "Learn the thought–action loop, then practise a more balanced response.",
    assetPath: "/insight/recovery-signals-week1.json",
    quizQ: "Complete this short reflection or plan.",
    quizA: "(user input)",
    releaseOffset: 3,
    points: 5
  },
  {
    id: 25,
    week: 1,
    track: "PainScience",
    title: "Why we keep you moving",
    subtitle: "The hands-on treatment is one piece of the puzzle.",
    assetPath: "/insight/motion-lotion-summary.json",
    quizQ: "Treatment has made a familiar activity more comfortable. What helps you build on that opportunity?",
    quizA: "Practise a manageable amount of the activity within your plan.",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "Treatment has made a familiar activity more comfortable. What helps you build on that opportunity?",
        options: [
          "Rest the area until the next appointment to preserve the change.",
          "Use the comfortable period to do much more than usual.",
          "Practise a manageable amount of the activity within your plan."
        ],
        correctAnswer: 2,
        explanation: "Hands-on care can reduce pain or improve comfort for some people. Movement is how we rebuild strength, activity tolerance, and confidence. You can build gradually; treatment is not a prerequisite for moving."
      },
      {
        question: "Why repeat a manageable activity rather than just test it once?",
        options: [
          "Repeated practice can build ability and help you learn how you respond.",
          "Repetition guarantees the activity will become pain-free.",
          "The aim is to prove you can tolerate any discomfort."
        ],
        correctAnswer: 0,
        explanation: "Keep moving, start with what you can do, and build from there. Repeated experiences can help develop function and confidence. The amount still needs to fit your response and clinical guidance."
      }
    ]
  },
  {
    id: 28,
    week: 1,
    track: "SelfEfficacy",
    title: "When a day feels more difficult",
    subtitle: "Recovery is rarely a straight line. Start with a simple flare-up plan.",
    assetPath: "FORM:flare-up-plan",
    quizQ: "Complete this short reflection or plan.",
    quizA: "(user input)",
    releaseOffset: 5,
    points: 5
  },
  {
    id: 29,
    week: 1,
    track: "Recap",
    title: "What is starting to make sense?",
    subtitle: "A short look at what you understand, what you tried, and what you want to ask.",
    assetPath: "/insight/week1-reflection.json",
    quizQ: "Complete this short reflection or plan.",
    quizA: "(user input)",
    releaseOffset: 6,
    points: 5
  },

  // ========= WEEK 2 - APPLY THE RECOVERY MODEL =========
  {
    id: 30,
    week: 2,
    track: "PainScience",
    title: "Pain is real. What does it tell us?",
    subtitle: "Revisit the idea, then use it in an everyday situation.",
    assetPath: "https://vimeo.com/245179549",
    quizQ: "Your agreed short walk caused familiar discomfort that settled as expected. There has been no new injury or change in the pattern. What is the best-supported next step?",
    quizA: "Repeat the agreed amount and review the response.",
    releaseOffset: 0,
    points: 5,
    questions: [
      {
        question: "Your agreed short walk caused familiar discomfort that settled as expected. There has been no new injury or change in the pattern. What is the best-supported next step?",
        options: [
          "Wait until all discomfort has gone before trying again.",
          "Repeat the agreed amount and review the response.",
          "Add extra distance because one walk went well."
        ],
        correctAnswer: 1,
        explanation: "Yesterday gives you useful information for repeating the agreed step. It does not establish that a large increase is right, or make zero discomfort a new requirement. If the pattern changes, review the plan."
      },
      {
        question: "Which statement best explains 'pain is not a damage meter'?",
        options: [
          "Pain intensity is one piece of information, not an exact measurement of injury.",
          "Pain only matters when a scan shows an injury.",
          "Once assessed, every future symptom can be treated as harmless."
        ],
        correctAnswer: 0,
        explanation: "Pain and injury can occur together, but intensity alone cannot measure damage. New symptoms still deserve attention. Use the whole picture and the guidance from your assessment."
      }
    ]
  },
  {
    id: 31,
    week: 2,
    track: "PainScience",
    title: "Why one day can feel different",
    subtitle: "Look at the whole picture before deciding what a change means.",
    assetPath: "/insight/pain-variability-summary.json",
    quizQ: "A familiar task feels harder after a poor night's sleep and a demanding morning. What is the most useful observation?",
    quizA: "Sleep, stress, activity, and symptoms may be interacting; look at the pattern.",
    releaseOffset: 1,
    points: 5,
    questions: [
      {
        question: "A familiar task feels harder after a poor night's sleep and a demanding morning. What is the most useful observation?",
        options: [
          "The task must have become harmful.",
          "Poor sleep is definitely the cause.",
          "Sleep, stress, activity, and symptoms may be interacting; look at the pattern."
        ],
        correctAnswer: 2,
        explanation: "The context can help explain variation, but it does not identify a single cause. Note what changed and how you function, rather than making a diagnosis from one difficult morning."
      },
      {
        question: "Which note would be most useful to bring to your next appointment?",
        options: [
          "'Pain was higher, so I must be getting worse.'",
          "'The task felt harder after a busy day; I reduced the amount and noted how long it took to settle.'",
          "'I will wait until I can identify the exact cause before mentioning it.'"
        ],
        correctAnswer: 1,
        explanation: "Specific observations help us decide what to keep, change, or assess. You do not need to solve the cause yourself. Look at the overall trend rather than any single day."
      }
    ]
  },
  {
    id: 32,
    week: 2,
    track: "Lifestyle",
    title: "A little discomfort: what next?",
    subtitle: "Use your flare-up plan to decide whether to continue, adjust, or ask.",
    assetPath: "/insight/flare-up-management-summary.json",
    quizQ: "An agreed activity repeatedly leaves you struggling with usual tasks for longer than expected. What is the most useful response?",
    quizA: "Review or reduce the amount and discuss the repeated response with your practitioner.",
    releaseOffset: 2,
    points: 5,
    questions: [
      {
        question: "An agreed activity repeatedly leaves you struggling with usual tasks for longer than expected. What is the most useful response?",
        options: [
          "Keep the amount unchanged to build tolerance.",
          "Review or reduce the amount and discuss the repeated response with your practitioner.",
          "Stop that activity until you can be certain it will cause no symptoms."
        ],
        correctAnswer: 1,
        explanation: "This response differs from the familiar discomfort that settles as planned. Adjusting the amount is not abandoning the goal. Repeated difficulty recovering is useful information for reviewing your plan."
      },
      {
        question: "You notice new weakness rather than your usual symptom fluctuation. Which response fits?",
        options: [
          "Use the usual flare plan for a few days before deciding.",
          "Increase movement to test whether it goes away.",
          "Seek prompt clinical advice rather than treating it as a familiar flare."
        ],
        correctAnswer: 2,
        explanation: "New or progressive weakness needs assessment. Sudden major weakness or other emergency symptoms need urgent care. Becoming comfortable with some discomfort does not mean ignoring a change that needs help."
      }
    ]
  },
  {
    id: 33,
    week: 2,
    track: "SelfEfficacy",
    title: "Look at the overall trend",
    subtitle: "A difficult day is part of the picture—not the whole picture.",
    assetPath: "/insight/recovery-not-linear-summary.json",
    quizQ: "Your pain has varied this week, but you can walk farther and feel more confident. What is a fair summary?",
    quizA: "There are useful signs of progress, while pain still deserves attention.",
    releaseOffset: 3,
    points: 5,
    questions: [
      {
        question: "Your pain has varied this week, but you can walk farther and feel more confident. What is a fair summary?",
        options: [
          "There is no progress unless pain falls every day.",
          "There are useful signs of progress, while pain still deserves attention.",
          "You have recovered, so the remaining symptoms no longer matter."
        ],
        correctAnswer: 1,
        explanation: "Recovery is rarely a straight line. Ability, confidence, and symptoms can change at different rates. Notice the gains without pretending the difficult parts have disappeared."
      },
      {
        question: "You have had less function and worsening symptoms across several weeks. How does 'look at the trend' apply?",
        options: [
          "It means waiting longer because recovery always fluctuates.",
          "It means focusing only on a positive part of the week.",
          "It means bringing that sustained change to your practitioner for review."
        ],
        correctAnswer: 2,
        explanation: "Looking at the trend works both ways. This message must not be used to dismiss deterioration or a plan that is not helping."
      }
    ]
  },
  {
    id: 34,
    week: 2,
    track: "PainScience",
    title: "Find an amount you can build on",
    subtitle: "Pacing without avoidance: make activity more repeatable, then build.",
    assetPath: "/insight/pacing-strategies-summary.json",
    quizQ: "A large burst of chores regularly leaves you unable to do much the next day. Which plan offers a useful starting point?",
    quizA: "Split the task into manageable parts and review the response.",
    releaseOffset: 4,
    points: 5,
    questions: [
      {
        question: "A large burst of chores regularly leaves you unable to do much the next day. Which plan offers a useful starting point?",
        options: [
          "Split the task into manageable parts and review the response.",
          "Finish the full task whenever you have a good day.",
          "Keep reducing chores until no effort is involved."
        ],
        correctAnswer: 0,
        explanation: "Pacing is a way to make activity more repeatable. You can vary tasks, take breaks, or change the amount while keeping the longer-term goal in view."
      },
      {
        question: "Your current walking amount has become manageable. What is pacing for now?",
        options: [
          "Keeping the same limit permanently to avoid uncertainty.",
          "Considering a small next step using your response and agreed plan.",
          "Making every walk harder regardless of how you recover."
        ],
        correctAnswer: 1,
        explanation: "Start with what you can do, and build from there. Pacing should support participation and progress, not become a permanent rule that you cannot do more."
      }
    ]
  },
  {
    id: 35,
    week: 2,
    track: "SelfEfficacy",
    title: "Making sleep a little easier",
    subtitle: "Try one sleep-support experiment that fits your life.",
    assetPath: "/insight/sleep-recovery-summary.json",
    quizQ: "You try a wind-down routine but still have one poor night. What is a useful next step?",
    quizA: "Keep a feasible routine for several nights and look at the pattern.",
    releaseOffset: 5,
    points: 5,
    questions: [
      {
        question: "You try a wind-down routine but still have one poor night. What is a useful next step?",
        options: [
          "Change the whole routine the next day.",
          "Keep a feasible routine for several nights and look at the pattern.",
          "Spend much longer in bed to make up for it."
        ],
        correctAnswer: 1,
        explanation: "One night cannot tell you whether a routine is useful. Look at the overall trend rather than any single day. Persistent sleep difficulty may need support beyond general sleep tips."
      },
      {
        question: "Which is the clearest way to understand sleep and pain?",
        options: [
          "Improving sleep guarantees that pain will improve.",
          "Pain must improve before sleep can improve.",
          "Pain can disturb sleep, and difficult sleep can affect how you feel and cope."
        ],
        correctAnswer: 2,
        explanation: "The relationship can go both ways. Supporting sleep is one part of your toolbox, not a test you must pass before recovery can continue."
      }
    ]
  },
  {
    id: 36,
    week: 2,
    track: "Recap",
    title: "What did you learn by trying?",
    subtitle: "Return to an earlier idea, then choose what is worth building on.",
    assetPath: "/insight/week2-application.json",
    quizQ: "Complete this short reflection or plan.",
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
