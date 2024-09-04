import prisma from '@/database/prismaClient';
import { LoginInput } from './validators/LoginValidator';
import { UnauthorizedError } from '@/errors/http';
import { AccessTokenPayload, createJWT, RefreshTokenPayload, verifyJWT, verifyPassword } from '@/utils/auth';
import { User } from '@prisma/client';
import { createId } from '@paralleldrive/cuid2';
import { RefreshInput } from './validators/RefreshValidator';

const JWT_ACCESS_TOKEN_EXPIRATION = process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? '';
const JWT_REFRESH_TOKEN_EXPIRATION = process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '';

class AuthService {
  async login(inputData: LoginInput) {
    const user = await prisma.user.findUnique({
      where: { email: inputData.email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const isPasswordValid = await verifyPassword(inputData.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials.');
    }

    const userRefreshToken = await this.createRefreshToken(user.id);

    const [accessToken, refreshToken] = await Promise.all([
      createJWT<AccessTokenPayload>({ userId: user.id, role: user.role }, JWT_ACCESS_TOKEN_EXPIRATION),
      createJWT<RefreshTokenPayload>(
        { userId: user.id, refreshTokenId: userRefreshToken.id },
        process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '',
      ),
    ]);

    return { accessToken, refreshToken };
  }

  private async createRefreshToken(userId: User['id']) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(JWT_REFRESH_TOKEN_EXPIRATION));

    const refreshToken = await prisma.refreshToken.create({
      data: {
        id: createId(),
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  async getRefreshToken(inputData: RefreshInput) {
    const { refreshTokenId, userId } = await verifyJWT<RefreshTokenPayload>(inputData.refreshToken);

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: refreshTokenId, userId, expiresAt: { gte: new Date() } },
    });

    if (!refreshToken) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const accessToken = await createJWT<AccessTokenPayload>(
      { userId: user.id, role: user.role },
      JWT_ACCESS_TOKEN_EXPIRATION,
    );

    return { accessToken };
  }
}

export default AuthService;
