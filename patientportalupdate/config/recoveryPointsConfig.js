// Recovery Points Configuration - Frontend
// Matches backend configuration for consistency

// Daily Actions Configuration
export const rpActions = {
  MOVEMENT: [
    { action: 'Exercise video completed', points: 3, description: 'Complete assigned exercise video', icon: '🏋️' },
    { action: 'Walk ≥3000 steps', points: 3, description: 'Achieve daily step goal', icon: '🚶' },
    { action: 'Stretching routine', points: 2, description: 'Complete stretching routine', icon: '🤸' },
    { action: 'Physical activity logged', points: 2, description: 'Log any physical activity', icon: '💪' }
  ],
  
  LIFESTYLE: [
    { action: '7+ hours sleep logged', points: 2, description: 'Get adequate sleep (7+ hours)', icon: '😴' },
    { action: 'Water goal met', points: 2, description: 'Meet daily hydration goal', icon: '💧' },
    { action: 'Healthy meal logged', points: 1, description: 'Log a healthy meal', icon: '🥗' },
    { action: 'Stress management activity', points: 2, description: 'Practice stress reduction', icon: '🧘' }
  ],
  
  MINDSET: [
    { action: '5-min mindfulness', points: 2, description: 'Complete mindfulness exercise', icon: '🧠' },
    { action: 'Journaling prompt', points: 2, description: 'Complete daily journal entry', icon: '📝' },
    { action: 'Gratitude practice', points: 1, description: 'Write 3 things you\'re grateful for', icon: '🙏' },
    { action: 'Positive affirmation', points: 1, description: 'Practice positive self-talk', icon: '💭' }
  ],
  
  EDUCATION: [
    { action: 'Watch micro-lesson', points: 3, description: 'Complete educational video', icon: '📹' },
    { action: 'Quiz ≥80% correct', points: 3, description: 'Pass knowledge quiz', icon: '🧩' },
    { action: 'Read article', points: 2, description: 'Read educational content', icon: '📚' },
    { action: 'Complete module', points: 4, description: 'Finish learning module', icon: '🎓' }
  ],
  
  ADHERENCE: [
    { action: 'Clinic visit attended', points: 5, description: 'Attend scheduled appointment', icon: '🏥' },
    { action: 'Form submitted on time', points: 5, description: 'Submit assessment on time', icon: '📋' },
    { action: 'Medication compliance', points: 3, description: 'Take prescribed medication', icon: '💊' },
    { action: 'Home exercise compliance', points: 3, description: 'Complete home exercise program', icon: '🏠' }
  ]
};

// Weekly Point Caps
export const weeklyCaps = {
  MOVEMENT: 60,
  LIFESTYLE: 40,
  MINDSET: 40,
  EDUCATION: 30,
  ADHERENCE: 30
};

// Progress Ring Targets
export const weeklyTargets = {
  total: 150,
  breakdown: {
    MOVEMENT: 45,
    LIFESTYLE: 30,
    MINDSET: 30,
    EDUCATION: 25,
    ADHERENCE: 20
  }
};

// Category Colors for UI
export const categoryColors = {
  MOVEMENT: {
    primary: '#10b981', // emerald-500
    light: '#d1fae5',   // emerald-100
    dark: '#047857'     // emerald-700
  },
  LIFESTYLE: {
    primary: '#3b82f6', // blue-500
    light: '#dbeafe',   // blue-100
    dark: '#1d4ed8'     // blue-700
  },
  MINDSET: {
    primary: '#8b5cf6', // violet-500
    light: '#ede9fe',   // violet-100
    dark: '#5b21b6'     // violet-700
  },
  EDUCATION: {
    primary: '#f59e0b', // amber-500
    light: '#fef3c7',   // amber-100
    dark: '#d97706'     // amber-700
  },
  ADHERENCE: {
    primary: '#ef4444', // red-500
    light: '#fee2e2',   // red-100
    dark: '#dc2626'     // red-700
  }
};

// Gamification Levels
export const achievementLevels = {
  bronze: { threshold: 50, badge: '🥉', title: 'Getting Started', color: '#cd7f32' },
  silver: { threshold: 100, badge: '🥈', title: 'Making Progress', color: '#c0c0c0' },
  gold: { threshold: 150, badge: '🥇', title: 'Recovery Champion', color: '#ffd700' },
  platinum: { threshold: 200, badge: '💎', title: 'Recovery Master', color: '#e5e4e2' }
};

// Helper function to get achievement level
export function getAchievementLevel(weeklyRP) {
  if (weeklyRP >= achievementLevels.platinum.threshold) return achievementLevels.platinum;
  if (weeklyRP >= achievementLevels.gold.threshold) return achievementLevels.gold;
  if (weeklyRP >= achievementLevels.silver.threshold) return achievementLevels.silver;
  if (weeklyRP >= achievementLevels.bronze.threshold) return achievementLevels.bronze;
  return { threshold: 0, badge: '⭐', title: 'Just Starting', color: '#6b7280' };
}

// Helper function to get category display name
export function getCategoryDisplayName(category) {
  const names = {
    MOVEMENT: 'Movement',
    LIFESTYLE: 'Lifestyle',
    MINDSET: 'Mindset',
    EDUCATION: 'Education',
    ADHERENCE: 'Adherence'
  };
  return names[category] || category;
}

// Helper function to calculate progress percentage
export function calculateProgress(current, target) {
  return Math.min(100, Math.round((current / target) * 100));
}

// Buffer progress indicators (for showing progress toward next SRS boost)
export const bufferProgress = {
  MOVEMENT: {
    domain: 'Function (PSFS)',
    perQuarter: 25,
    maxBuffer: 2.0,
    description: 'Movement activities boost your functional capacity'
  },
  LIFESTYLE: {
    domain: 'Pain (VAS)',
    perQuarter: 40,
    maxBuffer: 1.0,
    description: 'Lifestyle activities help reduce pain levels'
  },
  MINDSET: {
    domain: 'Confidence',
    perQuarter: 30,
    maxBuffer: 2.0,
    description: 'Mindset activities build your confidence'
  },
  EDUCATION: {
    domain: 'Beliefs',
    perQuarter: 25,
    maxBuffer: 1.0,
    description: 'Education activities improve your understanding'
  }
}; 