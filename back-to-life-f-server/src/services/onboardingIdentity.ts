interface ExistingPatientIdentity {
  name: string;
  dob?: Date | string | null;
}

export interface IntakeIdentityConflict {
  code: 'PATIENT_EMAIL_EXISTS' | 'PATIENT_IDENTITY_MISMATCH';
  error: string;
}

export function getExistingPatientIntakeConflict(
  patient: ExistingPatientIdentity | null | undefined,
  formType: string | undefined,
  patientName: string,
  dob: string
): IntakeIdentityConflict | null {
  if (!patient) return null;

  if ((formType || 'Intake') !== 'Follow-Up') {
    return {
      code: 'PATIENT_EMAIL_EXISTS',
      error: 'A patient account already exists for this email. Sign in to the patient portal or choose Follow-Up Assessment.'
    };
  }

  const submittedName = patientName.trim().toLowerCase();
  const storedName = patient.name.trim().toLowerCase();
  const submittedDob = new Date(dob).toISOString().slice(0, 10);
  const storedDob = patient.dob ? new Date(patient.dob).toISOString().slice(0, 10) : null;

  if (submittedName !== storedName || !storedDob || submittedDob !== storedDob) {
    return {
      code: 'PATIENT_IDENTITY_MISMATCH',
      error: 'The follow-up details do not match the existing patient account. Please contact the clinic.'
    };
  }

  return null;
}
