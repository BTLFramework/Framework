export const newestFirstToChronological = (messages) =>
  Array.isArray(messages) ? [...messages].reverse() : []

export const latestChronologicalMessage = (messages) =>
  Array.isArray(messages) && messages.length > 0 ? messages[messages.length - 1] : undefined
