import prisma from '@/database/client';
import { GetUserByIdInput } from './validators/GetUserByIdValidator';

class UserService {
  async getById(inputData: GetUserByIdInput) {
    return await prisma.user.findUnique({
      where: { id: inputData.id },
    });
  }
}

export default UserService;
