const readItem = (responses, prefix, index) =>
  responses?.[index] ?? responses?.[String(index)] ?? responses?.[`${prefix}${index}`]

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
