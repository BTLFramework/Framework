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
exports.sendWelcomeEmailDev = exports.sendWelcomeEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Email templates
const emailTemplates = JSON.parse(fs_1.default.readFileSync(path_1.default.join(__dirname, '../../config/emailTemplates.json'), 'utf8'));
// Create transporter (for development, using Gmail)
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-app-password'
    }
});
const sendWelcomeEmail = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const template = emailTemplates[emailData.phase] || emailTemplates['RESET'];
        // Replace placeholders in template
        let subject = template.subject.replace('{{firstName}}', emailData.firstName);
        let body = template.body
            .replace(/{{firstName}}/g, emailData.firstName)
            .replace('{{setupLink}}', emailData.setupLink);
        const mailOptions = {
            from: process.env.EMAIL_USER || 'noreply@backtolife.com',
            to: emailData.email,
            subject: subject,
            text: body,
            html: body.replace(/\n/g, '<br>')
        };
        yield transporter.sendMail(mailOptions);
        console.log(`Welcome email sent to ${emailData.email}`);
        return true;
    }
    catch (error) {
        console.error('Error sending welcome email:', error);
        return false;
    }
});
exports.sendWelcomeEmail = sendWelcomeEmail;
// For development/testing - log email instead of sending
const sendWelcomeEmailDev = (emailData) => __awaiter(void 0, void 0, void 0, function* () {
    const template = emailTemplates[emailData.phase] || emailTemplates['RESET'];
    let subject = template.subject.replace('{{firstName}}', emailData.firstName);
    let body = template.body
        .replace(/{{firstName}}/g, emailData.firstName)
        .replace('{{setupLink}}', emailData.setupLink);
    console.log('=== WELCOME EMAIL (DEV MODE) ===');
    console.log('To:', emailData.email);
    console.log('Subject:', subject);
    console.log('Body:', body);
    console.log('================================');
    return true;
});
exports.sendWelcomeEmailDev = sendWelcomeEmailDev;
