const { insightSequence } = require('../config/insightSequence');

const INSIGHT_ACTION_PREFIX = 'INSIGHT:';

function startOfCalendarDay(date = new Date()) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getSequentialCompletedIds(records) {
  const recordedIds = new Set(
    records
      .map(record => parseInt(record.action.replace(INSIGHT_ACTION_PREFIX, ''), 10))
      .filter(Number.isFinite)
  );

  const completedIds = [];
  for (const insightId of insightSequence) {
    if (!recordedIds.has(insightId)) break;
    completedIds.push(insightId);
  }
  return completedIds;
}

function calculateInsightStatus({ records, enrollmentDate, now = new Date() }) {
  const completedInsightIds = getSequentialCompletedIds(records);
  const today = startOfCalendarDay(now);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const completedToday = records.some(record => record.date >= today && record.date < tomorrow);

  const intakeDay = startOfCalendarDay(enrollmentDate);
  const daysSinceEnrollment = Math.max(
    0,
    Math.floor((today.getTime() - intakeDay.getTime()) / (24 * 60 * 60 * 1000))
  );
  const nextIndex = completedInsightIds.length;
  const calendarEligible = nextIndex <= daysSinceEnrollment;

  return {
    completedInsightIds,
    availableInsightId:
      !completedToday && calendarEligible && nextIndex < insightSequence.length
        ? insightSequence[nextIndex]
        : null,
    completedToday,
    daysSinceEnrollment,
    nextInsightId: insightSequence[nextIndex] || null,
    totalInsights: insightSequence.length
  };
}

module.exports = {
  INSIGHT_ACTION_PREFIX,
  calculateInsightStatus,
  getSequentialCompletedIds,
  startOfCalendarDay
};
