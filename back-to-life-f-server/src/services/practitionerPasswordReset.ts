import crypto from "crypto";

export interface PractitionerPasswordResetPayload {
  sub: number;
  email: string;
  type: "practitioner-password-reset";
  exp: number;
  nonce: string;
}

const RESET_TOKEN_LIFETIME_SECONDS = 30 * 60;

const encode = (value: string) => Buffer.from(value, "utf8").toString("base64url");
const decode = (value: string) => Buffer.from(value, "base64url").toString("utf8");

const getSigningKey = (passwordHash: string) => {
  const secret = process.env.PRACTITIONER_RESET_SECRET || process.env.JWT_SECRET;
  if (!secret) throw new Error("Practitioner password reset secret is not configured");
  return crypto.createHash("sha256").update(`${secret}:${passwordHash}`).digest();
};

const sign = (encodedPayload: string, passwordHash: string) =>
  crypto.createHmac("sha256", getSigningKey(passwordHash)).update(encodedPayload).digest("base64url");

export const generatePractitionerPasswordResetToken = (
  user: { id: number; email: string; password: string },
  now = Date.now()
) => {
  const payload: PractitionerPasswordResetPayload = {
    sub: user.id,
    email: user.email.trim().toLowerCase(),
    type: "practitioner-password-reset",
    exp: Math.floor(now / 1000) + RESET_TOKEN_LIFETIME_SECONDS,
    nonce: crypto.randomBytes(16).toString("hex"),
  };
  const encodedPayload = encode(JSON.stringify(payload));
  return `${encodedPayload}.${sign(encodedPayload, user.password)}`;
};

export const readPractitionerPasswordResetSubject = (token: unknown) => {
  if (typeof token !== "string" || token.length > 4096) return null;
  const [encodedPayload, signature, extra] = token.split(".");
  if (!encodedPayload || !signature || extra) return null;

  try {
    const payload = JSON.parse(decode(encodedPayload)) as PractitionerPasswordResetPayload;
    if (
      payload.type !== "practitioner-password-reset" ||
      !Number.isInteger(payload.sub) ||
      payload.sub < 1 ||
      typeof payload.email !== "string"
    ) return null;
    return { id: payload.sub, email: payload.email };
  } catch {
    return null;
  }
};

export const verifyPractitionerPasswordResetToken = (
  token: unknown,
  user: { id: number; email: string; password: string },
  now = Date.now()
) => {
  if (typeof token !== "string" || token.length > 4096) return null;
  const [encodedPayload, suppliedSignature, extra] = token.split(".");
  if (!encodedPayload || !suppliedSignature || extra) return null;

  try {
    const expectedSignature = sign(encodedPayload, user.password);
    const supplied = Buffer.from(suppliedSignature, "utf8");
    const expected = Buffer.from(expectedSignature, "utf8");
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;

    const payload = JSON.parse(decode(encodedPayload)) as PractitionerPasswordResetPayload;
    if (
      payload.type !== "practitioner-password-reset" ||
      payload.sub !== user.id ||
      payload.email !== user.email.trim().toLowerCase() ||
      !Number.isFinite(payload.exp) ||
      payload.exp < Math.floor(now / 1000)
    ) return null;
    return payload;
  } catch {
    return null;
  }
};

