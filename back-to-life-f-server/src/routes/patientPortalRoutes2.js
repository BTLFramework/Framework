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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwtService_1 = require("../services/jwtService");
const patientModel_1 = require("../models/patientModel");
const router = express_1.default.Router();
// Verify setup token and get patient info
router.get('/verify-setup-token/:token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const payload = (0, jwtService_1.verifySetupToken)(token);
        if (!payload) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        const patientPortal = yield (0, patientModel_1.findPatientPortalByEmail)(payload.email);
        if (!patientPortal) {
            return res.status(404).json({ error: 'Patient portal account not found' });
        }
        res.json({
            email: payload.email,
            patientName: patientPortal.patient.name,
            isValid: true
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Set password for patient portal
router.post('/set-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token, password } = req.body;
        if (!token || !password) {
            return res.status(400).json({ error: 'Token and password are required' });
        }
        const payload = (0, jwtService_1.verifySetupToken)(token);
        if (!payload) {
            return res.status(400).json({ error: 'Invalid or expired token' });
        }
        // Update password
        yield (0, patientModel_1.updatePatientPortalPassword)(payload.email, password);
        res.json({
            message: 'Password set successfully',
            email: payload.email
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Patient login
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        const patientPortal = yield (0, patientModel_1.findPatientPortalByEmail)(email);
        if (!patientPortal) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        if (patientPortal.password !== password) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        // Generate JWT token for patient
        const { generatePatientToken } = require('../services/jwtService');
        const token = generatePatientToken(patientPortal);
        // Set JWT as HTTP-only cookie
        res.cookie('patientToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
            path: '/',
        });
        res.json({
            message: 'Login successful',
            patient: patientPortal.patient
            // Do NOT include token here
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
router.get("/profile", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Read token from cookie instead of Authorization header
        const token = req.cookies.patientToken;
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const { verifyToken } = require('../services/jwtService');
        const payload = verifyToken(token);
        if (!payload || payload.role !== 'patient') {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const patientPortal = yield (0, patientModel_1.findPatientPortalByEmail)(payload.email);
        if (!patientPortal) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        // Include SRS scores in the response
        const { PrismaClient } = require('@prisma/client');
        const prisma = new PrismaClient();
        const patientWithScores = yield prisma.patient.findUnique({
            where: { id: patientPortal.patientId },
            include: {
                srsScores: {
                    orderBy: { date: 'desc' }
                }
            }
        });
        res.json(patientWithScores);
    }
    catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
}));
// Patient logout
router.post('/logout', (req, res) => {
    res.clearCookie('patientToken', { path: '/' });
    res.json({ message: 'Logged out' });
});
exports.default = router;
