/*
  Warnings:

  - You are about to drop the column `description` on the `AnimeReview` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "AnimeReview" DROP COLUMN "description",
ADD COLUMN     "text" TEXT;
