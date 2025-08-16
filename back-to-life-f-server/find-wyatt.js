const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findWyatt() {
  try {
    // Search for Wyatt by name (case insensitive)
    const patients = await prisma.patient.findMany({
      where: {
        name: {
          contains: 'Wyatt',
          mode: 'insensitive'
        }
      },
      include: {
        srsScores: true,
        recoveryPoints: true,
        messages: true
      }
    });
    
    console.log(`Found ${patients.length} patient(s) with name containing "Wyatt":`);
    console.log('=====================================');
    
    patients.forEach((patient, index) => {
      console.log(`\nPatient ${index + 1}:`);
      console.log(`ID: ${patient.id}`);
      console.log(`Name: ${patient.name}`);
      console.log(`Email: ${patient.email}`);
      console.log(`Phone: ${patient.phone || 'Not provided'}`);
      console.log(`Created: ${patient.createdAt}`);
      console.log(`SRS Scores: ${patient.srsScores.length}`);
      console.log(`Recovery Points: ${patient.recoveryPoints.length}`);
      console.log(`Messages: ${patient.messages.length}`);
      
      if (patient.srsScores.length > 0) {
        console.log(`Latest SRS Score: ${patient.srsScores[0].score}/10`);
      }
    });
    
    // Also search by email if no results by name
    if (patients.length === 0) {
      console.log('\nNo patients found by name. Searching by email...');
      const emailPatients = await prisma.patient.findMany({
        where: {
          email: {
            contains: 'wyatt',
            mode: 'insensitive'
          }
        },
        include: {
          srsScores: true,
          recoveryPoints: true,
          messages: true
        }
      });
      
      if (emailPatients.length > 0) {
        console.log(`\nFound ${emailPatients.length} patient(s) by email:`);
        emailPatients.forEach((patient, index) => {
          console.log(`\nPatient ${index + 1}:`);
          console.log(`ID: ${patient.id}`);
          console.log(`Name: ${patient.name}`);
          console.log(`Email: ${patient.email}`);
          console.log(`Phone: ${patient.phone || 'Not provided'}`);
          console.log(`Created: ${patient.createdAt}`);
        });
      } else {
        console.log('\nNo patients found with name or email containing "Wyatt"');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findWyatt();
