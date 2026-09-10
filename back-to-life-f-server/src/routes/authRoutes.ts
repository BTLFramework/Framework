import express from "express";
import {
  bootstrapPractitioner,
  bootstrapStatus,
  register,
  login,
  requestPractitionerPasswordReset,
  resetPractitionerPassword,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/request-password-reset", requestPractitionerPasswordReset);
router.post("/reset-password", resetPractitionerPassword);
router.get("/bootstrap-status", bootstrapStatus);
router.post("/bootstrap", bootstrapPractitioner);

export default router;
