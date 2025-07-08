// Thoracic Disability Index (TDI) Questions
// Clinic-developed assessment for thoracic spine disability
// Based on established disability index formats (ODI/NDI structure)

const TDI_QUESTIONS = [
  {
    id: "tdi_pain_intensity",
    section: 1,
    title: "Pain Intensity",
    question: "How would you rate your thoracic/mid-back pain right now?",
    options: [
      { value: 0, label: "I have no pain at the moment" },
      { value: 1, label: "The pain is very mild at the moment" },
      { value: 2, label: "The pain is moderate at the moment" },
      { value: 3, label: "The pain is fairly severe at the moment" },
      { value: 4, label: "The pain is very severe at the moment" },
      { value: 5, label: "The pain is the worst imaginable at the moment" }
    ]
  },
  {
    id: "tdi_personal_care",
    section: 2,
    title: "Personal Care (washing, dressing, etc.)",
    question: "How does your thoracic/mid-back pain affect your personal care activities?",
    options: [
      { value: 0, label: "I can look after myself normally without causing extra pain" },
      { value: 1, label: "I can look after myself normally but it causes extra pain" },
      { value: 2, label: "It is painful to look after myself and I am slow and careful" },
      { value: 3, label: "I need some help but manage most of my personal care" },
      { value: 4, label: "I need help every day in most aspects of self care" },
      { value: 5, label: "I do not get dressed, wash with difficulty and stay in bed" }
    ]
  },
  {
    id: "tdi_lifting",
    section: 3,
    title: "Lifting",
    question: "How does your thoracic/mid-back pain affect your ability to lift things?",
    options: [
      { value: 0, label: "I can lift heavy weights without extra pain" },
      { value: 1, label: "I can lift heavy weights but it gives extra pain" },
      { value: 2, label: "Pain prevents me from lifting heavy weights but I can manage light to medium weights" },
      { value: 3, label: "Pain prevents me from lifting heavy weights but I can manage light weights if they are conveniently positioned" },
      { value: 4, label: "I can only lift very light weights" },
      { value: 5, label: "I cannot lift or carry anything at all" }
    ]
  },
  {
    id: "tdi_walking",
    section: 4,
    title: "Walking",
    question: "How does your thoracic/mid-back pain affect your walking?",
    options: [
      { value: 0, label: "Pain does not prevent me walking any distance" },
      { value: 1, label: "Pain prevents me walking more than 1 mile" },
      { value: 2, label: "Pain prevents me walking more than 1/2 mile" },
      { value: 3, label: "Pain prevents me walking more than 1/4 mile" },
      { value: 4, label: "I can only walk using a stick or crutches" },
      { value: 5, label: "I am in bed most of the time and have to crawl to the toilet" }
    ]
  },
  {
    id: "tdi_sitting",
    section: 5,
    title: "Sitting",
    question: "How does your thoracic/mid-back pain affect your sitting?",
    options: [
      { value: 0, label: "I can sit in any chair as long as I like" },
      { value: 1, label: "I can only sit in my favorite chair as long as I like" },
      { value: 2, label: "Pain prevents me sitting more than 1 hour" },
      { value: 3, label: "Pain prevents me sitting more than 1/2 hour" },
      { value: 4, label: "Pain prevents me sitting more than 10 minutes" },
      { value: 5, label: "Pain prevents me from sitting at all" }
    ]
  },
  {
    id: "tdi_standing",
    section: 6,
    title: "Standing",
    question: "How does your thoracic/mid-back pain affect your standing?",
    options: [
      { value: 0, label: "I can stand as long as I want without extra pain" },
      { value: 1, label: "I can stand as long as I want but it gives me extra pain" },
      { value: 2, label: "Pain prevents me from standing for more than 1 hour" },
      { value: 3, label: "Pain prevents me from standing for more than 30 minutes" },
      { value: 4, label: "Pain prevents me from standing for more than 10 minutes" },
      { value: 5, label: "Pain prevents me from standing at all" }
    ]
  },
  {
    id: "tdi_sleeping",
    section: 7,
    title: "Sleeping",
    question: "How does your thoracic/mid-back pain affect your sleep?",
    options: [
      { value: 0, label: "Pain does not prevent me from sleeping well" },
      { value: 1, label: "I can sleep well only by using tablets" },
      { value: 2, label: "Even when I take tablets I have less than 6 hours sleep" },
      { value: 3, label: "Even when I take tablets I have less than 4 hours sleep" },
      { value: 4, label: "Even when I take tablets I have less than 2 hours sleep" },
      { value: 5, label: "Pain prevents me from sleeping at all" }
    ]
  },
  {
    id: "tdi_work_activities",
    section: 8,
    title: "Work Activities (includes housework)",
    question: "How does your thoracic/mid-back pain affect your work activities?",
    options: [
      { value: 0, label: "My normal work activities do not cause pain" },
      { value: 1, label: "My normal work activities increase my pain but I can still perform all that is required of me" },
      { value: 2, label: "I can perform most of my work activities but pain prevents me from performing more physically stressful activities" },
      { value: 3, label: "Pain prevents me from doing anything but light duties" },
      { value: 4, label: "Pain prevents me from doing even light duties" },
      { value: 5, label: "I cannot perform any work activities at all" }
    ]
  },
  {
    id: "tdi_recreation",
    section: 9,
    title: "Recreation",
    question: "How does your thoracic/mid-back pain affect your recreational activities?",
    options: [
      { value: 0, label: "I am able to engage in all my recreation activities with no pain" },
      { value: 1, label: "I am able to engage in all my recreation activities with some pain" },
      { value: 2, label: "I am able to engage in most, but not all of my usual recreation activities because of pain" },
      { value: 3, label: "I am able to engage in a few of my usual recreation activities because of pain" },
      { value: 4, label: "I can hardly do any recreation activities because of pain" },
      { value: 5, label: "I cannot do any recreation activities at all" }
    ]
  },
  {
    id: "tdi_breathing",
    section: 10,
    title: "Breathing and Coughing",
    question: "How does your thoracic/mid-back pain affect your breathing and coughing?",
    options: [
      { value: 0, label: "I can breathe deeply and cough without pain" },
      { value: 1, label: "I can breathe deeply and cough with slight pain" },
      { value: 2, label: "Deep breathing and coughing cause moderate pain" },
      { value: 3, label: "Deep breathing and coughing cause severe pain" },
      { value: 4, label: "I avoid deep breathing and coughing because of severe pain" },
      { value: 5, label: "I have constant difficulty breathing due to pain" }
    ]
  }
];

