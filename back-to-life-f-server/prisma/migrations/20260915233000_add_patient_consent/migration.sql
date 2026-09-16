-- Store an auditable record of the consent shown and accepted at intake.
CREATE TABLE "PatientConsent" (
    "id" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "version" TEXT NOT NULL,
    "healthInformationConsentAccepted" BOOLEAN NOT NULL,
    "electronicCommunicationsAccepted" BOOLEAN NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'intake',
    "consentedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientConsent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "PatientConsent_patientId_consentedAt_idx"
ON "PatientConsent"("patientId", "consentedAt");

ALTER TABLE "PatientConsent"
ADD CONSTRAINT "PatientConsent_patientId_fkey"
FOREIGN KEY ("patientId") REFERENCES "Patient"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
