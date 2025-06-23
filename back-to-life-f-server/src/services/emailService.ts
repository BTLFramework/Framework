import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

// Email templates
const emailTemplates = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../../config/emailTemplates.json'), 'utf8')
);

// Create transporter (for development, using Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@gmail.com',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

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
      from: process.env.EMAIL_USER || 'noreply@backtolife.com',
      to: emailData.email,
      subject: subject,
      text: body,
      html: body.replace(/\n/g, '<br>')
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${emailData.email}`);
    return true;
  } catch (error) {
    console.error('Error sending welcome email:', error);
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