import express from "express";
import {
  bootstrapPractitioner,
  bootstrapStatus,
  register,
  login,
  requestPractitionerPasswordReset,
  resetPractitionerPassword,
} from "../controllers/authController";
import { createRateLimit } from "../middleware/rateLimit";

const router = express.Router();
const loginRateLimit = createRateLimit({
  windowMs: 15 * 60_000,
  max: 20,
  message: "Too many sign-in attempts. Please wait and try again.",
  key: (req) => `${req.ip}:${String(req.body?.email || '').trim().toLowerCase()}`,
});

router.post("/register", register);
router.post("/login", loginRateLimit, login);
router.post("/request-password-reset", requestPractitionerPasswordReset);
router.post("/reset-password", resetPractitionerPassword);
router.get("/bootstrap-status", bootstrapStatus);
router.post("/bootstrap", bootstrapPractitioner);

export default router;
