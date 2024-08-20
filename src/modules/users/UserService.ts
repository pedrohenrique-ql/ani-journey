import prisma from '@/database/client';
import { GetUserByIdInput } from './validators/GetUserByIdValidator';
import { NotFoundError } from '@/errors/http';

class UserService {
  async getById(inputData: GetUserByIdInput) {
    const user = await prisma.user.findFirst({
      where: { id: inputData.id },
    });

    if (!user) {
      throw new NotFoundError(`User ${inputData.id} not found`);
    }

    return user;
  }
}

export default UserService;
