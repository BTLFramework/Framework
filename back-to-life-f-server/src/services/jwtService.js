"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSetupLink = exports.verifySetupToken = exports.verifyToken = exports.generatePatientToken = exports.generateSetupToken = exports.generateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SETUP_SECRET = process.env.SETUP_SECRET || 'setup-secret-key';
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: "clinician" }, JWT_SECRET, { expiresIn: "24h" });
};
exports.generateToken = generateToken;
const generateSetupToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, SETUP_SECRET, { expiresIn: "24h" });
};
exports.generateSetupToken = generateSetupToken;
const generatePatientToken = (patientPortal) => {
    return jsonwebtoken_1.default.sign({
        id: patientPortal.id,
        email: patientPortal.email,
        patientId: patientPortal.patientId,
        role: "patient"
    }, JWT_SECRET, { expiresIn: "7d" });
};
exports.generatePatientToken = generatePatientToken;
const verifyToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifyToken = verifyToken;
const verifySetupToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, SETUP_SECRET);
    }
    catch (error) {
        return null;
    }
};
exports.verifySetupToken = verifySetupToken;
const generateSetupLink = (email, patientId, baseUrl) => {
    const token = (0, exports.generateSetupToken)(email);
    return `${baseUrl}/set-password?token=${token}`;
};
exports.generateSetupLink = generateSetupLink;
