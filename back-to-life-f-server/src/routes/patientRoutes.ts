import { Router } from "express";
import { submitIntake, getPatientLatestScore, getAllPatientsWithScores, deletePatient } from "../controllers/patientController";

const router = Router();

// Add logging middleware to this router
router.use((req, res, next) => {
  console.log(`PatientRoutes: ${req.method} ${req.path}`);
  next();
});

router.post("/submit-intake", submitIntake);
router.get("/patient/:id/score", getPatientLatestScore);
router.get("/", getAllPatientsWithScores);
router.delete("/:id", deletePatient);

export default router; 