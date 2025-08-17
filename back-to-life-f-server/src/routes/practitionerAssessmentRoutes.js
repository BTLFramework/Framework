const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

// Save practitioner assessment
router.post('/save', async (req, res) => {
  try {
    const {
      patientId,
      neurological, mechanical, orthopedic, provocative,
      rom, functional, movement, strength, balance, stability, treatment,
      clinicianId,
      clinicianName
    } = req.body;

    // Calculate section scores
    const section1Items = [neurological, mechanical, orthopedic, provocative];
    const section2Items = [rom, functional, movement, strength, balance, stability, treatment];
    
    const section1Score = calculateSectionScore(section1Items);
    const section2Score = calculateSectionScore(section2Items);
    const totalScore = Math.round((section1Score + section2Score) * 10) / 10;

    // Save to database
    const assessment = await prisma.practitionerAssessment.create({
      data: {
        patientId: parseInt(patientId),
        
        // Section 1: Symptom & Key Finding Resolution
        neurologicalSelected: neurological.selected,
        neurologicalScore: parseFloat(neurological.score),
        neurologicalNotes: neurological.notes,
        
        mechanicalSelected: mechanical.selected,
        mechanicalScore: parseFloat(mechanical.score),
        mechanicalNotes: mechanical.notes,
        
        orthopedicSelected: orthopedic.selected,
        orthopedicScore: parseFloat(orthopedic.score),
        orthopedicNotes: orthopedic.notes,
        
        provocativeSelected: provocative.selected,
        provocativeScore: parseFloat(provocative.score),
        provocativeNotes: provocative.notes,
        
        // Section 2: Functional & Mechanical Progress
        romSelected: rom.selected,
        romScore: parseFloat(rom.score),
        romNotes: rom.notes,
        
        functionalSelected: functional.selected,
        functionalScore: parseFloat(functional.score),
        functionalNotes: functional.notes,
        
        movementSelected: movement.selected,
        movementScore: parseFloat(movement.score),
        movementNotes: movement.notes,
        
        strengthSelected: strength.selected,
        strengthScore: parseFloat(strength.score),
        strengthNotes: strength.notes,
        
        balanceSelected: balance.selected,
        balanceScore: parseFloat(balance.score),
        balanceNotes: balance.notes,
        
        stabilitySelected: stability.selected,
        stabilityScore: parseFloat(stability.score),
        stabilityNotes: stability.notes,
        
        treatmentSelected: treatment.selected,
        treatmentScore: parseFloat(treatment.score),
        treatmentNotes: treatment.notes,
        
        // Calculated scores
        section1Score,
        section2Score,
        totalPractitionerScore: totalScore,
        
        // Metadata
        clinicianId,
        clinicianName
      }
    });

    // Update the patient's SRS score to include practitioner points
    await updatePatientSRSScore(patientId, totalScore);

    res.json({
      success: true,
      assessment,
      message: 'Practitioner assessment saved successfully'
    });

  } catch (error) {
    console.error('Error saving practitioner assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save practitioner assessment',
      details: error.message
    });
  }
});

// Get practitioner assessment for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const assessment = await prisma.practitionerAssessment.findFirst({
      where: { patientId: parseInt(patientId) },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      assessment
    });

  } catch (error) {
    console.error('Error fetching practitioner assessment:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch practitioner assessment',
      details: error.message
    });
  }
});

// Helper function to calculate section score
function calculateSectionScore(items) {
  const selectedItems = items.filter(item => item.selected);
  if (selectedItems.length === 0) return 0;
  
  const totalScore = selectedItems.reduce((sum, item) => sum + parseFloat(item.score), 0);
  return Math.min(1, totalScore / selectedItems.length);
}

// Helper function to update patient SRS score
async function updatePatientSRSScore(patientId, practitionerScore) {
  try {
    // Get the latest SRS score for this patient
    const latestSRS = await prisma.sRSScore.findFirst({
      where: { patientId: parseInt(patientId) },
      orderBy: { date: 'desc' }
    });

    if (latestSRS) {
      // Calculate new total SRS score including practitioner points
      const baseScore = latestSRS.srsScore;
      const newTotalScore = Math.min(11, baseScore + practitionerScore);
      
      // Update the SRS score
      await prisma.sRSScore.update({
        where: { id: latestSRS.id },
        data: { 
          srsScore: newTotalScore,
          updatedAt: new Date()
        }
      });

      console.log(`Updated SRS score for patient ${patientId}: ${baseScore} + ${practitionerScore} = ${newTotalScore}`);
    }
  } catch (error) {
    console.error('Error updating patient SRS score:', error);
  }
}

module.exports = router;
