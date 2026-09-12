import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../db";
import { sendPractitionerPasswordResetEmail } from "../services/emailService";
import {
  generatePractitionerPasswordResetToken,
  readPractitionerPasswordResetSubject,
  verifyPractitionerPasswordResetToken,
} from "../services/practitionerPasswordReset";

const normalizeEmail = (value: unknown) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const isStrongPassword = (value: unknown) =>
  typeof value === "string" &&
  value.length >= 10 &&
  /[a-z]/.test(value) &&
  /[A-Z]/.test(value) &&
  /\d/.test(value) &&
  /[^A-Za-z0-9]/.test(value);

const resetRequestTimes = new Map<string, number>();
const RESET_REQUEST_COOLDOWN_MS = 60_000;
const RESET_RESPONSE = {
  message: "If that clinician account exists, a password reset link has been emailed.",
};

const practitionerPortalUrl = () => {
  const configured = process.env.PRACTITIONER_PORTAL_URL || "https://dashboard-three-taupe-47.vercel.app";
  try {
    const url = new URL(configured);
    return `${url.origin}${url.pathname.replace(/\/$/, "")}`;
  } catch {
    return "https://dashboard-three-taupe-47.vercel.app";
  }
};

export const bootstrapStatus = async (_req: any, res: any) => {
  try {
    const practitionerCount = await prisma.user.count();
    res.json({ setupRequired: practitionerCount === 0 });
  } catch (error) {
    console.error("Practitioner setup status error:", error);
    res.status(503).json({ error: "Unable to verify practitioner setup status" });
  }
};

export const bootstrapPractitioner = async (req: any, res: any) => {
  const email = normalizeEmail(req.body?.email);
  const password = req.body?.password;
  const jwtSecret = process.env.JWT_SECRET;

  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.status(400).json({ error: "A valid email address is required" });
    return;
  }

  if (!isStrongPassword(password)) {
    res.status(400).json({
      error: "Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol",
    });
    return;
  }

  if (!jwtSecret) {
    console.error("Practitioner bootstrap unavailable: JWT_SECRET is not configured");
    res.status(503).json({ error: "Practitioner setup is temporarily unavailable" });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.$transaction(async (tx) => {
      if (await tx.user.count() !== 0) {
        throw new Error("PRACTITIONER_ALREADY_CONFIGURED");
      }

      return tx.user.create({
        data: { email, password: hashedPassword },
        select: { id: true },
      });
    }, { isolationLevel: "Serializable" });

    const token = jwt.sign({ userId: user.id }, jwtSecret, {
      expiresIn: "1h",
    });
    res.status(201).json({ token });
  } catch (error: any) {
    if (error?.message === "PRACTITIONER_ALREADY_CONFIGURED" || error?.code === "P2002") {
      res.status(409).json({ error: "Practitioner setup has already been completed" });
      return;
    }
    console.error("Practitioner bootstrap error:", error);
    res.status(500).json({ error: "Unable to create practitioner account" });
  }
};

export const register = async (req: any, res: any) => {
  try {
    if (process.env.ALLOW_PRACTITIONER_REGISTRATION !== "true") {
      res.status(403).send("Practitioner registration is disabled")
      return
    }
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body;

    if (!email || !password) {
      res.status(400).send("Email and password are required");
      return;
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).send("User already exists");
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await prisma.user.create({ data: { email, password: hashedPassword } });

    res.status(201).send("User registered");
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send(`Internal server error: ${error}`);
  }
};

export const login = async (req: any, res: any) => {
  try {
    const email = normalizeEmail(req.body?.email);
    const { password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).send("Invalid credentials");
      return;
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).send("Internal server error");
  }
};

export const requestPractitionerPasswordReset = async (req: any, res: any) => {
  const email = normalizeEmail(req.body?.email);
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    res.json(RESET_RESPONSE);
    return;
  }

  try {
    const now = Date.now();
    const lastRequest = resetRequestTimes.get(email) || 0;
    if (now - lastRequest < RESET_REQUEST_COOLDOWN_MS) {
      res.json(RESET_RESPONSE);
      return;
    }
    resetRequestTimes.set(email, now);

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      const token = generatePractitionerPasswordResetToken(user, now);
      const resetLink = `${practitionerPortalUrl()}/reset-password?token=${encodeURIComponent(token)}`;
      const delivered = await sendPractitionerPasswordResetEmail(user.email, resetLink);
      if (!delivered) {
        res.status(503).json({
          error: "We couldn't send the reset email. Please try again shortly or contact support.",
        });
        return;
      }
    }
    res.json(RESET_RESPONSE);
  } catch (error) {
    console.error("Practitioner password reset request error:", error);
    res.json(RESET_RESPONSE);
  }
};

export const resetPractitionerPassword = async (req: any, res: any) => {
  const token = req.body?.token;
  const password = req.body?.password;
  if (!isStrongPassword(password)) {
    res.status(400).json({
      error: "Password must be at least 10 characters and include uppercase, lowercase, a number, and a symbol",
    });
    return;
  }

  const subject = readPractitionerPasswordResetSubject(token);
  if (!subject) {
    res.status(400).json({ error: "This password reset link is invalid or has expired" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: subject.id } });
    if (!user || user.email.trim().toLowerCase() !== subject.email || !verifyPractitionerPasswordResetToken(token, user)) {
      res.status(400).json({ error: "This password reset link is invalid or has expired" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const updated = await prisma.user.updateMany({
      where: { id: user.id, password: user.password },
      data: { password: hashedPassword },
    });
    if (updated.count !== 1) {
      res.status(409).json({ error: "This password reset link has already been used" });
      return;
    }
    resetRequestTimes.delete(user.email.trim().toLowerCase());
    res.json({ message: "Password updated. You can now sign in." });
  } catch (error) {
    console.error("Practitioner password reset error:", error);
    res.status(500).json({ error: "Unable to reset the password right now" });
  }
};
