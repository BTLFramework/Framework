import jwt from "jsonwebtoken"

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
    const requestedPatientId = Number(req.params?.patientId ?? req.body?.patientId)

    if (payload.role !== "patient" || !Number.isInteger(authenticatedPatientId)) {
      return res.status(403).json({ error: "Patient access required" })
    }
    if (!Number.isInteger(requestedPatientId) || requestedPatientId <= 0) {
      return res.status(400).json({ error: "A valid patient ID is required" })
    }
    if (authenticatedPatientId !== requestedPatientId) {
      return res.status(403).json({ error: "This patient record is not available to this account" })
    }

    req.patient = { patientId: authenticatedPatientId, email: payload.email }
    next()
  } catch {
    return res.status(401).json({ error: "Patient session is invalid or expired" })
  }
}
