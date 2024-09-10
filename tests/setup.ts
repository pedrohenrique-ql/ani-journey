import 'express-async-errors';

import prisma from '@/database/prismaClient';
import { afterAll, beforeAll } from 'vitest';
import { clearDatabase } from './utils/database';

beforeAll(async () => {
  await prisma.$connect();
});

afterAll(async () => {
  await clearDatabase();
  await prisma.$disconnect();
});
