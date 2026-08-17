import bcrypt from "bcrypt";
import { timingSafeEqual } from "crypto";

const BCRYPT_ROUNDS = 12;

export const isHashedPatientPassword = (password: string) => /^\$2[aby]\$\d{2}\$/.test(password);

export const hashPatientPassword = async (password: string) => {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
};

export const verifyPatientPassword = async (storedPassword: string, suppliedPassword: string) => {
  if (isHashedPatientPassword(storedPassword)) {
    return {
      valid: await bcrypt.compare(suppliedPassword, storedPassword),
      needsUpgrade: false,
    };
  }

  // Beta accounts created before password hashing are migrated after their next
  // successful login. Keeping this compatibility path avoids locking patients out.
  const storedBuffer = Buffer.from(storedPassword);
  const suppliedBuffer = Buffer.from(suppliedPassword);
  const valid = storedBuffer.length === suppliedBuffer.length
    && timingSafeEqual(storedBuffer, suppliedBuffer);

  return { valid, needsUpgrade: valid };
};
