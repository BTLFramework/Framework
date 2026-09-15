import crypto from "crypto";
import prisma from "../db";
import { hashPatientPassword } from "./patientPasswordService";

const SETUP_TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000;

const normalizeEmail = (value: string) => value.trim().toLowerCase();
const tokenHash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

export interface PatientSetupIdentity {
  patientId: number;
  email: string;
  patientName: string;
  expiresAt: Date;
}

export const issuePatientSetupToken = async (
  patientId: number,
  now = new Date()
) => {
  const token = crypto.randomBytes(32).toString("base64url");
  const expiresAt = new Date(now.getTime() + SETUP_TOKEN_LIFETIME_MS);

  await prisma.$transaction(async (tx) => {
    await tx.patientSetupToken.updateMany({
      where: { patientId, usedAt: null },
      data: { usedAt: now },
    });
    await tx.patientSetupToken.create({
      data: { patientId, tokenHash: tokenHash(token), expiresAt },
    });
  });

  return token;
};

export const verifyPatientSetupToken = async (
  token: unknown,
  now = new Date()
): Promise<PatientSetupIdentity | null> => {
  if (typeof token !== "string" || token.length < 32 || token.length > 256) return null;

  const record = await prisma.patientSetupToken.findUnique({
    where: { tokenHash: tokenHash(token) },
    include: {
      patient: {
        select: { id: true, email: true, name: true, portalAccount: { select: { email: true } } },
      },
    },
  });

  if (!record || record.usedAt || record.expiresAt <= now || !record.patient.portalAccount) return null;

  return {
    patientId: record.patientId,
    email: normalizeEmail(record.patient.portalAccount.email),
    patientName: record.patient.name,
    expiresAt: record.expiresAt,
  };
};

export const consumePatientSetupToken = async (
  token: unknown,
  password: string,
  expected?: { email?: string; patientName?: string },
  now = new Date()
) => {
  if (typeof token !== "string" || token.length < 32 || token.length > 256) return null;
  const passwordHash = await hashPatientPassword(password);
  const hash = tokenHash(token);

  return prisma.$transaction(async (tx) => {
    const record = await tx.patientSetupToken.findUnique({
      where: { tokenHash: hash },
      include: {
        patient: {
          select: { id: true, name: true, portalAccount: { select: { email: true } } },
        },
      },
    });

    if (!record || record.usedAt || record.expiresAt <= now || !record.patient.portalAccount) return null;

    const email = normalizeEmail(record.patient.portalAccount.email);
    if (expected?.email && normalizeEmail(expected.email) !== email) return null;
    if (
      expected?.patientName &&
      expected.patientName.trim().toLowerCase() !== record.patient.name.trim().toLowerCase()
    ) return null;

    const consumed = await tx.patientSetupToken.updateMany({
      where: { id: record.id, usedAt: null, expiresAt: { gt: now } },
      data: { usedAt: now },
    });
    if (consumed.count !== 1) return null;

    await tx.patientPortal.update({
      where: { patientId: record.patientId },
      data: { password: passwordHash },
    });

    return { patientId: record.patientId, email, patientName: record.patient.name };
  });
};
