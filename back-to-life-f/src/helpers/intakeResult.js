export function normalizeIntakeSubmissionResult(result) {
  const score = Number(result?.srsScore?.srsScore);
  const phase = result?.phase;
  const patient = result?.patient;

  if (!result?.success || !patient?.name || !patient?.email || !Number.isFinite(score) || !phase) {
    throw new Error('Backend returned an incomplete SRS result');
  }

  return {
    patient,
    score,
    phase,
    portalPatientData: {
      name: patient.name,
      email: patient.email,
      score: `${score}/11`,
      phase,
      setupToken: result.setupToken,
      portalAccountExists: Boolean(result.portalAccountExists),
      timestamp: new Date().toISOString()
    }
  };
}
