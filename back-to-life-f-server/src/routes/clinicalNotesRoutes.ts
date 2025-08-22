import { Router } from 'express';
import { 
  getClinicalNotes, 
  createClinicalNote, 
  updateClinicalNote, 
  deleteClinicalNote 
} from '../controllers/clinicalNotesController';

const router = Router();

// Add logging middleware to this router
router.use((req, res, next) => {
  console.log(`ClinicalNotesRoutes: ${req.method} ${req.path}`);
  next();
});

// GET /api/clinical-notes/:patientId - Get all notes for a patient
router.get('/:patientId', getClinicalNotes as any);

// POST /api/clinical-notes - Create a new note
router.post('/', createClinicalNote as any);

// PUT /api/clinical-notes/:id - Update a note
router.put('/:id', updateClinicalNote as any);

// DELETE /api/clinical-notes/:id - Delete a note
router.delete('/:id', deleteClinicalNote as any);

export default router;
