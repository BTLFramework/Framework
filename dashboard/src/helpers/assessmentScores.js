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
