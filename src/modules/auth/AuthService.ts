import prisma from '@/database/prismaClient';
import { LoginInput } from './validators/LoginValidator';
import { UnauthorizedError } from '@/errors/http';
import { createJWT, verifyPassword } from '@/utils/auth';

const JWT_ACCESS_TOKEN_DURATION = process.env.JWT_ACCESS_TOKEN_DURATION ?? '';

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

    const accessToken = await createJWT({ userId: user.id, role: user.role }, JWT_ACCESS_TOKEN_DURATION);

    return { accessToken };
  }
}

export default AuthService;
