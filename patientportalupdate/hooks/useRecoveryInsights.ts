import type { RecoveryInsight } from "@/types/recovery";

const mockInsights: RecoveryInsight[] = [
  {
    id: "PAIN_REDUCTION_WEEK_1",
    title: "Pain Reduction Progress",
    description: "Your pain levels have shown significant improvement over the past week.",
    category: "Pain Management",
    date: new Date().toISOString(),
    points: 10,
    metrics: [
      {
        label: "Average Pain Level",
        value: "3/10",
        change: -20
      },
      {
        label: "Pain-Free Days",
        value: 3,
        change: 50
      }
    ],
    recommendations: [
      "Continue with your current exercise routine",
      "Maintain good posture throughout the day",
      "Apply ice/heat therapy as recommended"
    ],
    viewed: false
  },
  {
    id: "MOVEMENT_PROGRESS_WEEK_1",
    title: "Exercise Achievement",
    description: "You've made excellent progress with your movement exercises this week.",
    category: "Movement",
    date: new Date().toISOString(),
    points: 15,
    metrics: [
      {
        label: "Exercise Completion",
        value: "85%",
        change: 15
      },
      {
        label: "Exercise Types",
        value: 4,
        change: 33
      }
    ],
    recommendations: [
      "Try increasing repetitions gradually",
      "Focus on quality over quantity",
      "Remember to warm up properly"
    ],
    viewed: false
  },
  {
    id: "MINDFULNESS_PROGRESS_WEEK_1",
    title: "Mindfulness Milestone",
    description: "Your dedication to mindfulness practice is showing positive results.",
    category: "Mindfulness",
    date: new Date().toISOString(),
    points: 12,
    metrics: [
      {
        label: "Weekly Sessions",
        value: 6,
        change: 20
      },
      {
        label: "Average Duration",
        value: "12 min",
        change: 25
      }
    ],
    recommendations: [
      "Try extending session duration gradually",
      "Practice at consistent times",
      "Explore different mindfulness techniques"
    ],
    viewed: false
  }
];

/**
 * Returns recovery insights for a patient.
 * @param {Object} patientData Patient data object
 */
export function useRecoveryInsights(patientData: any): RecoveryInsight[] {
  // TODO: Replace with actual API call using patientData
  return mockInsights;
} 