import prisma from '../db';

export const CURRENT_PATIENT_CONSENT_VERSION = '2026-09-beta-v1';

export type PatientConsentSubmission = {
  version?: unknown;
  healthInformationConsentAccepted?: unknown;
  electronicCommunicationsAccepted?: unknown;
};

export const getIntakeConsentValidationError = (
  formType: unknown,
  consent: PatientConsentSubmission | null | undefined
) => {
  if (formType !== 'Intake') return null;

  if (!consent || consent.version !== CURRENT_PATIENT_CONSENT_VERSION) {
    return 'Please review and accept the current consent notice';
  }

  if (consent.healthInformationConsentAccepted !== true) {
    return 'Consent to collect and use health information is required';
  }

  if (consent.electronicCommunicationsAccepted !== true) {
    return 'Consent to portal and email communications is required';
  }

  return null;
};

export const recordPatientConsent = async (
  patientId: number,
  consent: PatientConsentSubmission
) => prisma.patientConsent.create({
  data: {
    patientId,
    version: CURRENT_PATIENT_CONSENT_VERSION,
    healthInformationConsentAccepted: consent.healthInformationConsentAccepted === true,
    electronicCommunicationsAccepted: consent.electronicCommunicationsAccepted === true,
    source: 'intake'
  }
});
