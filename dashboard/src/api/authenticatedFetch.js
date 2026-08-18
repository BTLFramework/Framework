const decodeTokenPayload = (token) => {
  try {
    const encoded = token.split(".")[1]
    if (!encoded) return null
    const normalized = encoded.replace(/-/g, "+").replace(/_/g, "/")
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=")
    return JSON.parse(atob(padded))
  } catch {
    return null
  }
}

export const isPractitionerTokenValid = (token, nowSeconds = Math.floor(Date.now() / 1000)) => {
  if (!token) return false
  const payload = decodeTokenPayload(token)
  return Boolean(payload?.userId && Number(payload.exp) > nowSeconds)
}

export const clearPractitionerSession = () => {
  localStorage.removeItem("token")
}

export const getPractitionerToken = () => localStorage.getItem("token")

export const authenticatedFetch = async (input, init = {}) => {
  const token = getPractitionerToken()
  if (!isPractitionerTokenValid(token)) {
    clearPractitionerSession()
    window.location.assign("/login")
    throw new Error("Your practitioner session has expired. Please sign in again.")
  }

  const headers = new Headers(init.headers || {})
  headers.set("Authorization", `Bearer ${token}`)
  const response = await fetch(input, { ...init, headers })

  if (response.status === 401 || response.status === 403) {
    clearPractitionerSession()
    window.location.assign("/login")
  }

  return response
}
