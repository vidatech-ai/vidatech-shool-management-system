-- AlterTable
ALTER TABLE "schools" ADD COLUMN     "isTrial" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maxStudents" INTEGER,
ADD COLUMN     "smsBalance" INTEGER NOT NULL DEFAULT 0;
