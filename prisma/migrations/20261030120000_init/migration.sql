-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL,
    "consentText" TEXT NOT NULL,
    "fund" TEXT,
    "adVersion" TEXT,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmContent" TEXT,
    "utmTerm" TEXT,
    "unsubscribedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FundSnapshot" (
    "ticker" TEXT NOT NULL,
    "field" TEXT NOT NULL,
    "value" DECIMAL(65,30) NOT NULL,
    "currency" TEXT,
    "asOf" TIMESTAMP(3) NOT NULL,
    "fetchedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "source" TEXT NOT NULL DEFAULT 'Alpha Vantage',

    CONSTRAINT "FundSnapshot_pkey" PRIMARY KEY ("ticker","field")
);

-- CreateIndex
CREATE UNIQUE INDEX "Lead_email_key" ON "Lead"("email");

