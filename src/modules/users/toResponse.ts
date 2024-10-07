import { User } from '@prisma/client';

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
}

export function toUserResponse(user: User) {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt.toISOString(),
  };
}
