import express from "express";
import {
  bootstrapPractitioner,
  bootstrapStatus,
  register,
  login,
} from "../controllers/authController";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/bootstrap-status", bootstrapStatus);
router.post("/bootstrap", bootstrapPractitioner);

export default router;
