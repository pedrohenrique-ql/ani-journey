import prisma from '@/database/prismaClient';
import AnimeService from '../AnimeService';
import { AnimeNotFound } from '../errors';
import { CreateAnimeReviewInput } from './validators/createAnimeReviewValidator';
import { createId } from '@paralleldrive/cuid2';
import { User, AnimeReview } from '@prisma/client';
import { GetAnimeReviewsInput } from './validators/getAnimeReviewsValidator';
import { UpdateAnimeReviewInput } from './validators/updateAnimeReviewValidator';
import { AnimeReviewNotFoundError, AnimeReviewNotOwnedError } from './errors';

export interface AnimeReviewWithUser extends AnimeReview {
  user: User;
}

class AnimeReviewService {
  private animeService = new AnimeService();

  async create(inputData: CreateAnimeReviewInput & { userId: User['id'] }) {
    const anime = await this.animeService.getById({ id: inputData.animeId });

    if (!anime) {
      throw new AnimeNotFound(inputData.animeId);
    }

    const review = await prisma.animeReview.create({
      data: {
        id: createId(),
        rating: inputData.rating,
        text: inputData.text,
        animeId: inputData.animeId,
        userId: inputData.userId,
      },
    });

    return review;
  }

  async get(inputData: GetAnimeReviewsInput) {
    const animeReviews = await prisma.animeReview.findMany({
      where: {
        animeId: inputData.animeId,
      },
      include: { user: true },
      orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      skip: (inputData.page - 1) * inputData.pageSize,
      take: inputData.pageSize,
    });

    const total = await prisma.animeReview.count({ where: { animeId: inputData.animeId } });

    return { animeReviews, total };
  }

  async update(inputData: UpdateAnimeReviewInput & { userId: User['id'] }) {
    const review = await prisma.animeReview.findUnique({
      where: {
        id: inputData.reviewId,
      },
    });

    if (!review) {
      throw new AnimeReviewNotFoundError(inputData.reviewId);
    }

    if (review.userId !== inputData.userId) {
      throw new AnimeReviewNotOwnedError(inputData.reviewId);
    }

    const updatedReview = await prisma.animeReview.update({
      where: {
        id: inputData.reviewId,
      },
      data: {
        text: inputData.text,
        rating: inputData.rating,
      },
    });

    return updatedReview;
  }
}

export default AnimeReviewService;
