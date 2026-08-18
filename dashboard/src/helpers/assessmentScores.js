const readItem = (responses, prefix, index) =>
  responses?.[index] ?? responses?.[String(index)] ?? responses?.[`${prefix}${index}`]

export const calculatePCS4Score = (responses) => {
  if (!responses || typeof responses !== "object") return null
  const values = [1, 2, 3, 4].map((index) => Number(readItem(responses, "pcs", index)))
  return values.every((value) => Number.isFinite(value) && value >= 0 && value <= 4)
    ? values.reduce((sum, value) => sum + value, 0)
    : null
}

export const calculateTSK7Score = (responses) => {
  if (!responses || typeof responses !== "object") return null
  const reverseScored = new Set([2, 6, 7])
  const values = [1, 2, 3, 4, 5, 6, 7].map((index) => {
    const response = Number(readItem(responses, "tsk", index))
    if (!Number.isFinite(response) || response < 1 || response > 4) return null
    return reverseScored.has(index) ? 5 - response : response
  })
  return values.every((value) => value !== null)
    ? values.reduce((sum, value) => sum + value, 0)
    : null
}

export const pluralizeDay = (count) => `${count} ${count === 1 ? "day" : "days"}`

export const parseClinicalDate = (value) => {
  if (!value) return null
  const text = String(value)
  const dateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})(?:T00:00:00(?:\.000)?Z)?$/)
  const parsed = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export const calendarDaysSince = (value, now = new Date()) => {
  const parsed = parseClinicalDate(value)
  if (!parsed) return null
  const start = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.max(0, Math.round((end - start) / 86400000))
}

export const formatClinicalDate = (value, locale = "en-US") => {
  const parsed = parseClinicalDate(value)
  return parsed ? parsed.toLocaleDateString(locale) : "Unavailable"
}

export const formatRelativeClinicalDate = (value, now = new Date(), locale = "en-US") => {
  const parsed = parseClinicalDate(value)
  if (!parsed) return "Unavailable"
  const days = calendarDaysSince(parsed, now)
  if (days === 0) return "Today"
  if (days === 1) return "Yesterday"
  if (days <= 6) return `${days} days ago`
  return parsed.toLocaleDateString(locale)
}

export const parseTreatmentPlan = (treatmentPlan) => {
  if (!treatmentPlan) return { summary: "", assignedExercises: [] }
  if (typeof treatmentPlan === "object") {
    return {
      summary: typeof treatmentPlan.summary === "string" ? treatmentPlan.summary : "",
      assignedExercises: Array.isArray(treatmentPlan.assignedExercises) ? treatmentPlan.assignedExercises : [],
    }
  }
  try {
    return parseTreatmentPlan(JSON.parse(treatmentPlan))
  } catch {
    return { summary: String(treatmentPlan), assignedExercises: [] }
  }
}
