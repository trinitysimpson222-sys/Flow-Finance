-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "PlaidItem" (
    "id" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'plaid',
    "institutionId" TEXT NOT NULL,
    "institutionName" TEXT,
    "institutionLogo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlaidItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "plaidId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nickname" TEXT,
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "mask" TEXT,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "metadata" TEXT,
    "url" TEXT,
    "itemId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccountBalance" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "available" DOUBLE PRECISION,
    "limit" DOUBLE PRECISION,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountBalance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "plaidId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "category" TEXT,
    "merchantName" TEXT,
    "pending" BOOLEAN NOT NULL DEFAULT false,
    "fees" DOUBLE PRECISION,
    "price" DOUBLE PRECISION,
    "quantity" DOUBLE PRECISION,
    "securityId" TEXT,
    "tickerSymbol" TEXT,
    "isin" TEXT,
    "cusip" TEXT,
    "sedol" TEXT,
    "institutionSecurityId" TEXT,
    "securityName" TEXT,
    "securityType" TEXT,
    "closePrice" DOUBLE PRECISION,
    "closePriceAsOf" TIMESTAMP(3),
    "isCashEquivalent" BOOLEAN,
    "type" TEXT,
    "subtype" TEXT,
    "isoCurrencyCode" TEXT,
    "unofficialCurrencyCode" TEXT,
    "marketIdentifierCode" TEXT,
    "sector" TEXT,
    "industry" TEXT,
    "authorizedDate" TIMESTAMP(3),
    "authorizedDatetime" TIMESTAMP(3),
    "datetime" TIMESTAMP(3),
    "paymentChannel" TEXT,
    "transactionCode" TEXT,
    "personalFinanceCategory" TEXT,
    "merchantEntityId" TEXT,
    "locationAddress" TEXT,
    "locationCity" TEXT,
    "locationRegion" TEXT,
    "locationPostalCode" TEXT,
    "locationCountry" TEXT,
    "locationLat" DOUBLE PRECISION,
    "locationLon" DOUBLE PRECISION,
    "byOrderOf" TEXT,
    "payee" TEXT,
    "payer" TEXT,
    "paymentMethod" TEXT,
    "paymentProcessor" TEXT,
    "ppd_id" TEXT,
    "reason" TEXT,
    "referenceNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionDownloadLog" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "numTransactions" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TransactionDownloadLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlaidItem_itemId_key" ON "PlaidItem"("itemId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_plaidId_key" ON "Account"("plaidId");

-- CreateIndex
CREATE INDEX "AccountBalance_date_idx" ON "AccountBalance"("date");

-- CreateIndex
CREATE INDEX "Transaction_date_idx" ON "Transaction"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_accountId_plaidId_key" ON "Transaction"("accountId", "plaidId");

-- CreateIndex
CREATE INDEX "TransactionDownloadLog_accountId_createdAt_idx" ON "TransactionDownloadLog"("accountId", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "PlaidItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccountBalance" ADD CONSTRAINT "AccountBalance_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionDownloadLog" ADD CONSTRAINT "TransactionDownloadLog_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

