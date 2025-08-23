import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

console.log('📦 emailService loader MARKER: ROBUST_RESOLVER_V4');

type Templates = Record<string, any>;

let templatesCache: Templates | null = null;

function resolveTemplatesPath(): string {
  const envPath = process.env.EMAIL_TEMPLATES_PATH;
  const candidates = [
    envPath && path.resolve(envPath),
    path.resolve(__dirname, 'emailTemplates.json'), // Super robust - same directory
    // most common in prod: compiled file lives in dist/services → dist/config/...
    path.resolve(__dirname, '../config/emailTemplates.json'),
    // if someone compiled differently or referenced from a different dir
    path.resolve(__dirname, '../../config/emailTemplates.json'),
    // cwd-based fallbacks (local runs, unusual launch dirs)
    path.resolve(process.cwd(), 'dist/config/emailTemplates.json'),
    path.resolve(process.cwd(), 'config/emailTemplates.json'),
  ].filter(Boolean) as string[];

  for (const p of candidates) {
    if (fs.existsSync(p)) return p;
  }
  throw new Error(
    `emailTemplates.json not found. Tried:\n${candidates.join('\n')}`
  );
}

function loadTemplates(): Templates {
  if (templatesCache) return templatesCache;
  console.log('🔍 emailService: Starting robust template resolution...');
  const filePath = resolveTemplatesPath();
  console.log(`📧 Loading email templates from: ${filePath}`);
  const raw = fs.readFileSync(filePath, 'utf-8');
  templatesCache = JSON.parse(raw) as Templates;
  console.log('✅ emailService: Templates loaded successfully');
  return templatesCache;
}

// Email templates - now using robust resolver
const emailTemplates = loadTemplates();

// Create transporter - supports multiple email providers
const createTransporter = () => {
  const emailProvider = process.env.EMAIL_PROVIDER || 'gmail';
  
  switch (emailProvider) {
    case 'wix':
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.wix.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USER || 'noreply@backtolifeyeg.com',
          pass: process.env.EMAIL_PASS || ''
        }
      });
    
    case 'gmail':
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER || 'your-email@gmail.com',
          pass: process.env.EMAIL_PASS || 'your-app-password'
        }
      });
    
    default:
      return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.wix.com',
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: false,
        auth: {
          user: process.env.EMAIL_USER || 'noreply@backtolifeyeg.com',
          pass: process.env.EMAIL_PASS || ''
        }
      });
  }
};

const transporter = createTransporter();

export interface EmailData {
  firstName: string;
  email: string;
  phase: string;
  setupLink: string;
}

export const sendWelcomeEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const template = emailTemplates[emailData.phase] || emailTemplates['RESET'];
    
    // Replace placeholders in template
    let subject = template.subject.replace('{{firstName}}', emailData.firstName);
    let body = template.body
      .replace(/{{firstName}}/g, emailData.firstName)
      .replace('{{setupLink}}', emailData.setupLink);

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'spencerbarberchiro@gmail.com',
      to: emailData.email,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${emailData.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// For development/testing - log email instead of sending
export const sendWelcomeEmailDev = async (emailData: EmailData): Promise<boolean> => {
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
};
