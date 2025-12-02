-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "dueSoonSent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "expiredSent" BOOLEAN NOT NULL DEFAULT false;
