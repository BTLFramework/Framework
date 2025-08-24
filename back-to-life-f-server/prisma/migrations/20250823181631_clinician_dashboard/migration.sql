-- CreateTable
CREATE TABLE "ClinicianAssessment" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "recoveryMilestoneAchieved" BOOLEAN NOT NULL DEFAULT false,
    "clinicalProgressVerified" BOOLEAN NOT NULL DEFAULT false,
    "comments" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClinicianAssessment_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN "nextReassessmentAt" TIMESTAMP(3),
ADD COLUMN "reviewedAt" TIMESTAMP(3),
ADD COLUMN "treatmentPlan" TEXT;

-- CreateIndex
CREATE INDEX "ClinicianAssessment_patientId_createdAt_idx" ON "ClinicianAssessment"("patientId", "createdAt");

-- AddForeignKey
ALTER TABLE "ClinicianAssessment" ADD CONSTRAINT "ClinicianAssessment_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
