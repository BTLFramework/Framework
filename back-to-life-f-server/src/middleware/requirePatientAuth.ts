import jwt from "jsonwebtoken"

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : ""

const readBearerToken = (req: any) => {
  const authorization = String(req.headers?.authorization || "")
  const match = authorization.match(/^Bearer\s+(.+)$/i)
  return match?.[1]?.trim() || ""
}

const authenticatePatient = (req: any, res: any) => {
  const token = req.cookies?.patientToken || readBearerToken(req)
  if (!token) {
    res.status(401).json({ error: "Patient authentication required" })
    return false
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    console.error("JWT_SECRET is not configured; patient access is disabled")
    res.status(503).json({ error: "Patient authentication is unavailable" })
    return false
  }

  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload
    const authenticatedPatientId = Number(payload.patientId)
    const authenticatedEmail = normalizeEmail(payload.email)

    if (
      payload.role !== "patient" ||
      !Number.isInteger(authenticatedPatientId) ||
      authenticatedPatientId <= 0 ||
      !authenticatedEmail
    ) {
      res.status(403).json({ error: "Patient access required" })
      return false
    }

    req.patient = { patientId: authenticatedPatientId, email: authenticatedEmail }
    return true
  } catch {
    res.status(401).json({ error: "Patient session is invalid or expired" })
    return false
  }
}

export const requirePatientSession = (req: any, res: any, next: any) => {
  if (authenticatePatient(req, res)) next()
}

export const requirePatientAccess = (req: any, res: any, next: any) => {
  if (!authenticatePatient(req, res)) return

  const authenticatedPatientId = req.patient.patientId
  const authenticatedEmail = req.patient.email
  const requestedIdentity =
    req.params?.patientId ??
    req.params?.id ??
    req.params?.email ??
    req.body?.patientId ??
    req.body?.email

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

  next()
}
