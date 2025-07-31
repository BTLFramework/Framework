const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function findOrResetPassword(email) {
  try {
    console.log(`Looking for patient portal account for: ${email}`);
    
    // Find the patient portal account
    const patientPortal = await prisma.patientPortal.findFirst({
      where: { email: email },
      include: { patient: true }
    });
    
    if (!patientPortal) {
      console.log('❌ No patient portal account found for this email');
      return;
    }
    
    console.log('✅ Found patient portal account:');
    console.log(`   Patient: ${patientPortal.patient.name}`);
    console.log(`   Email: ${patientPortal.email}`);
    console.log(`   Current password: ${patientPortal.password}`);
    
    // Generate a new temporary password
    const newPassword = Math.random().toString(36).substring(2, 10);
    
    console.log('\n🔄 Generating new temporary password...');
    
    // Update the password
    await prisma.patientPortal.update({
      where: { id: patientPortal.id },
      data: { password: newPassword }
    });
    
    console.log('✅ Password updated successfully!');
    console.log(`   New temporary password: ${newPassword}`);
    console.log('\n📧 You should also receive a setup email with a link to set your own password.');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  console.log('Usage: node find-password.js <email>');
  console.log('Example: node find-password.js britny@example.com');
  process.exit(1);
}

findOrResetPassword(email); 