-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'MITARBEITER');

-- CreateEnum
CREATE TYPE "Anrede" AS ENUM ('HERR', 'FRAU', 'DIVERS');

-- CreateEnum
CREATE TYPE "KundenStatus" AS ENUM ('NEUKUNDE', 'BESTANDSKUNDE', 'INAKTIV');

-- CreateEnum
CREATE TYPE "Sparte" AS ENUM ('GEBAEUDEREINIGUNG', 'HANDWERK', 'GLAS_SONDER_GARTEN', 'ENERGIE_PERSONAL', 'ALLGEMEIN');

-- CreateEnum
CREATE TYPE "AngebotsStatus" AS ENUM ('OFFEN', 'ENTSCHEIDUNG_OFFEN', 'BEAUFTRAGT', 'ABGELEHNT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'MITARBEITER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Customer" (
    "id" TEXT NOT NULL,
    "kdNrGebaeudereinigung" TEXT,
    "kdNrHandwerk" TEXT,
    "kdNrEnergie" TEXT,
    "name" TEXT NOT NULL,
    "strasse" TEXT,
    "plz" TEXT,
    "ort" TEXT,
    "telefon" TEXT,
    "fax" TEXT,
    "email" TEXT,
    "web" TEXT,
    "branche" TEXT,
    "status" "KundenStatus" NOT NULL DEFAULT 'NEUKUNDE',
    "entscheider" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactPerson" (
    "id" TEXT NOT NULL,
    "anrede" "Anrede",
    "vorname" TEXT,
    "nachname" TEXT NOT NULL,
    "email" TEXT,
    "telefon" TEXT,
    "rolle" TEXT,
    "firma" TEXT,
    "isHauptansprechpartner" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "customerId" TEXT NOT NULL,
    "buildingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContactPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Building" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "objektNummer" TEXT,
    "auftragsNummer" TEXT,
    "kategorie" TEXT,
    "name" TEXT NOT NULL,
    "strasse" TEXT,
    "plz" TEXT,
    "ort" TEXT,
    "bereich" "Sparte",
    "verantwortlicher" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Building_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "buildingId" TEXT,
    "sparte" "Sparte" NOT NULL,
    "angebotsNummer" TEXT,
    "angebotsDatum" TIMESTAMP(3),
    "angebotsSumme" DOUBLE PRECISION,
    "status" "AngebotsStatus" NOT NULL DEFAULT 'OFFEN',
    "auftragsDatum" TIMESTAMP(3),
    "auftragsSumme" DOUBLE PRECISION,
    "verantwortlicher" TEXT,
    "bearbeiter" TEXT,
    "beschreibung" TEXT,
    "gewerk" TEXT,
    "bauphaseBeginn" TIMESTAMP(3),
    "bauphaseEnde" TIMESTAMP(3),
    "rechnungNummer" TEXT,
    "rechnungDatum" TIMESTAMP(3),
    "rechnungSumme" DOUBLE PRECISION,
    "rgBezahlt" BOOLEAN,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Customer_name_idx" ON "Customer"("name");

-- CreateIndex
CREATE INDEX "ContactPerson_customerId_idx" ON "ContactPerson"("customerId");

-- CreateIndex
CREATE INDEX "ContactPerson_buildingId_idx" ON "ContactPerson"("buildingId");

-- CreateIndex
CREATE INDEX "Building_customerId_idx" ON "Building"("customerId");

-- CreateIndex
CREATE INDEX "Offer_customerId_idx" ON "Offer"("customerId");

-- CreateIndex
CREATE INDEX "Offer_status_idx" ON "Offer"("status");

-- CreateIndex
CREATE INDEX "Offer_sparte_idx" ON "Offer"("sparte");

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactPerson" ADD CONSTRAINT "ContactPerson_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Building" ADD CONSTRAINT "Building_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building"("id") ON DELETE SET NULL ON UPDATE CASCADE;
