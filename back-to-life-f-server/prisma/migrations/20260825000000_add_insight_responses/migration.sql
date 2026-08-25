CREATE TABLE IF NOT EXISTS "InsightResponse" (
    "id" SERIAL NOT NULL,
    "patientId" INTEGER NOT NULL,
    "insightId" INTEGER NOT NULL,
    "insightTitle" TEXT NOT NULL,
    "response" JSONB NOT NULL,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InsightResponse_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "InsightResponse_patientId_insightId_key"
ON "InsightResponse"("patientId", "insightId");

CREATE INDEX IF NOT EXISTS "InsightResponse_patientId_submittedAt_idx"
ON "InsightResponse"("patientId", "submittedAt");

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'InsightResponse_patientId_fkey'
    ) THEN
        ALTER TABLE "InsightResponse"
        ADD CONSTRAINT "InsightResponse_patientId_fkey"
        FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;
