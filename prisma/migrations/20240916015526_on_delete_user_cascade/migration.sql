-- DropForeignKey
ALTER TABLE "AnimeReview" DROP CONSTRAINT "AnimeReview_userId_fkey";

-- DropForeignKey
ALTER TABLE "FavoriteAnime" DROP CONSTRAINT "FavoriteAnime_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserAnime" DROP CONSTRAINT "UserAnime_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserAnime" ADD CONSTRAINT "UserAnime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnimeReview" ADD CONSTRAINT "AnimeReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FavoriteAnime" ADD CONSTRAINT "FavoriteAnime_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
