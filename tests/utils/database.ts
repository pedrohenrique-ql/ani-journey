import prisma from '@/database/prismaClient';

export async function clearDatabase() {
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
}
