"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const patientController_1 = require("../controllers/patientController");
const router = (0, express_1.Router)();

// Core patient routes
router.post("/submit-intake", patientController_1.submitIntake);
router.get("/patient/:id/score", patientController_1.getPatientLatestScore);
router.get("/", patientController_1.getAllPatientsWithScores);
router.delete("/:id", patientController_1.deletePatient);

// SRS locked flags management
router.patch("/srs/:id", patientController_1.updateSRSFlags);

// Patient portal integration routes
router.post("/complete-task", patientController_1.completeTask);
router.get("/portal-data/:email", patientController_1.getPatientPortalData);
router.post("/update-engagement", patientController_1.updatePatientEngagement);

exports.default = router;
