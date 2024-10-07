import prisma from '@/database/prismaClient';

class StatisticService {
  async get() {
    const usersCount = await prisma.user.count();
    const reviewsCount = await prisma.animeReview.count();

    return {
      users: usersCount,
      reviews: reviewsCount,
    };
  }
}

export default StatisticService;
