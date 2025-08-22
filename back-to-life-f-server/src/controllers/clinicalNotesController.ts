import { Request, Response } from 'express';
import prisma from '../db';

// Get all clinical notes for a patient
export const getClinicalNotes = async (req: Request, res: Response) => {
  try {
    const { patientId } = req.params;
    
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    const notes = await prisma.clinicalNote.findMany({
      where: {
        patientId: parseInt(patientId)
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      data: notes
    });
  } catch (error) {
    console.error('Error fetching clinical notes:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch clinical notes'
    });
  }
};

// Create a new clinical note
export const createClinicalNote = async (req: Request, res: Response) => {
  try {
    const { patientId, note, practitionerId } = req.body;
    
    if (!patientId || !note) {
      return res.status(400).json({ error: 'Patient ID and note are required' });
    }

    const newNote = await prisma.clinicalNote.create({
      data: {
        patientId: parseInt(patientId),
        note,
        practitionerId: practitionerId ? parseInt(practitionerId) : null,
        isPrivate: true // Always private for now
      }
    });

    res.status(201).json({
      success: true,
      message: 'Clinical note created successfully',
      data: newNote
    });
  } catch (error) {
    console.error('Error creating clinical note:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to create clinical note'
    });
  }
};

// Update a clinical note
export const updateClinicalNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { note } = req.body;
    
    if (!note) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const updatedNote = await prisma.clinicalNote.update({
      where: { id: parseInt(id) },
      data: { note }
    });

    res.json({
      success: true,
      message: 'Clinical note updated successfully',
      data: updatedNote
    });
  } catch (error) {
    console.error('Error updating clinical note:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to update clinical note'
    });
  }
};

// Delete a clinical note
export const deleteClinicalNote = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.clinicalNote.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Clinical note deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting clinical note:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to delete clinical note'
    });
  }
};
