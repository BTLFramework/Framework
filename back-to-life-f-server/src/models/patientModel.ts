import prisma from "../db";

export const createPatient = async (name: string, email: string, intakeDate: Date, dob?: string) => {
  return await prisma.patient.create({ 
    data: { 
      name, 
      email,
      dob: dob ? new Date(dob) : null,
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
        orderBy: { date: "asc" }, // Return all scores, oldest to newest
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

// Get assigned exercises for movement session by email
export const getAssignedExercisesByEmail = async (email: string) => {
  console.log(`🔍 Looking for patient with email: ${email}`);
  
  // Find patient by email
  const patient = await findPatientByEmail(email);
  if (!patient) {
    console.log(`❌ No patient found for email: ${email}`);
    return null;
  }
  
  console.log(`✅ Found patient: ${patient.name} (ID: ${patient.id})`);
  console.log(`📊 SRS Scores:`, patient.srsScores);

  // Get latest SRS score to determine phase
  const srsScores = patient.srsScores || [];
  const latestSRS = srsScores.length > 0 ? srsScores[srsScores.length - 1] : null;
  const srsScore = latestSRS?.srsScore || 0;
  
  console.log(`📈 Latest SRS Score: ${srsScore}`);

  // Determine phase based on SRS score
  let phase = "Reset";
  if (srsScore >= 8) phase = "Rebuild";
  else if (srsScore >= 4) phase = "Educate";
  
  console.log(`🎯 Determined Phase: ${phase}`);

  // Get region from latest assessment or default
  const region = latestSRS?.region || "Neck";
  console.log(`📍 Region: ${region}`);

  // Import exercise library with robust path resolution
  let exercises: any[] = [];
  try {
    const path = require('path');
    const candidates = [
      path.resolve(__dirname, '../../config/exerciseConfig'),
      path.resolve(process.cwd(), 'config/exerciseConfig'),
      path.resolve(process.cwd(), 'dist/config/exerciseConfig'),
    ];
    let loaded: any = null;
    for (const candidate of candidates) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        loaded = require(candidate);
        if (loaded && (loaded.exercises || Array.isArray(loaded))) {
          break;
        }
      } catch (_) {
        // try next candidate
      }
    }
    const maybeExercises = loaded?.exercises || loaded;
    if (Array.isArray(maybeExercises)) {
      exercises = maybeExercises;
    } else {
      console.error('❌ Failed to load exerciseConfig: invalid shape');
      exercises = [];
    }
  } catch (err) {
    console.error('❌ Error loading exerciseConfig:', err);
    exercises = [];
  }
  console.log(`📚 Total exercises in config: ${exercises.length}`);

  // Filter exercises by region and phase
  let availableExercises = exercises.filter((ex: any) => 
    ex.region === region && ex.phase === phase
  );
  console.log(`🎯 Exercises for ${region} + ${phase}: ${availableExercises.length}`);

  // If not enough exercises in current phase, get from other phases
  if (availableExercises.length < 3) {
    const phases = ["Reset", "Educate", "Rebuild"];
    for (const otherPhase of phases) {
      if (otherPhase !== phase) {
        const additionalExercises = exercises.filter((ex: any) => 
          ex.region === region && ex.phase === otherPhase
        );
        availableExercises = [...availableExercises, ...additionalExercises];
        if (availableExercises.length >= 3) break;
      }
    }
  }

  // Select exactly 3 exercises, prioritizing those that sum to 10 points
  let bestCombination = null;
  let bestScore = Infinity;
  for (let i = 0; i < availableExercises.length - 2; i++) {
    for (let j = i + 1; j < availableExercises.length - 1; j++) {
      for (let k = j + 1; k < availableExercises.length; k++) {
        const combo = [
          availableExercises[i],
          availableExercises[j],
          availableExercises[k]
        ];
        const totalPoints = combo.reduce((sum: number, ex: any) => sum + ex.points, 0);
        const difference = Math.abs(totalPoints - 10);
        if (difference < bestScore) {
          bestScore = difference;
          bestCombination = combo;
        }
      }
    }
  }
  // If no combination found, take first 3 exercises
  if (!bestCombination && availableExercises.length >= 3) {
    bestCombination = availableExercises.slice(0, 3);
  }
  // If still not enough exercises, pad with placeholder
  while (bestCombination && bestCombination.length < 3) {
    bestCombination.push({
      id: `placeholder_${bestCombination.length}`,
      name: "Additional exercise",
      description: "Exercise to be assigned",
      duration: "5-10 minutes",
      difficulty: "Beginner",
      points: 3,
      instructions: ["Exercise details coming soon"],
      videoId: "placeholder"
    });
  }
  const totalPoints = bestCombination ? bestCombination.reduce((sum: number, ex: any) => sum + ex.points, 0) : 0;
  
  console.log(`🏋️ Final exercise count: ${bestCombination ? bestCombination.length : 0}`);
  console.log(`💯 Total points: ${totalPoints}`);
  
  return {
    exercises: bestCombination || [],
    totalPoints,
    region,
    phase,
    srsScore
  };
}; 