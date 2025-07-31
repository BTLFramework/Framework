const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupTestPatients() {
  try {
    console.log('🧹 Starting database cleanup...');
    
    // Find all test patients (those with test-related names or emails)
    const testPatients = await prisma.patient.findMany({
      where: {
        OR: [
          { name: { contains: 'Test', mode: 'insensitive' } },
          { name: { contains: 'Debug', mode: 'insensitive' } },
          { name: { contains: 'Spencer', mode: 'insensitive' } },
          { name: { contains: 'Bagagwaaaaa', mode: 'insensitive' } },
          { email: { contains: 'test', mode: 'insensitive' } },
          { email: { contains: 'debug', mode: 'insensitive' } },
          { email: { contains: 'example.com', mode: 'insensitive' } }
        ]
      },
      include: {
        srsScores: true,
        portalAccount: true
      }
    });
    
    console.log(`📊 Found ${testPatients.length} test patients to delete:`);
    
    for (const patient of testPatients) {
      console.log(`   - ${patient.name} (${patient.email})`);
    }
    
    if (testPatients.length === 0) {
      console.log('✅ No test patients found to delete');
      return;
    }
    
    console.log('\n🗑️  Deleting test patients and related data...');
    
    let deletedCount = 0;
    
    for (const patient of testPatients) {
      try {
        // Delete in the correct order to avoid foreign key constraints
        // 1. Delete SRS scores first
        if (patient.srsScores.length > 0) {
          await prisma.sRSScore.deleteMany({
            where: { patientId: patient.id }
          });
          console.log(`   ✅ Deleted ${patient.srsScores.length} SRS scores for ${patient.name}`);
        }
        
        // 2. Delete patient portal account
        if (patient.portalAccount) {
          await prisma.patientPortal.delete({
            where: { id: patient.portalAccount.id }
          });
          console.log(`   ✅ Deleted patient portal for ${patient.name}`);
        }
        
        // 3. Delete the patient
        await prisma.patient.delete({
          where: { id: patient.id }
        });
        
        console.log(`   ✅ Deleted patient: ${patient.name}`);
        deletedCount++;
        
      } catch (error) {
        console.error(`   ❌ Error deleting ${patient.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Cleanup complete! Deleted ${deletedCount} test patients.`);
    
    // Show remaining patients
    const remainingPatients = await prisma.patient.findMany({
      select: { name: true, email: true }
    });
    
    console.log(`\n📋 Remaining patients (${remainingPatients.length}):`);
    for (const patient of remainingPatients) {
      console.log(`   - ${patient.name} (${patient.email})`);
    }
    
  } catch (error) {
    console.error('❌ Cleanup error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Add a safety check
console.log('⚠️  WARNING: This will delete all test patients from the database!');
console.log('This includes patients with names/emails containing: Test, Debug, Spencer, example.com');
console.log('');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('Are you sure you want to continue? (yes/no): ', (answer) => {
  if (answer.toLowerCase() === 'yes' || answer.toLowerCase() === 'y') {
    console.log('Proceeding with cleanup...\n');
    cleanupTestPatients();
  } else {
    console.log('Cleanup cancelled.');
  }
  rl.close();
}); 