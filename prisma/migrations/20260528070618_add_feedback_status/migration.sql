-- CreateEnum
CREATE TYPE "FeedbackStatus" AS ENUM ('OFFEN', 'IN_ARBEIT', 'ERLEDIGT', 'VERWORFEN');

-- AlterTable
ALTER TABLE "Feedback" ADD COLUMN     "status" "FeedbackStatus" NOT NULL DEFAULT 'OFFEN';
