import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const createPatient = async (name: string, email: string, intakeDate: Date) => {
  return await prisma.patient.create({ 
    data: { 
      name, 
      email,
      intakeDate 
    } 
  });
};

export const createPatientPortalAccount = async (patientId: number, email: string, password: string) => {
  return await prisma.patientPortal.create({
    data: {
      patientId,
      email,
      password // Note: This should be hashed in production
    }
  });
};

export const findPatientByEmail = async (email: string) => {
  return await prisma.patient.findUnique({
    where: { email },
    include: {
      srsScores: {
        orderBy: { date: "desc" },
        take: 1,
      },
      portalAccount: true
    }
  });
};

export const findPatientPortalByEmail = async (email: string) => {
  return await prisma.patientPortal.findFirst({
    where: { email },
    include: {
      patient: true,
    },
  });
};

export const updatePatientPortalPassword = async (email: string, password: string) => {
  return await prisma.patientPortal.update({
    where: { email },
    data: { password },
  });
};

export const addSRSScore = async (patientId: number, data: any) => {
  return await prisma.sRSScore.create({ data: { ...data, patientId } });
};

export const getLatestSRSScore = async (patientId: number) => {
  return await prisma.sRSScore.findFirst({
    where: { patientId },
    orderBy: { date: "desc" },
  });
};

export const getAllPatientsWithLatestScores = async () => {
  const patients = await prisma.patient.findMany({
    include: {
      srsScores: {
        orderBy: { date: "desc" },
        take: 1,
      },
    },
  });
  return patients;
};

export const submitIntake = async (intakeData: any) => {
  const {
    patientName,
    email,
    date,
    formType,
    region,
    disabilityPercentage,
    vas,
    psfs,
    beliefs,
    confidence,
    groc,
    srsScore,
  } = intakeData;

  // Create patient
  const patient = await prisma.patient.create({
    data: {
      name: patientName,
      email: email,
      intakeDate: new Date(date),
    },
  });

  // Create patient portal account
  const tempPassword = Math.random().toString(36).substring(2, 10);
  const patientPortal = await prisma.patientPortal.create({
    data: {
      patientId: patient.id,
      email: email,
      password: tempPassword,
    },
  });

  // Create SRS score
  const srsScoreRecord = await prisma.sRSScore.create({
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
};

export const getPatientLatestScore = async (patientId: number) => {
  return await prisma.sRSScore.findFirst({
    where: { patientId },
    orderBy: { date: "desc" },
  });
};

export const getAllPatientsWithScores = async () => {
  return await prisma.patient.findMany({
    include: {
      srsScores: {
        orderBy: { date: "desc" },
        take: 1,
      },
      portalAccount: true,
    },
  });
};

export const deletePatient = async (patientId: number) => {
  // Delete related records first
  await prisma.sRSScore.deleteMany({
    where: { patientId },
  });
  
  await prisma.patientPortal.deleteMany({
    where: { patientId },
  });

  // Delete patient
  return await prisma.patient.delete({
    where: { id: patientId },
  });
}; 