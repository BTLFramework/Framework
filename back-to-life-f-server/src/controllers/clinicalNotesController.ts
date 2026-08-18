import { Request, Response } from 'express';
import { decodeClinicalNote, encodeClinicalNote } from '../services/clinicalNoteType';
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
      data: notes.map((clinicalNote) => {
        const decoded = decodeClinicalNote(clinicalNote.note);
        return { ...clinicalNote, note: decoded.text, type: decoded.type };
      })
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
    const { patientId, note, practitionerId, type } = req.body;
    
    if (!patientId || !note) {
      return res.status(400).json({ error: 'Patient ID and note are required' });
    }

    const newNote = await prisma.clinicalNote.create({
      data: {
        patientId: parseInt(patientId),
        note: encodeClinicalNote(note, type),
        practitionerId: practitionerId ? parseInt(practitionerId) : null,
        isPrivate: true // Always private for now
      }
    });

    const decoded = decodeClinicalNote(newNote.note);

    res.status(201).json({
      success: true,
      message: 'Clinical note created successfully',
      data: { ...newNote, note: decoded.text, type: decoded.type }
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
    const { note, type } = req.body;
    
    if (!note) {
      return res.status(400).json({ error: 'Note content is required' });
    }

    const existing = await prisma.clinicalNote.findUnique({ where: { id: parseInt(id) } });
    if (!existing) return res.status(404).json({ error: 'Clinical note not found' });
    const existingDecoded = decodeClinicalNote(existing.note);
    const updatedNote = await prisma.clinicalNote.update({
      where: { id: parseInt(id) },
      data: {
        note: encodeClinicalNote(note, type === undefined ? existingDecoded.type : type),
      }
    });

    const decoded = decodeClinicalNote(updatedNote.note);

    res.json({
      success: true,
      message: 'Clinical note updated successfully',
      data: { ...updatedNote, note: decoded.text, type: decoded.type }
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
