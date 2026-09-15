CREATE TABLE "PatientSetupToken" (
    "id" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientSetupToken_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "PatientSetupToken_tokenHash_key" ON "PatientSetupToken"("tokenHash");
CREATE INDEX "PatientSetupToken_patientId_expiresAt_idx" ON "PatientSetupToken"("patientId", "expiresAt");

ALTER TABLE "PatientSetupToken"
ADD CONSTRAINT "PatientSetupToken_patientId_fkey"
FOREIGN KEY ("patientId") REFERENCES "Patient"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
