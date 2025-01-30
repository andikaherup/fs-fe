-- CreateEnum
CREATE TYPE "Status" AS ENUM ('OPEN', 'RESOLVED');

-- CreateEnum
CREATE TYPE "Urgency" AS ENUM ('NONE_URGENT', 'LESS_URGENT', 'URGENT', 'EMERGENCY');

-- CreateTable
CREATE TABLE "MaintenanceRequest" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'OPEN',
    "urgency" "Urgency" NOT NULL DEFAULT 'NONE_URGENT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MaintenanceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MaintenanceRequest_status_idx" ON "MaintenanceRequest"("status");

-- CreateIndex
CREATE INDEX "MaintenanceRequest_urgency_idx" ON "MaintenanceRequest"("urgency");
