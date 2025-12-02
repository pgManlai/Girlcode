-- CreateEnum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "TaskCategory" AS ENUM ('WORK', 'HEALTH', 'LEARNING', 'PERSONAL', 'OTHER');

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "category" "TaskCategory" NOT NULL DEFAULT 'OTHER',
ADD COLUMN     "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM';
