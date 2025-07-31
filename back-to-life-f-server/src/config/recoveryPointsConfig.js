// Recovery Points Configuration
// Defines actions, point values, and SRS buffer conversion rules

// Daily Actions Configuration
export const rpActions = {
  MOVEMENT: [
    { action: 'Exercise video completed', points: 3, description: 'Complete assigned exercise video (per exercise)' },
    { action: 'Walk ≥3000 steps', points: 3, description: 'Achieve daily step goal' },
    { action: 'Stretching routine', points: 2, description: 'Complete stretching routine' },
    { action: 'Physical activity logged', points: 2, description: 'Log any physical activity' }
  ],
  
  LIFESTYLE: [
    { action: '7+ hours sleep logged', points: 2, description: 'Get adequate sleep (7+ hours)' },
    { action: 'Water goal met', points: 2, description: 'Meet daily hydration goal' },
    { action: 'Healthy meal logged', points: 1, description: 'Log a healthy meal' },
    { action: 'Stress management activity', points: 2, description: 'Practice stress reduction' }
  ],
  
  MINDSET: [
    { action: '5-min mindfulness', points: 5, description: 'Complete mindfulness exercise' },
    { action: 'Journaling prompt', points: 2, description: 'Complete daily journal entry' },
    { action: 'Gratitude practice', points: 1, description: 'Write 3 things you\'re grateful for' },
    { action: 'Positive affirmation', points: 1, description: 'Practice positive self-talk' }
  ],
  
  EDUCATION: [
    { action: 'Watch micro-lesson', points: 5, description: 'Complete educational video (Recovery Insights)' },
    { action: 'Quiz ≥80% correct', points: 3, description: 'Pass knowledge quiz' },
    { action: 'Read article', points: 2, description: 'Read educational content' },
    { action: 'Complete module', points: 4, description: 'Finish learning module' }
  ],
  
  ADHERENCE: [
    { action: 'Clinic visit attended', points: 5, description: 'Attend scheduled appointment' },
    { action: 'Form submitted on time', points: 3, description: 'Submit assessment on time (Pain Assessment)' },
    { action: 'Medication compliance', points: 3, description: 'Take prescribed medication' },
    { action: 'Home exercise compliance', points: 3, description: 'Complete home exercise program' }
  ]
};

// Weekly Point Caps (prevents super-users from skewing)
export const weeklyCaps = {
  MOVEMENT: 60,
  LIFESTYLE: 40,
  MINDSET: 40,
  EDUCATION: 30,
  ADHERENCE: 30
};

// SRS Buffer Conversion Rules
export const bufferConfig = {
  MOVEMENT: {
    domain: 'psfsBuffer',
    perQuarter: 25,        // 25 RP = +0.25 buffer points
    maxBuffer: 2.0,        // Max 2.0 buffer points (matches PSFS max)
    srsMapping: 'function' // Maps to PSFS/function domain
  },
  
  LIFESTYLE: {
    domain: 'vasBuffer', 
    perQuarter: 40,        // 40 RP = +0.25 buffer points
    maxBuffer: 1.0,        // Max 1.0 buffer points (matches VAS max)
    srsMapping: 'pain'     // Maps to VAS/pain domain
  },
  
  MINDSET: {
    domain: 'confBuffer',
    perQuarter: 30,        // 30 RP = +0.25 buffer points  
    maxBuffer: 2.0,        // Max 2.0 buffer points (matches confidence max)
    srsMapping: 'confidence' // Maps to confidence domain
  },
  
  EDUCATION: {
    domain: 'beliefBuffer',
    perQuarter: 25,        // 25 RP = +0.25 buffer points
    maxBuffer: 1.0,        // Max 1.0 buffer points (matches beliefs max)
    srsMapping: 'beliefs'  // Maps to beliefs domain
  }
};

// 4-Week RP Thresholds for SRS Eligibility
export const fourWeekThresholds = {
  PSFS: {
    category: 'MOVEMENT',
    threshold: 120,        // ≥120 Movement RP in 4 weeks
    flag: 'psfsEligible',
    description: 'Re-measure PSFS; if ↑ ≥4 pts, award +2'
  },
  
  VAS: {
    category: 'LIFESTYLE', 
    threshold: 80,         // ≥80 Lifestyle RP in 4 weeks
    flag: 'vasEligible',
    description: 'Confirm VAS; if ↓ ≥2 pts, award +1'
  },
  
  CONFIDENCE: {
    category: 'MINDSET',
    threshold: 90,         // ≥90 Mindset RP in 4 weeks
    flag: 'confEligible', 
    description: 'Re-rate confidence; if ↑ ≥3 pts, award +2'
  },
  
  BELIEFS: {
    category: 'EDUCATION',
    threshold: 50,         // ≥50 Education RP in 4 weeks
    flag: 'beliefEligible',
    description: 'Re-check beliefs; if none remain, award +1'
  }
};

// Progress Ring Targets (for UI display)
export const weeklyTargets = {
  total: 150,            // Total weekly RP target
  breakdown: {
    MOVEMENT: 45,        // 30% of total
    LIFESTYLE: 30,       // 20% of total  
    MINDSET: 30,         // 20% of total
    EDUCATION: 25,       // 17% of total
    ADHERENCE: 20        // 13% of total
  }
};

// Gamification Levels
export const achievementLevels = {
  bronze: { threshold: 50, badge: '🥉', title: 'Getting Started' },
  silver: { threshold: 100, badge: '🥈', title: 'Making Progress' },
  gold: { threshold: 150, badge: '🥇', title: 'Recovery Champion' },
  platinum: { threshold: 200, badge: '💎', title: 'Recovery Master' }
};

// Helper function to get achievement level
export function getAchievementLevel(weeklyRP) {
  if (weeklyRP >= achievementLevels.platinum.threshold) return achievementLevels.platinum;
  if (weeklyRP >= achievementLevels.gold.threshold) return achievementLevels.gold;
  if (weeklyRP >= achievementLevels.silver.threshold) return achievementLevels.silver;
  if (weeklyRP >= achievementLevels.bronze.threshold) return achievementLevels.bronze;
  return { threshold: 0, badge: '⭐', title: 'Just Starting' };
} 