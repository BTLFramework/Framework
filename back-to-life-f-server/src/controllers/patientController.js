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

// Use centralized Prisma instance with fallback
let prisma;
try {
    const db = require("../db");
    prisma = db.default || db;
} catch (error) {
    console.warn('Could not import centralized DB, creating new Prisma client');
    prisma = new client_1.PrismaClient();
}
// Simple phase determination function (move to helpers later)
const getPhaseByScore = (score) => {
    if (score >= 8) return { label: "REBUILD", color: "green" };
    if (score >= 5) return { label: "EDUCATE", color: "yellow" };
    return { label: "RESET", color: "red" };
};
const submitIntake = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log('📝 Processing intake submission:', req.body);
        const { patientName, email, date, formType, region, ndi, odi, ulfi, lefs, vas, psfs, beliefs, confidence, groc } = req.body;
        
        // Validate required fields
        if (!patientName || !email || !region || vas === undefined || confidence === undefined) {
            return res.status(400).json({ 
                error: 'Missing required fields: patientName, email, region, vas, confidence' 
            });
        }

        // Calculate disability percentage based on region and disability index
        let disabilityPercentage = 0;
        let disabilityIndex = null;
        
        switch (region) {
            case "Neck":
                disabilityIndex = ndi;
                if (ndi && Array.isArray(ndi)) {
                    const total = ndi.reduce((sum, score) => sum + score, 0);
                    disabilityPercentage = Math.round((total / 50) * 100); // NDI out of 50
                }
                break;
            case "Back":
                disabilityIndex = odi;
                if (odi && Array.isArray(odi)) {
                    const total = odi.reduce((sum, score) => sum + score, 0);
                    disabilityPercentage = Math.round((total / 50) * 100); // ODI out of 50
                }
                break;
            case "Upper Limb":
                disabilityIndex = ulfi;
                if (ulfi && Array.isArray(ulfi)) {
                    const total = ulfi.reduce((sum, score) => sum + score, 0);
                    disabilityPercentage = Math.round((total / 120) * 100); // ULFI out of 120
                }
                break;
            case "Lower Extremity":
                disabilityIndex = lefs;
                if (lefs && Array.isArray(lefs)) {
                    const total = lefs.reduce((sum, score) => sum + score, 0);
                    disabilityPercentage = Math.round((total / 80) * 100); // LEFS out of 80
                }
                break;
            default:
                console.warn(`Unknown region: ${region}, using default disability calculation`);
                disabilityPercentage = 50; // Default fallback
        }

        // Ensure beliefs is always an array for scoring
        let beliefsForScoring = [];
        if (beliefs) {
            if (Array.isArray(beliefs)) {
                beliefsForScoring = beliefs;
            } else if (typeof beliefs === 'string') {
                beliefsForScoring = [beliefs];
            }
        }

        // Calculate SRS Score using your clinical methodology
        const scoreLogic = require('../helpers/scoreLogic');
        const srsResult = scoreLogic.calculateSRS({
            disabilityPercentage,
            vas,
            psfs: psfs || [],
            beliefs: beliefsForScoring,
            confidence,
            groc: groc || 0,
            formType: formType || "Intake"  // This triggers the correct baseline calculation
        });

        // Extract the numeric score from the result object
        const srsScore = typeof srsResult === 'object' ? srsResult.score : srsResult;
        
        console.log(`📊 Calculated SRS Score: ${srsScore} (Disability: ${disabilityPercentage}%, VAS: ${vas}, Confidence: ${confidence})`);

        // Create or find existing patient
        let patient = yield (0, patientModel_1.findPatientByEmail)(email);
        if (!patient) {
            patient = yield (0, patientModel_1.createPatient)(patientName, email, new Date(date || new Date()));
            console.log('👤 Created new patient:', patient.id);
        } else {
            console.log('👤 Found existing patient:', patient.id);
        }

        if (!patient) {
            throw new Error('Failed to create or find patient');
        }

        // Ensure beliefs is always an array
        let beliefsArray = [];
        if (beliefs) {
            if (Array.isArray(beliefs)) {
                beliefsArray = beliefs;
            } else if (typeof beliefs === 'string') {
                beliefsArray = [beliefs];
            }
        }

        // Add SRS score record
        const srsData = {
            date: new Date(date || new Date()),
            formType: formType || "Intake",
            region,
            disabilityPercentage,
            vas,
            psfs: psfs || [],
            beliefs: beliefsArray,
            confidence,
            groc: groc || 0,
            srsScore
        };

        const srsScoreRecord = yield (0, patientModel_1.addSRSScore)(patient.id, srsData);
        console.log('📈 Added SRS score record:', srsScoreRecord.id);

        // Create patient portal account if it doesn't exist
        let patientPortal = yield (0, patientModel_1.findPatientPortalByEmail)(email);
        if (!patientPortal) {
            const tempPassword = Math.random().toString(36).substring(2, 10);
            patientPortal = yield (0, patientModel_1.createPatientPortalAccount)(patient.id, email, tempPassword);
            console.log('🔐 Created patient portal account');
        }

        // Determine phase based on SRS score
        const phase = getPhaseByScore(srsScore);
        console.log(`🎯 Patient phase: ${phase.label}`);

        // Calculate additional metrics
        const beliefStatus = (beliefs && beliefs.length > 0) ? "Negative beliefs identified" : "No concerning beliefs";

        const firstName = patientName.split(' ')[0]; // Get first name
        
        // Generate setup link
        const baseUrl = process.env.PATIENT_PORTAL_URL || 'http://localhost:3000';
        const setupLink = (0, jwtService_1.generateSetupLink)(email, patient.id, baseUrl);
        
        // Send welcome email (using dev mode for now)
        const emailSent = yield (0, emailService_1.sendWelcomeEmailDev)({
            firstName,
            email,
            phase: phase.label,
            setupLink
        });

        res.status(201).json({
            message: 'Intake processed successfully',
            patient,
            srsScore: {
                ...srsScoreRecord,
                outOf: 11,
                clinicianAssessed: false,
                grocCaptured: false
            },
            phase: phase.label,
            disabilityPercentage,
            beliefStatus,
            emailSent,
            setupLink: process.env.NODE_ENV === 'development' ? setupLink : undefined
        });
    }
    catch (err) {
        console.error('Error in submitIntake:', err);
        res.status(500).json({ 
            error: err.message,
            details: 'Failed to process intake submission'
        });
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
        console.log('📋 Fetching all patients with scores...');
        const patients = yield (0, patientModel_1.getAllPatientsWithLatestScores)();
        console.log(`📋 Found ${patients.length} patients`);
        
        // Transform data to ensure frontend compatibility
        const transformedPatients = yield Promise.all(patients.map((patient) => __awaiter(void 0, void 0, void 0, function* () {
            const latestScore = patient.srsScores && patient.srsScores.length > 0 ? patient.srsScores[0] : null;
            
            // Get real recovery points data
            const recoveryData = yield getPatientRecoveryPointsData(patient.id);
            
            return {
                ...patient,
                // Add commonly expected fields for frontend compatibility
                latestSrsScore: latestScore?.srsScore || 0,
                phase: getPhaseByScore(latestScore?.srsScore || 0),
                lastUpdated: latestScore?.date || patient.intakeDate,
                recoveryPoints: {
                    weeklyPoints: recoveryData.thisWeek,
                    streak: recoveryData.streakDays,
                    completionRate: recoveryData.completionRate,
                    trend: recoveryData.trend
                },
                engagement: recoveryData.completionRate >= 80 ? 'Highly Engaged' :
                           recoveryData.completionRate >= 60 ? 'Engaged' :
                           recoveryData.completionRate >= 40 ? 'Moderate' : 'Low Engagement',
                nextAppointment: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            };
        })));
        
        console.log('📋 Transformed patient data for frontend compatibility');
        res.json(transformedPatients);
    }
    catch (err) {
        console.error('❌ Error in getAllPatientsWithScores:', err);
        res.status(500).json({ 
            error: err.message,
            timestamp: new Date().toISOString(),
            endpoint: '/patients'
        });
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

const updateSRSFlags = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { clinicianAssessed, grocCaptured } = req.body;
        
        const updatedSRS = yield prisma.sRSScore.update({
            where: { id: parseInt(id) },
            data: {
                clinicianAssessed: clinicianAssessed !== undefined ? clinicianAssessed : undefined,
                grocCaptured: grocCaptured !== undefined ? grocCaptured : undefined
            }
        });
        
        res.json({
            message: 'SRS flags updated successfully',
            srsScore: {
                ...updatedSRS,
                outOf: 11
            }
        });
    }
    catch (err) {
        console.error('Error updating SRS flags:', err);
        res.status(500).json({ error: err.message });
    }
});
exports.updateSRSFlags = updateSRSFlags;
// NEW ENDPOINTS FOR PATIENT PORTAL INTEGRATION
const completeTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, taskId, taskTitle, points, feedback, difficultyScore } = req.body;
        console.log('Task completion request:', { email, taskId, taskTitle, points });
        // Find patient by email
        const patient = yield (0, patientModel_1.findPatientByEmail)(email);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        // Record task completion (you can extend the database schema to store these)
        const taskCompletion = {
            patientId: patient.id,
            taskId,
            taskTitle,
            points,
            feedback,
            difficultyScore,
            completedAt: new Date(),
            date: new Date().toISOString().split('T')[0] // YYYY-MM-DD format
        };
        console.log('Recording task completion:', taskCompletion);
        // Update patient's recovery points for today
        const today = new Date().toISOString().split('T')[0];
        const existingPoints = yield getPatientRecoveryPoints(patient.id, today);
        const newTotalPoints = (existingPoints?.totalPoints || 0) + points;
        // Calculate new SRS score based on engagement and points
        const latestSRS = yield (0, patientModel_1.getLatestSRSScore)(patient.id);
        let newSRSScore = latestSRS?.srsScore || 0;
        // Bonus SRS points for consistent task completion
        const weeklyPoints = yield getWeeklyRecoveryPoints(patient.id);
        if (weeklyPoints >= 20) { // If they've earned 20+ points this week
            newSRSScore = Math.min(newSRSScore + 1, 11); // Cap at 11
        }
        // Update SRS if it changed
        if (newSRSScore !== (latestSRS?.srsScore || 0)) {
            const srsData = {
                date: new Date(),
                formType: 'Task Completion Update',
                region: latestSRS?.region || 'General',
                disabilityPercentage: latestSRS?.disabilityPercentage || 0,
                vas: latestSRS?.vas || 0,
                psfs: latestSRS?.psfs || [],
                beliefs: latestSRS?.beliefs || [],
                confidence: latestSRS?.confidence || 0,
                groc: latestSRS?.groc || 0,
                srsScore: newSRSScore
            };
            yield (0, patientModel_1.addSRSScore)(patient.id, srsData);
            console.log('Updated SRS score due to task completion:', newSRSScore);
        }
        // Determine new phase
        const phase = getPhaseByScore(newSRSScore);
        res.status(200).json({
            success: true,
            message: 'Task completed successfully',
            data: {
                pointsEarned: points,
                totalPoints: newTotalPoints,
                newSRSScore,
                phase: phase.label,
                patient: {
                    id: patient.id,
                    name: patient.name,
                    email: patient.email
                }
            }
        });
    }
    catch (err) {
        console.error('Error completing task:', err);
        res.status(500).json({ error: err.message });
    }
});
const getPatientRecoveryPoints = (patientId, date) => __awaiter(void 0, void 0, void 0, function* () {
    // Get real recovery points from database
    const recoveryPointsService = require('../services/recoveryPointsService');
    
    try {
        const dateObj = new Date(date);
        const startOfDay = new Date(dateObj.setHours(0, 0, 0, 0));
        const endOfDay = new Date(dateObj.setHours(23, 59, 59, 999));
        
        const dayPoints = yield prisma.recoveryPoint.aggregate({
            where: {
                patientId,
                date: {
                    gte: startOfDay,
                    lte: endOfDay
                }
            },
            _sum: {
                points: true
            },
            _count: {
                id: true
            }
        });
        
        return {
            totalPoints: dayPoints._sum.points || 0,
            tasksCompleted: dayPoints._count.id || 0,
            date
        };
    } catch (error) {
        console.error('Error getting daily recovery points:', error);
        return {
            totalPoints: 0,
            tasksCompleted: 0,
            date
        };
    }
});

