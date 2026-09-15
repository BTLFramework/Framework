import jwt from 'jsonwebtoken';

const requiredSecret = (name: 'JWT_SECRET') => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not configured`);
  return value;
};

export const generateToken = (user: any) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: "clinician" },
    requiredSecret('JWT_SECRET'),
    { expiresIn: "24h" }
  );
};

export const generatePatientToken = (patientPortal: any) => {
  return jwt.sign(
    { 
      id: patientPortal.id, 
      email: patientPortal.email, 
      patientId: patientPortal.patientId,
      role: "patient" 
    },
    requiredSecret('JWT_SECRET'),
    { expiresIn: "7d" }
  );
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, requiredSecret('JWT_SECRET')) as any;
  } catch (error) {
    return null;
  }
};
