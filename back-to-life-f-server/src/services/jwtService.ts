import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const SETUP_SECRET = process.env.SETUP_SECRET || 'setup-secret-key';

export interface SetupTokenPayload {
  email: string;
  patientId: number;
  type: 'setup';
}

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: "clinician" },
    JWT_SECRET,
    { expiresIn: "24h" }
  );
};

export const generateSetupToken = (email: string) => {
  return jwt.sign({ email }, SETUP_SECRET, { expiresIn: "24h" });
};

export const generatePatientToken = (patientPortal: any) => {
  return jwt.sign(
    { 
      id: patientPortal.id, 
      email: patientPortal.email, 
      patientId: patientPortal.patientId,
      role: "patient" 
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as any;
  } catch (error) {
    return null;
  }
};

export const verifySetupToken = (token: string) => {
  try {
    return jwt.verify(token, SETUP_SECRET) as any;
  } catch (error) {
    return null;
  }
};

export const generateSetupLink = (email: string, patientId: number, baseUrl: string): string => {
  const token = generateSetupToken(email);
  return `${baseUrl}/set-password?token=${token}`;
}; 