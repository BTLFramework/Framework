export const authenticatedFetch = async (input, init = {}) => {
  const headers = new Headers(init.headers || {})
  headers.set("X-Requested-With", "XMLHttpRequest")
  const response = await fetch(input, {
    ...init,
    headers,
    credentials: "include",
  })

  if (response.status === 401 || response.status === 403) {
    window.location.assign("/login")
  }

  return response
}
