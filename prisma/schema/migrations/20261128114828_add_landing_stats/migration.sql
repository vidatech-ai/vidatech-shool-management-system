-- CreateTable
CREATE TABLE "landing_stats" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "landing_stats_sortOrder_idx" ON "landing_stats"("sortOrder");

