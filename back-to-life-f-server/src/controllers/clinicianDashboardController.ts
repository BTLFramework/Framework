import prisma from '../db';

// Helpers
const parseId = (v: string) => {
  const n = Number(v);
  if (!Number.isFinite(n) || n <= 0) throw new Error('Invalid ID');
  return n;
};

// ---------- Clinical Notes ----------
export async function listNotes(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const notes = await prisma.clinicalNote.findMany({
      where: { patientId },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ notes });
  } catch (err: any) {
    console.error('listNotes', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

export async function addNote(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const { text, authorId } = req.body ?? {};
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text required' });

    const note = await prisma.clinicalNote.create({
      data: { 
        patientId, 
        note: text, 
        practitionerId: authorId ? parseId(authorId) : null 
      },
    });
    res.status(201).json({ note });
  } catch (err: any) {
    console.error('addNote', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

export async function updateNote(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const noteId = parseId(req.params.noteId);
    const { text } = req.body ?? {};
    if (!text || typeof text !== 'string') return res.status(400).json({ error: 'text required' });

    // Ensure note belongs to patient
    const existing = await prisma.clinicalNote.findUnique({ where: { id: noteId } });
    if (!existing || existing.patientId !== patientId) return res.status(404).json({ error: 'Note not found' });

    const note = await prisma.clinicalNote.update({ where: { id: noteId }, data: { note: text } });
    res.json({ note });
  } catch (err: any) {
    console.error('updateNote', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

export async function deleteNote(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const noteId = parseId(req.params.noteId);

    const existing = await prisma.clinicalNote.findUnique({ where: { id: noteId } });
    if (!existing || existing.patientId !== patientId) return res.status(404).json({ error: 'Note not found' });

    await prisma.clinicalNote.delete({ where: { id: noteId } });
    res.status(204).end();
  } catch (err: any) {
    console.error('deleteNote', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

// ---------- Clinician Assessment ----------
export async function saveClinicianAssessment(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const { recoveryMilestoneAchieved, clinicalProgressVerified, comments } = req.body ?? {};

    const assessment = await prisma.clinicianAssessment.create({
      data: {
        patientId,
        recoveryMilestoneAchieved: !!recoveryMilestoneAchieved,
        clinicalProgressVerified: !!clinicalProgressVerified,
        comments: comments ?? null,
      },
    });
    res.status(201).json({ assessment });
  } catch (err: any) {
    console.error('saveClinicianAssessment', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

// ---------- Mark as Reviewed ----------
export async function markReviewed(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { reviewedAt: new Date() },
      select: { id: true, reviewedAt: true },
    });
    res.json({ patient: updated });
  } catch (err: any) {
    console.error('markReviewed', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

// ---------- Treatment Plan ----------
export async function updateTreatmentPlan(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const { plan } = req.body ?? {};
    if (!plan || typeof plan !== 'string') return res.status(400).json({ error: 'plan required' });

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { treatmentPlan: plan },
      select: { id: true, treatmentPlan: true },
    });
    res.json({ patient: updated });
  } catch (err: any) {
    console.error('updateTreatmentPlan', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}

// ---------- Reassessment ----------
export async function scheduleReassessment(req: any, res: any) {
  try {
    const patientId = parseId(req.params.id);
    const { scheduledAt } = req.body ?? {};
    const when = scheduledAt ? new Date(scheduledAt) : null;
    if (!when || Number.isNaN(when.getTime())) return res.status(400).json({ error: 'valid scheduledAt required (ISO)' });

    const updated = await prisma.patient.update({
      where: { id: patientId },
      data: { nextReassessmentAt: when },
      select: { id: true, nextReassessmentAt: true },
    });
    res.json({ patient: updated });
  } catch (err: any) {
    console.error('scheduleReassessment', err);
    res.status(400).json({ error: err.message ?? 'Bad request' });
  }
}
