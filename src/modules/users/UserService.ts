import prisma from '@/database/client';
import { User } from '@prisma/client';

class UserService {
  async getAll() {
    return await prisma.user.findMany();
  }

  async findById(id: User['id']) {
    return await prisma.user.findUnique({
      where: { id },
    });
  }

  async create(username: string, email: string, password: string) {
    return await prisma.user.create({
      data: { username, email, password },
    });
  }

  async update(id: User['id'], username: string, email: string) {
    return await prisma.user.update({
      where: { id },
      data: { username, email },
    });
  }

  async delete(id: User['id']) {
    return await prisma.user.delete({
      where: { id },
    });
  }
}

export default UserService;
