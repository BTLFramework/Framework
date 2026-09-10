const { insightSequence } = require('../config/insightSequence');

const INSIGHT_ACTION_PREFIX = 'INSIGHT:';
const BETA_INSIGHT_PREVIEW_EMAIL = 'spencerbarberchiro+btlbeta2@gmail.com';
const PROGRAM_TIME_ZONE = process.env.PROGRAM_TIME_ZONE || 'America/Edmonton';
const DAY_MS = 24 * 60 * 60 * 1000;

function isBetaInsightPreviewPatient(patient) {
  return String(patient?.email || '').trim().toLowerCase() === BETA_INSIGHT_PREVIEW_EMAIL;
}

function calendarDayNumber(date = new Date(), timeZone = PROGRAM_TIME_ZONE) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(new Date(date));
  const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
  return Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
}

function enrollmentDayNumber(date, timeZone = PROGRAM_TIME_ZONE) {
  const value = new Date(date);
  const isStoredDateOnly =
    value.getUTCHours() === 0 &&
    value.getUTCMinutes() === 0 &&
    value.getUTCSeconds() === 0 &&
    value.getUTCMilliseconds() === 0;
  return isStoredDateOnly
    ? Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate())
    : calendarDayNumber(value, timeZone);
}

function startOfCalendarDay(date = new Date(), timeZone = PROGRAM_TIME_ZONE) {
  return new Date(calendarDayNumber(date, timeZone));
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

function calculateInsightStatus({ records, enrollmentDate, now = new Date(), timeZone = PROGRAM_TIME_ZONE }) {
  const completedInsightIds = getSequentialCompletedIds(records);
  const todayNumber = calendarDayNumber(now, timeZone);
  const completedToday = records.some(record => calendarDayNumber(record.date, timeZone) === todayNumber);

  const intakeDayNumber = enrollmentDayNumber(enrollmentDate, timeZone);
  const daysSinceEnrollment = Math.max(
    0,
    Math.floor((todayNumber - intakeDayNumber) / DAY_MS)
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
  BETA_INSIGHT_PREVIEW_EMAIL,
  PROGRAM_TIME_ZONE,
  INSIGHT_ACTION_PREFIX,
  calendarDayNumber,
  calculateInsightStatus,
  getSequentialCompletedIds,
  isBetaInsightPreviewPatient,
  startOfCalendarDay
};
