/*
  Warnings:

  - You are about to drop the column `tsk11` on the `SRSScore` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SRSScore" DROP COLUMN "tsk11",
ADD COLUMN     "tsk7" JSONB;
