-- CreateEnum
CREATE TYPE "Sport" AS ENUM ('TENNIS', 'BEACH_TENNIS', 'PICKLEBALL');

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "sport" "Sport" NOT NULL DEFAULT 'TENNIS';
