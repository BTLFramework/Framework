import jwt from "jsonwebtoken"

export const requirePractitionerAuth = (req: any, res: any, next: any) => {
  const authorization = req.headers.authorization
  const token = typeof authorization === "string" && authorization.startsWith("Bearer ")
    ? authorization.slice(7).trim()
    : ""

  if (!token) {
    return res.status(401).json({ error: "Practitioner authentication required" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error("JWT_SECRET is not configured; practitioner access is disabled")
    return res.status(503).json({ error: "Practitioner authentication is unavailable" })
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    const practitionerId = payload.userId ?? (payload.role === "clinician" ? payload.id : null)
    if (!practitionerId) {
      return res.status(403).json({ error: "Practitioner access required" })
    }
    req.practitioner = { userId: practitionerId }
    next()
  } catch {
    return res.status(401).json({ error: "Practitioner session is invalid or expired" })
  }
}