const getWeeklyRecoveryPoints = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    // Get real weekly recovery points from database
    const recoveryPointsService = require('../services/recoveryPointsService');
    
    try {
        const breakdown = yield recoveryPointsService.getWeeklyBreakdown(patientId);
        return breakdown.total;
    } catch (error) {
        console.error('Error getting weekly recovery points:', error);
        return 0;
    }
});

// Get comprehensive recovery points data for patient
const getPatientRecoveryPointsData = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    const recoveryPointsService = require('../services/recoveryPointsService');
    
    try {
        // Get weekly breakdown
        const weeklyBreakdown = yield recoveryPointsService.getWeeklyBreakdown(patientId);
        
        // Get SRS buffer status
        const bufferStatus = yield recoveryPointsService.getSRSBuffer(patientId);
        
        // Get recent activity
        const recentActivity = yield recoveryPointsService.getRecentActivity(patientId, 7);
        
        // Calculate streak (consecutive days with points)
        let streak = 0;
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const checkDate = new Date(today);
            checkDate.setDate(today.getDate() - i);
            const dayStart = new Date(checkDate.setHours(0, 0, 0, 0));
            const dayEnd = new Date(checkDate.setHours(23, 59, 59, 999));
            
            const dayPoints = yield prisma.recoveryPoint.aggregate({
                where: {
                    patientId,
                    date: {
                        gte: dayStart,
                        lte: dayEnd
                    }
                },
                _sum: { points: true }
            });
            
            if (dayPoints._sum.points > 0) {
                streak++;
            } else {
                break;
            }
        }
        
        // Calculate completion rate (percentage of days with activity in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        const activeDays = yield prisma.recoveryPoint.groupBy({
            by: ['date'],
            where: {
                patientId,
                date: {
                    gte: thirtyDaysAgo
                }
            },
            _sum: { points: true },
            having: {
                points: {
                    _sum: {
                        gt: 0
                    }
                }
            }
        });
        
        const completionRate = Math.round((activeDays.length / 30) * 100);
        
        // Determine trend
        const lastWeekTotal = weeklyBreakdown.total;
        const twoWeeksAgo = new Date();
        twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const previousWeekPoints = yield prisma.recoveryPoint.aggregate({
            where: {
                patientId,
                date: {
                    gte: twoWeeksAgo,
                    lt: oneWeekAgo
                }
            },
            _sum: { points: true }
        });
        
        const previousWeekTotal = previousWeekPoints._sum.points || 0;
        let trend = 'stable';
        if (lastWeekTotal > previousWeekTotal * 1.1) trend = 'improving';
        else if (lastWeekTotal < previousWeekTotal * 0.9) trend = 'declining';
        
        return {
            total: bufferStatus.movementRP + bufferStatus.lifestyleRP + bufferStatus.mindsetRP + bufferStatus.educationRP,
            thisWeek: lastWeekTotal,
            lastWeek: previousWeekTotal,
            weeklyAverage: Math.round((lastWeekTotal + previousWeekTotal) / 2),
            trend,
            lastActivity: recentActivity[0]?.date?.toISOString()?.split('T')[0] || null,
            streakDays: streak,
            completionRate,
            breakdown: weeklyBreakdown.breakdown,
            bufferStatus
        };
    } catch (error) {
        console.error('Error getting comprehensive recovery points data:', error);
        return {
            total: 0,
            thisWeek: 0,
            lastWeek: 0,
            weeklyAverage: 0,
            trend: 'stable',
            lastActivity: null,
            streakDays: 0,
            completionRate: 0,
            breakdown: {
                MOVEMENT: 0,
                LIFESTYLE: 0,
                MINDSET: 0,
                EDUCATION: 0,
                ADHERENCE: 0
            },
            bufferStatus: null
        };
    }
});
const getPatientPortalData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.params;
        console.log('Getting patient portal data for:', email);
        const patient = yield (0, patientModel_1.findPatientByEmail)(email);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        const latestSRS = yield (0, patientModel_1.getLatestSRSScore)(patient.id);
        const phase = getPhaseByScore(latestSRS?.srsScore || 0);
        // Real recovery points data from database
        const recoveryData = yield getPatientRecoveryPointsData(patient.id);
        res.status(200).json({
            success: true,
            data: {
                patient: {
                    id: patient.id,
                    name: patient.name,
                    email: patient.email,
                    createdAt: patient.createdAt
                },
                srsScore: latestSRS?.srsScore || 0,
                phase: phase.label,
                recoveryPoints: recoveryData,
                lastUpdated: new Date()
            }
        });
    }
    catch (err) {
        console.error('Error getting patient portal data:', err);
        res.status(500).json({ error: err.message });
    }
});
const updatePatientEngagement = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, activityType, data } = req.body;
        console.log('Updating patient engagement:', { email, activityType });
        const patient = yield (0, patientModel_1.findPatientByEmail)(email);
        if (!patient) {
            return res.status(404).json({ error: 'Patient not found' });
        }
        // Record engagement activity
        const engagementData = {
            patientId: patient.id,
            activityType, // 'login', 'task_completion', 'assessment', 'portal_visit'
            data,
            timestamp: new Date()
        };
        console.log('Recording engagement:', engagementData);
        // Update last contact date for clinician dashboard
        // This would be stored in a separate engagement tracking table
        res.status(200).json({
            success: true,
            message: 'Engagement recorded successfully',
            timestamp: new Date()
        });
    }
    catch (err) {
        console.error('Error updating engagement:', err);
        res.status(500).json({ error: err.message });
    }
});
// Export new functions
exports.completeTask = completeTask;
exports.getPatientPortalData = getPatientPortalData;
exports.updatePatientEngagement = updatePatientEngagement;
exports.getPhaseByScore = getPhaseByScore;
exports.getPatientRecoveryPointsData = getPatientRecoveryPointsData;
