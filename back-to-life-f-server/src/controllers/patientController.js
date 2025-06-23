"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatient = exports.getAllPatientsWithScores = exports.getPatientLatestScore = exports.submitIntake = void 0;
const patientModel_1 = require("../models/patientModel");
const client_1 = require("@prisma/client");
const emailService_1 = require("../services/emailService");
const jwtService_1 = require("../services/jwtService");
const prisma = new client_1.PrismaClient();
// Simple phase determination function (move to helpers later)
const getPhaseByScore = (score) => {
    if (score <= 3)
        return { label: "RESET" };
    if (score <= 7)
        return { label: "EDUCATE" };
    return { label: "REBUILD" };
};
const submitIntake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('Received intake submission:', req.body);
        const { patientName, email, date, formType, region, disabilityPercentage, vas, psfs, beliefs, confidence, groc, srsScore } = req.body;
        // Check if patient already exists
        let patient = yield (0, patientModel_1.findPatientByEmail)(email);
        if (!patient) {
            console.log('Creating new patient:', patientName, email, date);
            // Create new patient
            const newPatient = yield (0, patientModel_1.createPatient)(patientName, email, new Date(date));
            console.log('Patient created:', newPatient);
            // Create patient portal account (with temporary password)
            const tempPassword = Math.random().toString(36).slice(-8); // Simple temp password
            yield (0, patientModel_1.createPatientPortalAccount)(newPatient.id, email, tempPassword);
            console.log('Patient portal account created');
            // Get the full patient record with relations
            patient = yield (0, patientModel_1.findPatientByEmail)(email);
        }
        else {
            console.log('Patient already exists:', patient);
        }
        if (!patient) {
            throw new Error('Failed to create or find patient');
        }
        // Prepare SRS data
        const srsData = {
            date: new Date(date),
            formType,
            region,
            disabilityPercentage,
            vas,
            psfs,
            beliefs,
            confidence,
            groc,
            srsScore
        };
        console.log('Adding SRS score:', srsData);
        const srsScoreRecord = yield (0, patientModel_1.addSRSScore)(patient.id, srsData);
        console.log('SRS score added:', srsScoreRecord);
        // Determine phase and send welcome email
        const phase = getPhaseByScore(srsScore);
        const firstName = patientName.split(' ')[0]; // Get first name
        // Generate setup link
        const baseUrl = process.env.PATIENT_PORTAL_URL || 'http://localhost:3001';
        const setupLink = (0, jwtService_1.generateSetupLink)(email, patient.id, baseUrl);
        // Send welcome email (using dev mode for now)
        const emailSent = yield (0, emailService_1.sendWelcomeEmailDev)({
            firstName,
            email,
            phase: phase.label,
            setupLink
        });
        res.status(201).json({
            patient,
            srsScore: srsScoreRecord,
            phase: phase.label,
            emailSent,
            setupLink: process.env.NODE_ENV === 'development' ? setupLink : undefined
        });
    }
    catch (err) {
        console.error('Error in submitIntake:', err);
        res.status(500).json({ error: err.message });
    }
});
exports.submitIntake = submitIntake;
const getPatientLatestScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const score = yield (0, patientModel_1.getLatestSRSScore)(Number(id));
        res.json(score);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getPatientLatestScore = getPatientLatestScore;
const getAllPatientsWithScores = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const patients = yield (0, patientModel_1.getAllPatientsWithLatestScores)();
        res.json(patients);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
exports.getAllPatientsWithScores = getAllPatientsWithScores;
const deletePatient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const patientId = Number(id);
    if (isNaN(patientId)) {
        return res.status(400).json({ error: "Invalid patient ID" });
    }
    try {
        console.log(`Attempting to delete patient with ID: ${patientId}`);
        // Use a transaction to ensure all or nothing is deleted
        yield prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
            // 1. Delete all related SRSScore records
            yield tx.sRSScore.deleteMany({
                where: { patientId: patientId },
            });
            console.log(`Deleted SRS scores for patient ID: ${patientId}`);
            // 2. Delete the related PatientPortal record
            yield tx.patientPortal.deleteMany({
                where: { patientId: patientId },
            });
            console.log(`Deleted patient portal account for patient ID: ${patientId}`);
            // 3. Finally, delete the patient
            yield tx.patient.delete({
                where: { id: patientId },
            });
            console.log(`Successfully deleted patient with ID: ${patientId}`);
        }));
        res.status(200).json({ message: "Patient deleted successfully" });
    }
    catch (err) {
        console.error(`Error deleting patient with ID ${patientId}:`, err);
        res.status(500).json({
            message: "Failed to delete patient due to a server error.",
            error: err.message
        });
    }
});
exports.deletePatient = deletePatient;
