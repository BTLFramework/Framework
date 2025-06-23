const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkPatient() {
  try {
    const patient = await prisma.patient.findUnique({
      where: { id: 8 },
      include: {
        srsScores: true
      }
    });
    
    console.log('Hayden Barber data:', JSON.stringify(patient, null, 2));
    
    if (patient) {
      console.log(`\nPatient: ${patient.name}`);
      console.log(`SRS Scores count: ${patient.srsScores.length}`);
      if (patient.srsScores.length > 0) {
        console.log('Latest SRS Score:', patient.srsScores[0]);
      }
    } else {
      console.log('Patient not found');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPatient(); 