// TDI Scoring Information
const TDI_SCORING = {
  maxScore: 50,
  sections: 10,
  pointsPerSection: 5,
  interpretation: {
    minimal: { range: [0, 20], percentage: [0, 40], description: "Minimal disability" },
    moderate: { range: [21, 30], percentage: [41, 60], description: "Moderate disability" },
    severe: { range: [31, 40], percentage: [61, 80], description: "Severe disability" },
    complete: { range: [41, 50], percentage: [81, 100], description: "Complete disability" }
  }
};

// Calculate TDI score and percentage
const calculateTDIScore = (responses) => {
  if (!responses || !Array.isArray(responses)) return { score: 0, percentage: 0 };
  
  const totalScore = responses.reduce((sum, response) => {
    return sum + (response.value || 0);
  }, 0);
  
  const percentage = Math.round((totalScore / TDI_SCORING.maxScore) * 100);
  
  return {
    score: totalScore,
    percentage,
    interpretation: getInterpretation(percentage)
  };
};

const getInterpretation = (percentage) => {
  const { interpretation } = TDI_SCORING;
  
  if (percentage <= interpretation.minimal.percentage[1]) return interpretation.minimal.description;
  if (percentage <= interpretation.moderate.percentage[1]) return interpretation.moderate.description;
  if (percentage <= interpretation.severe.percentage[1]) return interpretation.severe.description;
  return interpretation.complete.description;
};

module.exports = {
  TDI_QUESTIONS,
  TDI_SCORING,
  calculateTDIScore,
  getInterpretation
}; 