/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `Patient` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Patient` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RPType" AS ENUM ('MOVEMENT', 'LIFESTYLE', 'MINDSET', 'EDUCATION', 'ADHERENCE');

-- CreateEnum
CREATE TYPE "SRSDomain" AS ENUM ('PSFS', 'VAS', 'CONFIDENCE', 'BELIEFS');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('CLINICIAN', 'PATIENT');

-- CreateEnum
CREATE TYPE "TaskType" AS ENUM ('MOVEMENT', 'PAIN_ASSESSMENT', 'MINDFULNESS', 'RECOVERY_INSIGHTS');

-- DropForeignKey
ALTER TABLE "SRSScore" DROP CONSTRAINT "SRSScore_patientId_fkey";

-- AlterTable
ALTER TABLE "Patient" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dob" TIMESTAMP(3),
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SRSScore" ADD COLUMN     "beliefStatus" TEXT,
ADD COLUMN     "clinicalProgressVerified" BOOLEAN DEFAULT false,
ADD COLUMN     "clinicianAssessed" BOOLEAN DEFAULT false,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "grocCaptured" BOOLEAN DEFAULT false,
ADD COLUMN     "lefs" JSONB,
ADD COLUMN     "ndi" JSONB,
ADD COLUMN     "odi" JSONB,
ADD COLUMN     "pcs4" JSONB,
ADD COLUMN     "recoveryMilestone" BOOLEAN DEFAULT false,
ADD COLUMN     "tdi" JSONB,
ADD COLUMN     "tsk11" JSONB,
ADD COLUMN     "ulfi" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "disabilityPercentage" DROP NOT NULL,
ALTER COLUMN "beliefs" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SRSDaily" (
    "id" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pain" DOUBLE PRECISION NOT NULL,
    "function" DOUBLE PRECISION NOT NULL,
    "psychLoad" DOUBLE PRECISION NOT NULL,
    "fa" DOUBLE PRECISION,

    CONSTRAINT "SRSDaily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" TEXT NOT NULL,
    "patientId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PatientPortal" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PatientPortal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecoveryPoint" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" "RPType" NOT NULL,
    "action" TEXT NOT NULL,
    "points" INTEGER NOT NULL,

    CONSTRAINT "RecoveryPoint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SRSBuffer" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "psfsBuffer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "vasBuffer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "confBuffer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "beliefBuffer" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "movementRP" INTEGER NOT NULL DEFAULT 0,
    "lifestyleRP" INTEGER NOT NULL DEFAULT 0,
    "mindsetRP" INTEGER NOT NULL DEFAULT 0,
    "educationRP" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SRSBuffer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RPThresholdHit" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "domain" "SRSDomain" NOT NULL,
    "windowEnd" TIMESTAMP(3) NOT NULL,
    "met" BOOLEAN NOT NULL,
    "rpTotal" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RPThresholdHit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "subject" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderType" "SenderType" NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderEmail" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MindfulnessLog" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "practice" TEXT NOT NULL,
    "mood" TEXT,

    CONSTRAINT "MindfulnessLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaskCompletion" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "taskType" "TaskType" NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sessionDuration" INTEGER,
    "pointsEarned" INTEGER,

    CONSTRAINT "TaskCompletion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SRSDaily_patientId_date_idx" ON "SRSDaily"("patientId", "date");

-- CreateIndex
CREATE INDEX "SRSDaily_date_idx" ON "SRSDaily"("date");

-- CreateIndex
CREATE UNIQUE INDEX "SRSDaily_patientId_date_key" ON "SRSDaily"("patientId", "date");

-- CreateIndex
CREATE INDEX "AssessmentResult_patientId_idx" ON "AssessmentResult"("patientId");

-- CreateIndex
CREATE INDEX "AssessmentResult_patientId_name_createdAt_idx" ON "AssessmentResult"("patientId", "name", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PatientPortal_patientId_key" ON "PatientPortal"("patientId");

-- CreateIndex
CREATE UNIQUE INDEX "PatientPortal_email_key" ON "PatientPortal"("email");

-- CreateIndex
CREATE INDEX "RecoveryPoint_patientId_category_date_idx" ON "RecoveryPoint"("patientId", "category", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SRSBuffer_patientId_key" ON "SRSBuffer"("patientId");

-- CreateIndex
CREATE INDEX "RPThresholdHit_patientId_domain_windowEnd_idx" ON "RPThresholdHit"("patientId", "domain", "windowEnd");

-- CreateIndex
CREATE UNIQUE INDEX "RPThresholdHit_patientId_domain_windowEnd_key" ON "RPThresholdHit"("patientId", "domain", "windowEnd");

-- CreateIndex
CREATE INDEX "Message_patientId_createdAt_idx" ON "Message"("patientId", "createdAt");

-- CreateIndex
CREATE INDEX "MindfulnessLog_patientId_date_idx" ON "MindfulnessLog"("patientId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "MindfulnessLog_patientId_date_key" ON "MindfulnessLog"("patientId", "date");

-- CreateIndex
CREATE INDEX "TaskCompletion_patientId_taskType_completedAt_idx" ON "TaskCompletion"("patientId", "taskType", "completedAt");

-- CreateIndex
CREATE INDEX "TaskCompletion_completedAt_idx" ON "TaskCompletion"("completedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Patient_email_key" ON "Patient"("email");

-- AddForeignKey
ALTER TABLE "SRSDaily" ADD CONSTRAINT "SRSDaily_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SRSScore" ADD CONSTRAINT "SRSScore_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PatientPortal" ADD CONSTRAINT "PatientPortal_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecoveryPoint" ADD CONSTRAINT "RecoveryPoint_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SRSBuffer" ADD CONSTRAINT "SRSBuffer_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MindfulnessLog" ADD CONSTRAINT "MindfulnessLog_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TaskCompletion" ADD CONSTRAINT "TaskCompletion_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
