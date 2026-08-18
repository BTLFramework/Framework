import prisma from '../db';

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export const nextMonthlyReminderAt = (from = new Date()) =>
  new Date(from.getTime() + THIRTY_DAYS_MS);

export async function sendDueReassessmentReminders(now = new Date()) {
  const duePatients = await prisma.patient.findMany({
    where: {
      nextReassessmentAt: { lte: now },
      portalAccount: { isNot: null },
    },
    select: { id: true, name: true },
  });

  let sent = 0;
  for (const patient of duePatients) {
    const nextReminderAt = nextMonthlyReminderAt(now);
    const claimed = await prisma.$transaction(async (tx) => {
      const claim = await tx.patient.updateMany({
        where: { id: patient.id, nextReassessmentAt: { lte: now } },
        data: { nextReassessmentAt: nextReminderAt },
      });
      if (claim.count !== 1) return false;

      await tx.message.create({
        data: {
          patientId: patient.id,
          subject: 'Time to book your reassessment',
          content: `Hi ${patient.name},\n\nIt’s time to book your reassessment so we can review your progress and update your plan as needed.\n\nBook here: https://movenetics.janeapp.com/#/staff_member/30\n\nIf you have any questions, send me a message here.\n\nDr. Spencer Barber`,
          senderType: 'CLINICIAN',
          senderName: 'Dr. Spencer Barber',
          senderEmail: null,
        },
      });
      await tx.clinicalNote.create({
        data: {
          patientId: patient.id,
          note: 'Automated monthly reassessment booking reminder sent to patient.',
          practitionerId: null,
        },
      });
      return true;
    });
    if (claimed) sent += 1;
  }

  return { due: duePatients.length, sent };
}

export function startReassessmentReminderScheduler() {
  if (process.env.ENABLE_MONTHLY_REASSESSMENT_REMINDERS !== 'true') {
    console.log('ℹ️ Monthly reassessment reminders are disabled');
    return;
  }

  const run = async () => {
    try {
      const result = await sendDueReassessmentReminders();
      console.log(`✅ Reassessment reminder check complete: ${result.sent}/${result.due} sent`);
    } catch (error) {
      console.error('❌ Reassessment reminder check failed', error);
    }
  };

  const initial = setTimeout(run, 60_000);
  initial.unref();
  const interval = setInterval(run, 24 * 60 * 60 * 1000);
  interval.unref();
}
