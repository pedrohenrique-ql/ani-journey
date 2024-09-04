import prisma from '@/database/prismaClient';
import { LoginInput } from './validators/LoginValidator';
import { UnauthorizedError } from '@/errors/http';
import { AccessTokenPayload, createJWT, RefreshTokenPayload, verifyJWT, verifyPassword } from '@/utils/auth';
import { Session, User } from '@prisma/client';
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

    await this.deleteExpiredSessions(user.id);
    const userSession = await this.createSession(user.id);

    const accessToken = await createJWT<AccessTokenPayload>(
      { userId: user.id, role: user.role, sessionId: userSession.id },
      JWT_ACCESS_TOKEN_EXPIRATION,
    );

    const refreshToken = await createJWT<RefreshTokenPayload>(
      { userId: user.id, sessionId: userSession.id },
      process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '',
    );

    return { accessToken, refreshToken };
  }

  async getRefreshToken(inputData: RefreshInput) {
    const { sessionId, userId } = await verifyJWT<RefreshTokenPayload>(inputData.refreshToken);

    const refreshToken = await prisma.session.findUnique({
      where: { id: sessionId, userId, expiresAt: { gte: new Date() } },
    });

    if (!refreshToken) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedError('Invalid refresh token.');
    }

    const accessToken = await createJWT<AccessTokenPayload>(
      { userId: user.id, role: user.role, sessionId },
      JWT_ACCESS_TOKEN_EXPIRATION,
    );

    return { accessToken };
  }

  async logout(sessionId: Session['id']) {
    await prisma.session.deleteMany({ where: { id: sessionId } });
  }

  private async createSession(userId: User['id']) {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + parseInt(JWT_REFRESH_TOKEN_EXPIRATION));

    const refreshToken = await prisma.session.create({
      data: {
        id: createId(),
        userId,
        expiresAt,
      },
    });

    return refreshToken;
  }

  private async deleteExpiredSessions(userId: User['id']) {
    await prisma.session.deleteMany({
      where: {
        userId,
        expiresAt: { lt: new Date() },
      },
    });
  }
}

export default AuthService;
