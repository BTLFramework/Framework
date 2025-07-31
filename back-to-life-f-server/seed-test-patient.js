// Script to seed a test patient for backend testing
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Check if patient with id: 1 exists
  let patient = await prisma.patient.findUnique({ where: { id: 1 } });
  if (!patient) {
    patient = await prisma.patient.create({
      data: {
        id: 1,
        name: 'Test Patient',
        email: 'test-patient@example.com',
        dob: new Date('1990-01-01'),
        intakeDate: new Date(),
      }
    });
    console.log('Seeded test patient:', patient);
  } else {
    console.log('Test patient already exists:', patient);
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 