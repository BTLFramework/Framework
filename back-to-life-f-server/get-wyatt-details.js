const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function getWyattDetails() {
  try {
    // Get Wyatt's complete information
    const wyatt = await prisma.patient.findUnique({
      where: { id: 1 },
      include: {
        srsScores: {
          orderBy: { date: 'desc' }
        },
        recoveryPoints: {
          orderBy: { date: 'desc' }
        },
        messages: {
          orderBy: { createdAt: 'desc' }
        },
        portalAccount: true
      }
    });
    
    if (wyatt) {
      console.log('=== WYATT\'S COMPLETE DETAILS ===');
      console.log(`ID: ${wyatt.id}`);
      console.log(`Name: ${wyatt.name}`);
      console.log(`Email: ${wyatt.email}`);
      console.log(`Phone: ${wyatt.phone || 'Not provided'}`);
      console.log(`DOB: ${wyatt.dob || 'Not provided'}`);
      console.log(`Intake Date: ${wyatt.intakeDate}`);
      console.log(`Created: ${wyatt.createdAt}`);
      console.log(`Updated: ${wyatt.updatedAt}`);
      
      console.log('\n=== SRS SCORES ===');
      if (wyatt.srsScores.length > 0) {
        wyatt.srsScores.forEach((score, index) => {
          console.log(`Score ${index + 1}: ${score.srsScore}/10 (${score.date})`);
          console.log(`  Form Type: ${score.formType}`);
          console.log(`  Region: ${score.region}`);
          console.log(`  VAS: ${score.vas}`);
          console.log(`  Confidence: ${score.confidence}`);
        });
      } else {
        console.log('No SRS scores found');
      }
      
      console.log('\n=== RECOVERY POINTS ===');
      if (wyatt.recoveryPoints.length > 0) {
        wyatt.recoveryPoints.forEach((point, index) => {
          console.log(`Point ${index + 1}: ${point.points} points (${point.date})`);
          console.log(`  Category: ${point.category}`);
          console.log(`  Action: ${point.action}`);
        });
      } else {
        console.log('No recovery points found');
      }
      
      console.log('\n=== MESSAGES ===');
      if (wyatt.messages.length > 0) {
        wyatt.messages.forEach((message, index) => {
          console.log(`Message ${index + 1}: ${message.subject} (${message.createdAt})`);
          console.log(`  Content: ${message.content}`);
          console.log(`  Sender: ${message.senderName} (${message.senderType})`);
        });
      } else {
        console.log('No messages found');
      }
      
      console.log('\n=== PORTAL ACCOUNT ===');
      if (wyatt.portalAccount) {
        console.log('Portal Account: EXISTS');
        console.log(`  Email: ${wyatt.portalAccount.email}`);
        console.log(`  Password: SET (hashed)`);
        console.log(`  Created: ${wyatt.portalAccount.createdAt}`);
      } else {
        console.log('Portal Account: NOT CREATED - needs to be set up');
      }
      
    } else {
      console.log('Wyatt not found');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getWyattDetails();
