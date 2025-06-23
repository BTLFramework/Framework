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
exports.deletePatient = exports.getAllPatientsWithScores = exports.getPatientLatestScore = exports.submitIntake = exports.getAllPatientsWithLatestScores = exports.getLatestSRSScore = exports.addSRSScore = exports.updatePatientPortalPassword = exports.findPatientPortalByEmail = exports.findPatientByEmail = exports.createPatientPortalAccount = exports.createPatient = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPatient = (name, email, intakeDate) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patient.create({
        data: {
            name,
            email,
            intakeDate
        }
    });
});
exports.createPatient = createPatient;
const createPatientPortalAccount = (patientId, email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patientPortal.create({
        data: {
            patientId,
            email,
            password // Note: This should be hashed in production
        }
    });
});
exports.createPatientPortalAccount = createPatientPortalAccount;
const findPatientByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patient.findUnique({
        where: { email },
        include: {
            srsScores: {
                orderBy: { date: "desc" },
                take: 1,
            },
            portalAccount: true
        }
    });
});
exports.findPatientByEmail = findPatientByEmail;
const findPatientPortalByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patientPortal.findFirst({
        where: { email },
        include: {
            patient: true,
        },
    });
});
exports.findPatientPortalByEmail = findPatientPortalByEmail;
const updatePatientPortalPassword = (email, password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patientPortal.update({
        where: { email },
        data: { password },
    });
});
exports.updatePatientPortalPassword = updatePatientPortalPassword;
const addSRSScore = (patientId, data) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.sRSScore.create({ data: Object.assign(Object.assign({}, data), { patientId }) });
});
exports.addSRSScore = addSRSScore;
const getLatestSRSScore = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.sRSScore.findFirst({
        where: { patientId },
        orderBy: { date: "desc" },
    });
});
exports.getLatestSRSScore = getLatestSRSScore;
const getAllPatientsWithLatestScores = () => __awaiter(void 0, void 0, void 0, function* () {
    const patients = yield prisma.patient.findMany({
        include: {
            srsScores: {
                orderBy: { date: "desc" },
                take: 1,
            },
        },
    });
    return patients;
});
exports.getAllPatientsWithLatestScores = getAllPatientsWithLatestScores;
const submitIntake = (intakeData) => __awaiter(void 0, void 0, void 0, function* () {
    const { patientName, email, date, formType, region, disabilityPercentage, vas, psfs, beliefs, confidence, groc, srsScore, } = intakeData;
    // Create patient
    const patient = yield prisma.patient.create({
        data: {
            name: patientName,
            email: email,
            intakeDate: new Date(date),
        },
    });
    // Create patient portal account
    const tempPassword = Math.random().toString(36).substring(2, 10);
    const patientPortal = yield prisma.patientPortal.create({
        data: {
            patientId: patient.id,
            email: email,
            password: tempPassword,
        },
    });
    // Create SRS score
    const srsScoreRecord = yield prisma.sRSScore.create({
        data: {
            patientId: patient.id,
            date: new Date(date),
            formType,
            region,
            disabilityPercentage,
            vas,
            psfs: psfs,
            beliefs: beliefs,
            confidence,
            groc,
            srsScore,
        },
    });
    return { patient, srsScore: srsScoreRecord, patientPortal };
});
exports.submitIntake = submitIntake;
const getPatientLatestScore = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.sRSScore.findFirst({
        where: { patientId },
        orderBy: { date: "desc" },
    });
});
exports.getPatientLatestScore = getPatientLatestScore;
const getAllPatientsWithScores = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma.patient.findMany({
        include: {
            srsScores: {
                orderBy: { date: "desc" },
                take: 1,
            },
            portalAccount: true,
        },
    });
});
exports.getAllPatientsWithScores = getAllPatientsWithScores;
const deletePatient = (patientId) => __awaiter(void 0, void 0, void 0, function* () {
    // Delete related records first
    yield prisma.sRSScore.deleteMany({
        where: { patientId },
    });
    yield prisma.patientPortal.deleteMany({
        where: { patientId },
    });
    // Delete patient
    return yield prisma.patient.delete({
        where: { id: patientId },
    });
});
exports.deletePatient = deletePatient;
