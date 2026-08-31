import { calendarDaysSince } from "./assessmentScores.js"

export function getEngagementStatus(recoveryPoints, intakeDate, now = new Date()) {
  if (!recoveryPoints) return "unknown"

  const daysSinceIntake = calendarDaysSince(intakeDate, now)
  if (daysSinceIntake === null || !Number.isFinite(daysSinceIntake)) return "unknown"
  if (daysSinceIntake < 7) return "new_patient"

  const completionRate = Number(recoveryPoints.completionRate) || 0
  const trend = recoveryPoints.trend || "stable"
  const streakDays = Number(recoveryPoints.streakDays ?? recoveryPoints.streak) || 0

  if (completionRate >= 80 && streakDays >= 5) return "highly_engaged"
  if (completionRate >= 60 && trend !== "declining") return "engaged"
  if (completionRate >= 40 || trend === "improving") return "moderate"
  return "low_engagement"
}

export function isLowEngagement(recoveryPoints, intakeDate, now = new Date()) {
  return getEngagementStatus(recoveryPoints, intakeDate, now) === "low_engagement"
}
