const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateSpencerSRS() {
  try {
    console.log('Updating Spencer\'s SRS score...');
    
    // Update the most recent SRS record (ID 24) to have the correct score
    const updatedRecord = await prisma.sRSScore.update({
      where: { id: 24 },
      data: { srsScore: 5 }
    });
    
    console.log('✅ Successfully updated SRS score:', updatedRecord);
    
    // Verify the update
    const verifyRecord = await prisma.sRSScore.findUnique({
      where: { id: 24 }
    });
    
    console.log('✅ Verification - Updated record:', verifyRecord);
    
  } catch (error) {
    console.error('❌ Error updating SRS score:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateSpencerSRS(); 