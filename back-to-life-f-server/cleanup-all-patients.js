const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function cleanupAllPatients() {
  try {
    console.log('🧹 Starting comprehensive database cleanup...');
    
    // First, let's see what we have
    const patientCount = await prisma.patient.count();
    const portalCount = await prisma.patientPortal.count();
    
    console.log(`📊 Current data: ${patientCount} patients, ${portalCount} portal accounts`);
    
    if (patientCount === 0) {
      console.log('✅ Database is already clean!');
      return;
    }
    
    // Delete in the correct order to handle foreign key constraints
    console.log('🗑️  Deleting all related data...');
    
    // 1. Delete SRS Buffers (references Patient)
    const deletedBuffers = await prisma.sRSBuffer.deleteMany({});
    console.log(`   Deleted ${deletedBuffers.count} SRS buffers`);
    
    // 2. Delete Threshold Hits (references Patient)
    const deletedThresholds = await prisma.rPThresholdHit.deleteMany({});
    console.log(`   Deleted ${deletedThresholds.count} threshold hits`);
    
    // 3. Delete Task Completions (references Patient)
    const deletedTasks = await prisma.taskCompletion.deleteMany({});
    console.log(`   Deleted ${deletedTasks.count} task completions`);
    
    // 4. Delete Assessment Results (references Patient)
    const deletedAssessments = await prisma.assessmentResult.deleteMany({});
    console.log(`   Deleted ${deletedAssessments.count} assessment results`);
    
    // 5. Delete SRS Daily entries (references Patient)
    const deletedDaily = await prisma.sRSDaily.deleteMany({});
    console.log(`   Deleted ${deletedDaily.count} SRS daily entries`);
    
    // 6. Delete SRS Scores (references Patient)
    const deletedScores = await prisma.sRSScore.deleteMany({});
    console.log(`   Deleted ${deletedScores.count} SRS scores`);
    
    // 7. Delete Recovery Points (references Patient)
    const deletedRecoveryPoints = await prisma.recoveryPoint.deleteMany({});
    console.log(`   Deleted ${deletedRecoveryPoints.count} recovery points`);
    
    // 8. Delete Messages (references Patient)
    const deletedMessages = await prisma.message.deleteMany({});
    console.log(`   Deleted ${deletedMessages.count} messages`);
    
    // 9. Delete Mindfulness Logs (references Patient)
    const deletedMindfulness = await prisma.mindfulnessLog.deleteMany({});
    console.log(`   Deleted ${deletedMindfulness.count} mindfulness logs`);
    
    // 10. Delete Patient Portal accounts (references Patient)
    const deletedPortals = await prisma.patientPortal.deleteMany({});
    console.log(`   Deleted ${deletedPortals.count} portal accounts`);
    
    // 11. Finally, delete all Patients (this will cascade to any remaining related data)
    const deletedPatients = await prisma.patient.deleteMany({});
    console.log(`   Deleted ${deletedPatients.count} patients`);
    
    // 12. Also clean up any orphaned Users (if any)
    const deletedUsers = await prisma.user.deleteMany({});
    console.log(`   Deleted ${deletedUsers.count} users`);
    
    console.log('✅ Database cleanup completed successfully!');
    
    // Verify cleanup
    const finalPatientCount = await prisma.patient.count();
    const finalPortalCount = await prisma.patientPortal.count();
    console.log(`📊 Final state: ${finalPatientCount} patients, ${finalPortalCount} portal accounts`);
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the cleanup
cleanupAllPatients()
  .then(() => {
    console.log('🎉 Cleanup script completed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Cleanup failed:', error);
    process.exit(1);
  }); 