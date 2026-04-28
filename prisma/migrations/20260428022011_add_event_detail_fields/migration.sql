-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "capacity" INTEGER,
ADD COLUMN     "endAt" TIMESTAMP(3),
ADD COLUMN     "location" TEXT,
ADD COLUMN     "startAt" TIMESTAMP(3);
