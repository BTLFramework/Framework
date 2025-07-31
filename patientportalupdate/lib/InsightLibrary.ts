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
  // --- Week 1 ---
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
    track: "Recap", // Recap/reflection day
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
  // WEEK 2
  {
    id: 30,
    week: 2,
    track: "PainScience",
    title: "Week 2, Day 1",
    subtitle: "PainScience insight",
    assetPath: "/insight/week2-day1.mp4",
    quizQ: "Week 2, Day 1 question?",
    quizA: "Week 2, Day 1 answer",
    releaseOffset: 0
  },
  {
    id: 31,
    week: 2,
    track: "StressMood",
    title: "Week 2, Day 2",
    subtitle: "StressMood insight",
    assetPath: "/insight/week2-day2.mp4",
    quizQ: "Week 2, Day 2 question?",
    quizA: "Week 2, Day 2 answer",
    releaseOffset: 1
  },
  {
    id: 32,
    week: 2,
    track: "Lifestyle",
    title: "Week 2, Day 3",
    subtitle: "Lifestyle insight",
    assetPath: "/insight/week2-day3.json",
    quizQ: "Week 2, Day 3 question?",
    quizA: "Week 2, Day 3 answer",
    releaseOffset: 2
  },
  {
    id: 33,
    week: 2,
    track: "SuccessStory",
    title: "Week 2, Day 4",
    subtitle: "SuccessStory insight",
    assetPath: "/insight/week2-day4.mp4",
    quizQ: "Week 2, Day 4 question?",
    quizA: "Week 2, Day 4 answer",
    releaseOffset: 3
  },
  {
    id: 34,
    week: 2,
    track: "PainScience",
    title: "Week 2, Day 5",
    subtitle: "PainScience insight",
    assetPath: "/insight/week2-day5.mp4",
    quizQ: "Week 2, Day 5 question?",
    quizA: "Week 2, Day 5 answer",
    releaseOffset: 4
  },
  {
    id: 35,
    week: 2,
    track: "SelfEfficacy",
    title: "Week 2, Day 6",
    subtitle: "SelfEfficacy insight",
    assetPath: "/insight/week2-day6.json",
    quizQ: "Week 2, Day 6 question?",
    quizA: "Week 2, Day 6 answer",
    releaseOffset: 5
  },
  {
    id: 36,
    week: 2,
    track: "Recap",
    title: "Week 2, Day 7",
    subtitle: "Weekly reflection",
    assetPath: "/insight/recap-week2.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6
  },
  // WEEK 3
  {
    id: 37,
    week: 3,
    track: "PainScience",
    title: "Week 3, Day 1",
    subtitle: "PainScience insight",
    assetPath: "/insight/week3-day1.mp4",
    quizQ: "Week 3, Day 1 question?",
    quizA: "Week 3, Day 1 answer",
    releaseOffset: 0
  },
  {
    id: 38,
    week: 3,
    track: "StressMood",
    title: "Week 3, Day 2",
    subtitle: "StressMood insight",
    assetPath: "/insight/week3-day2.mp4",
    quizQ: "Week 3, Day 2 question?",
    quizA: "Week 3, Day 2 answer",
    releaseOffset: 1
  },
  {
    id: 39,
    week: 3,
    track: "Lifestyle",
    title: "Week 3, Day 3",
    subtitle: "Lifestyle insight",
    assetPath: "/insight/week3-day3.json",
    quizQ: "Week 3, Day 3 question?",
    quizA: "Week 3, Day 3 answer",
    releaseOffset: 2
  },
  {
    id: 40,
    week: 3,
    track: "SuccessStory",
    title: "Week 3, Day 4",
    subtitle: "SuccessStory insight",
    assetPath: "/insight/week3-day4.mp4",
    quizQ: "Week 3, Day 4 question?",
    quizA: "Week 3, Day 4 answer",
    releaseOffset: 3
  },
  {
    id: 41,
    week: 3,
    track: "PainScience",
    title: "Week 3, Day 5",
    subtitle: "PainScience insight",
    assetPath: "/insight/week3-day5.mp4",
    quizQ: "Week 3, Day 5 question?",
    quizA: "Week 3, Day 5 answer",
    releaseOffset: 4
  },
  {
    id: 42,
    week: 3,
    track: "SelfEfficacy",
    title: "Week 3, Day 6",
    subtitle: "SelfEfficacy insight",
    assetPath: "/insight/week3-day6.json",
    quizQ: "Week 3, Day 6 question?",
    quizA: "Week 3, Day 6 answer",
    releaseOffset: 5
  },
  {
    id: 43,
    week: 3,
    track: "Recap",
    title: "Week 3, Day 7",
    subtitle: "Weekly reflection",
    assetPath: "/insight/recap-week3.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6
  },
  // WEEK 4
  {
    id: 44,
    week: 4,
    track: "PainScience",
    title: "Week 4, Day 1",
    subtitle: "PainScience insight",
    assetPath: "/insight/week4-day1.mp4",
    quizQ: "Week 4, Day 1 question?",
    quizA: "Week 4, Day 1 answer",
    releaseOffset: 0
  },
  {
    id: 45,
    week: 4,
    track: "StressMood",
    title: "Week 4, Day 2",
    subtitle: "StressMood insight",
    assetPath: "/insight/week4-day2.mp4",
    quizQ: "Week 4, Day 2 question?",
    quizA: "Week 4, Day 2 answer",
    releaseOffset: 1
  },
  {
    id: 46,
    week: 4,
    track: "Lifestyle",
    title: "Week 4, Day 3",
    subtitle: "Lifestyle insight",
    assetPath: "/insight/week4-day3.json",
    quizQ: "Week 4, Day 3 question?",
    quizA: "Week 4, Day 3 answer",
    releaseOffset: 2
  },
  {
    id: 47,
    week: 4,
    track: "SuccessStory",
    title: "Week 4, Day 4",
    subtitle: "SuccessStory insight",
    assetPath: "/insight/week4-day4.mp4",
    quizQ: "Week 4, Day 4 question?",
    quizA: "Week 4, Day 4 answer",
    releaseOffset: 3
  },
  {
    id: 48,
    week: 4,
    track: "PainScience",
    title: "Week 4, Day 5",
    subtitle: "PainScience insight",
    assetPath: "/insight/week4-day5.mp4",
    quizQ: "Week 4, Day 5 question?",
    quizA: "Week 4, Day 5 answer",
    releaseOffset: 4
  },
  {
    id: 49,
    week: 4,
    track: "SelfEfficacy",
    title: "Week 4, Day 6",
    subtitle: "SelfEfficacy insight",
    assetPath: "/insight/week4-day6.json",
    quizQ: "Week 4, Day 6 question?",
    quizA: "Week 4, Day 6 answer",
    releaseOffset: 5
  },
  {
    id: 50,
    week: 4,
    track: "Recap",
    title: "Week 4, Day 7",
    subtitle: "Weekly reflection",
    assetPath: "/insight/recap-week4.json",
    quizQ: "What was your biggest learning this week?",
    quizA: "(user input)",
    releaseOffset: 6
  },
  // WEEK 5
  {
    id: 51,
    week: 5,
    track: "PainScience",
    title: "Neurotags 101",
    subtitle: "Networks that create pain",
    assetPath: "/insight/neurotags-101.mp4",
    quizQ: "Neurotags are networks in your brain that can create pain. (T/F)",
    quizA: "T",
    releaseOffset: 0
  },
  {
    id: 52,
    week: 5,
    track: "StressMood",
    title: "Gratitude & pain",
    subtitle: "Simple journal practice",
    assetPath: "/insight/gratitude-pain.mp4",
    quizQ: "Gratitude practice can help reduce pain sensitivity. (T/F)",
    quizA: "T",
    releaseOffset: 1
  },
  {
    id: 53,
    week: 5,
    track: "Lifestyle",
    title: "Caffeine & sleep",
    subtitle: "The 2 pm cutoff rule",
    assetPath: "/insight/caffeine-sleep.json",
    quizQ: "You should stop caffeine by 2 pm for better sleep. (T/F)",
    quizA: "T",
    releaseOffset: 2
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
    releaseOffset: 3
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
    releaseOffset: 4
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
    releaseOffset: 5
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
    releaseOffset: 6
  },
  // WEEK 6
  {
    id: 58,
    week: 6,
    track: "PainScience",
    title: "Sticky thoughts vs. sticky tissues",
    subtitle: "Catastrophising",
    assetPath: "/insight/sticky-thoughts.mp4",
    quizQ: "Catastrophising can make pain feel worse than tissue damage. (T/F)",
    quizA: "T",
    releaseOffset: 0
  },
  {
    id: 59,
    week: 6,
    track: "StressMood",
    title: "Stress-breath connection",
    subtitle: "Box breathing basics",
    assetPath: "/insight/stress-breath.mp4",
    quizQ: "Box breathing can help reduce stress and pain. (T/F)",
    quizA: "T",
    releaseOffset: 1
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
    releaseOffset: 2
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
    releaseOffset: 3
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
    releaseOffset: 4
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
    releaseOffset: 5
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
    releaseOffset: 6
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