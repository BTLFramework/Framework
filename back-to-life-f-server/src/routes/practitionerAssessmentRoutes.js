const express = require('express');
const { PrismaClient } = require('@prisma/client');
const { requirePractitionerAuth } = require('../middleware/requirePractitionerAuth');
const { normalizePractitionerAssessment, reconcilePractitionerScore } = require('../services/practitionerAssessmentLogic');

const router = express.Router();
const prisma = new PrismaClient();

router.use(requirePractitionerAuth);

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

    const parsedPatientId = Number(patientId);
    if (!Number.isInteger(parsedPatientId) || parsedPatientId <= 0) {
      return res.status(400).json({ success: false, error: 'Valid patientId is required' });
    }
    const normalized = normalizePractitionerAssessment(req.body || {});
    const { items, section1Score, section2Score, totalPractitionerScore: totalScore } = normalized;

    const result = await prisma.$transaction(async (tx) => {
      const previousAssessment = await tx.practitionerAssessment.findFirst({
        where: { patientId: parsedPatientId },
        orderBy: [{ date: 'desc' }, { id: 'desc' }]
      });
      const latestSRS = await tx.sRSScore.findFirst({
        where: { patientId: parsedPatientId },
        orderBy: [{ date: 'desc' }, { id: 'desc' }]
      });

      const assessment = await tx.practitionerAssessment.create({
      data: {
        patientId: parsedPatientId,
        
        // Section 1: Symptom & Key Finding Resolution
        neurologicalSelected: items.neurological.selected,
        neurologicalScore: items.neurological.score,
        neurologicalNotes: items.neurological.notes,
        
        mechanicalSelected: items.mechanical.selected,
        mechanicalScore: items.mechanical.score,
        mechanicalNotes: items.mechanical.notes,
        
        orthopedicSelected: items.orthopedic.selected,
        orthopedicScore: items.orthopedic.score,
        orthopedicNotes: items.orthopedic.notes,
        
        provocativeSelected: items.provocative.selected,
        provocativeScore: items.provocative.score,
        provocativeNotes: items.provocative.notes,
        
        // Section 2: Functional & Mechanical Progress
        romSelected: items.rom.selected,
        romScore: items.rom.score,
        romNotes: items.rom.notes,
        
        functionalSelected: items.functional.selected,
        functionalScore: items.functional.score,
        functionalNotes: items.functional.notes,
        
        movementSelected: items.movement.selected,
        movementScore: items.movement.score,
        movementNotes: items.movement.notes,
        
        strengthSelected: items.strength.selected,
        strengthScore: items.strength.score,
        strengthNotes: items.strength.notes,
        
        balanceSelected: items.balance.selected,
        balanceScore: items.balance.score,
        balanceNotes: items.balance.notes,
        
        stabilitySelected: items.stability.selected,
        stabilityScore: items.stability.score,
        stabilityNotes: items.stability.notes,
        
        treatmentSelected: items.treatment.selected,
        treatmentScore: items.treatment.score,
        treatmentNotes: items.treatment.notes,
        
        // Calculated scores
        section1Score,
        section2Score,
        totalPractitionerScore: totalScore,
        
        // Metadata
        clinicianId,
        clinicianName
      }
      });
      let srsScore = null;
      if (latestSRS) {
        srsScore = reconcilePractitionerScore(
          latestSRS.srsScore,
          previousAssessment?.totalPractitionerScore || 0,
          totalScore,
        );
        await tx.sRSScore.update({ where: { id: latestSRS.id }, data: { srsScore } });
      }
      return { assessment, srsScore };
    });

    res.json({
      success: true,
      assessment: result.assessment,
      srsScore: result.srsScore,
      message: 'Practitioner assessment saved successfully'
    });

  } catch (error) {
    console.error('Error saving practitioner assessment:', error);
    res.status(error?.message?.includes('score must be') || error?.message?.includes('assessment is required') ? 400 : 500).json({
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
      orderBy: [{ date: 'desc' }, { id: 'desc' }]
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

module.exports = router;
