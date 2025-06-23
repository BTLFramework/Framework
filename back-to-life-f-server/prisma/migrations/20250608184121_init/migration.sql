-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateTable
CREATE TABLE "Patient" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "intakeDate" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SRSScore" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "formType" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "disabilityPercentage" DOUBLE PRECISION NOT NULL,
    "vas" INTEGER NOT NULL,
    "psfs" JSONB NOT NULL,
    "beliefs" JSONB NOT NULL,
    "confidence" INTEGER NOT NULL,
    "groc" INTEGER,
    "srsScore" INTEGER NOT NULL,
    CONSTRAINT "SRSScore_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "SRSScore_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE
);
