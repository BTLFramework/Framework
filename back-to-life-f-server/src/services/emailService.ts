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

export interface EmailData {
  firstName: string;
  email: string;
  phase: string;
  setupLink: string;
}

interface RenderedEmail {
  subject: string;
  body: string;
}

function renderWelcomeEmail(emailData: EmailData): RenderedEmail {
  const template = emailTemplates[emailData.phase] || emailTemplates['RESET'];

  return {
    subject: template.subject.replace('{{firstName}}', emailData.firstName),
    body: template.body
      .replace(/{{firstName}}/g, emailData.firstName)
      .replace('{{setupLink}}', emailData.setupLink),
  };
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

async function sendWithResend(emailData: EmailData, rendered: RenderedEmail): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    console.error('❌ Welcome email not sent: RESEND_API_KEY and EMAIL_FROM must be configured');
    return false;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: [emailData.email],
        subject: rendered.subject,
        text: rendered.body,
        html: escapeHtml(rendered.body).replace(/\n/g, '<br>'),
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const details = await response.text();
      console.error(`❌ Resend rejected welcome email (${response.status}): ${details}`);
      return false;
    }

    console.log(`✅ Welcome email accepted for delivery to ${emailData.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email through Resend:', error);
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

export const sendWelcomeEmail = async (emailData: EmailData): Promise<boolean> => {
  try {
    const rendered = renderWelcomeEmail(emailData);

    if ((process.env.EMAIL_PROVIDER || '').toLowerCase() === 'resend') {
      return await sendWithResend(emailData, rendered);
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('❌ Welcome email not sent: EMAIL_USER and EMAIL_PASS must be configured');
      return false;
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'spencerbarberchiro@gmail.com',
      to: emailData.email,
      subject: rendered.subject,
      text: rendered.body,
      html: escapeHtml(rendered.body).replace(/\n/g, '<br>')
    };

    await createTransporter().sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${emailData.email}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return false;
  }
};

// For development/testing - log email instead of sending
export const sendWelcomeEmailDev = async (emailData: EmailData): Promise<boolean> => {
  const { subject, body } = renderWelcomeEmail(emailData);

  console.log('=== WELCOME EMAIL (DEV MODE) ===');
  console.log('To:', emailData.email);
  console.log('Subject:', subject);
  console.log('Body:', body);
  console.log('================================');
  
  return true;
};
