// Script to create a patient portal account for Diego
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createDiegoAccount() {
  try {
    console.log('🔧 Creating patient portal account for Diego...');
    
    // Check if account already exists
    const existingAccount = await prisma.patientPortal.findFirst({
      where: { email: 'diego_21_99@hotmail.com' },
      include: { patient: true }
    });
    
    if (existingAccount) {
      console.log('✅ Account already exists:');
      console.log(`   Patient: ${existingAccount.patient.name}`);
      console.log(`   Email: ${existingAccount.email}`);
      console.log(`   Current password: ${existingAccount.password}`);
      return;
    }
    
    // Create the patient first
    const patient = await prisma.patient.create({
      data: {
        name: 'Diego',
        email: 'diego_21_99@hotmail.com',
        intakeDate: new Date(),
      }
    });
    
    console.log('✅ Created patient:', patient.name);
    
    // Create patient portal account with a simple password
    const password = 'password123'; // Simple password for testing
    
    const patientPortal = await prisma.patientPortal.create({
      data: {
        patientId: patient.id,
        email: 'diego_21_99@hotmail.com',
        password: password,
      }
    });
    
    console.log('✅ Created patient portal account:');
    console.log(`   Email: ${patientPortal.email}`);
    console.log(`   Password: ${password}`);
    console.log('\n🎯 You can now login with:');
    console.log(`   Email: diego_21_99@hotmail.com`);
    console.log(`   Password: ${password}`);
    
  } catch (error) {
    console.error('❌ Error creating account:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createDiegoAccount();

