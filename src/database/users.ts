import { randomUUID } from 'crypto';

interface User {
  id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

interface CreateUser {
  username: string;
  email: string;
}

const users: User[] = [];

class UsersRepository {
  static getUsers() {
    return users;
  }

  static findById(id: string) {
    return users.find((user) => user.id === id);
  }

  static findByEmail(email: string) {
    return users.find((user) => user.email === email);
  }

  static findByUsername(username: string) {
    return users.find((user) => user.username === username);
  }

  static createUser(createUserPayload: CreateUser) {
    users.push({
      id: randomUUID(),
      ...createUserPayload,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return users[users.length - 1];
  }

  static updateUsername(id: string, newUsername: string) {
    const index = users.findIndex((user) => user.id === id);
    const user = users[index];

    users[index] = {
      ...user,
      username: newUsername ?? user.username,
      updatedAt: new Date(),
    };
    return users[index];
  }

  static deleteUser(id: string) {
    const index = users.findIndex((user) => user.id === id);
    users.splice(index, 1);
  }
}

export default UsersRepository;
