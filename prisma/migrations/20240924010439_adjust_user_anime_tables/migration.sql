/*
  Warnings:

  - You are about to drop the `UserAnime` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId,animeId]` on the table `AnimeReview` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,animeId]` on the table `FavoriteAnime` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `animeId` on the `AnimeReview` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `animeId` on the `FavoriteAnime` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "UserAnime" DROP CONSTRAINT "UserAnime_userId_fkey";

-- AlterTable
ALTER TABLE "AnimeReview" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "FavoriteAnime" DROP COLUMN "animeId",
ADD COLUMN     "animeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UserAnime";

-- CreateTable
CREATE TABLE "UserAnimeList" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserAnimeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAnimeStatus" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,
    "status" "WatchStatus" NOT NULL,

    CONSTRAINT "UserAnimeStatus_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAnimeList_userId_animeId_key" ON "UserAnimeList"("userId", "animeId");

-- CreateIndex
CREATE UNIQUE INDEX "UserAnimeStatus_userId_animeId_key" ON "UserAnimeStatus"("userId", "animeId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeReview_userId_animeId_key" ON "AnimeReview"("userId", "animeId");

-- CreateIndex
CREATE UNIQUE INDEX "FavoriteAnime_userId_animeId_key" ON "FavoriteAnime"("userId", "animeId");

-- AddForeignKey
ALTER TABLE "UserAnimeList" ADD CONSTRAINT "UserAnimeList_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAnimeStatus" ADD CONSTRAINT "UserAnimeStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
