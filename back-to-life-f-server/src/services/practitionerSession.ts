import type { Response } from "express";

export const PRACTITIONER_SESSION_COOKIE = "btl_practitioner_session";
export const PRACTITIONER_SESSION_MAX_AGE_MS = 60 * 60 * 1000;

const practitionerCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: PRACTITIONER_SESSION_MAX_AGE_MS,
  path: "/",
});

export const setPractitionerSessionCookie = (res: Response, token: string) => {
  res.cookie(PRACTITIONER_SESSION_COOKIE, token, practitionerCookieOptions());
};

export const clearPractitionerSessionCookie = (res: Response) => {
  const { maxAge: _maxAge, ...options } = practitionerCookieOptions();
  res.clearCookie(PRACTITIONER_SESSION_COOKIE, options);
};
