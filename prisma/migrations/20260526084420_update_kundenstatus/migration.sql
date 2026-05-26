/*
  Warnings:

  - The values [NEUKUNDE,BESTANDSKUNDE] on the enum `KundenStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "KundenStatus_new" AS ENUM ('AKTIV', 'INAKTIV');
ALTER TABLE "Customer" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Customer" ALTER COLUMN "status" TYPE "KundenStatus_new" USING ("status"::text::"KundenStatus_new");
ALTER TYPE "KundenStatus" RENAME TO "KundenStatus_old";
ALTER TYPE "KundenStatus_new" RENAME TO "KundenStatus";
DROP TYPE "KundenStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "interessentennummer" TEXT,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;
