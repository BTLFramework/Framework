import jwt from "jsonwebtoken"

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : ""

export const requirePatientAccess = (req: any, res: any, next: any) => {
  const token = req.cookies?.patientToken
  if (!token) {
    return res.status(401).json({ error: "Patient authentication required" })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error("JWT_SECRET is not configured; patient access is disabled")
    return res.status(503).json({ error: "Patient authentication is unavailable" })
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    const authenticatedPatientId = Number(payload.patientId)
    const authenticatedEmail = normalizeEmail(payload.email)
    const requestedIdentity =
      req.params?.patientId ??
      req.params?.id ??
      req.params?.email ??
      req.body?.patientId ??
      req.body?.email

    if (
      payload.role !== "patient" ||
      !Number.isInteger(authenticatedPatientId) ||
      authenticatedPatientId <= 0 ||
      !authenticatedEmail
    ) {
      return res.status(403).json({ error: "Patient access required" })
    }

    const requestedPatientId = Number(requestedIdentity)
    const requestedEmail = normalizeEmail(requestedIdentity)
    const identityMatches = Number.isInteger(requestedPatientId) && requestedPatientId > 0
      ? authenticatedPatientId === requestedPatientId
      : requestedEmail.includes("@") && authenticatedEmail === requestedEmail

    if (!requestedIdentity || (!Number.isInteger(requestedPatientId) && !requestedEmail.includes("@"))) {
      return res.status(400).json({ error: "A valid patient identity is required" })
    }
    if (!identityMatches) {
      return res.status(403).json({ error: "This patient record is not available to this account" })
    }

    req.patient = { patientId: authenticatedPatientId, email: authenticatedEmail }
    next()
  } catch {
    return res.status(401).json({ error: "Patient session is invalid or expired" })
  }
}
