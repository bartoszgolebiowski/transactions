import { PrismaClient, User } from "@prisma/client";

export interface IUserRepository {
  getByEmail(email: string): Promise<User | null>;
  getById(id: string): Promise<User | null>;
  save(email: string, password: string): Promise<User>;
}

export class PrismaUserRepository implements IUserRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async save(email: string, password: string): Promise<User> {
    return this.prisma.user.create({
      data: {
        email,
        password,
      },
    });
  }
  async getById(id: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        id,
      },
    });
  }
  async getByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findFirst({
      where: {
        email,
      },
    });
  }
}

export class InMemoryUserRepository implements IUserRepository {
  private readonly users: User[];
  constructor(users: User[]) {
    this.users = users;
  }
  getByEmail(email: string): Promise<User | null> {
    return Promise.resolve(
      this.users.find((user) => user.email === email) ?? null
    );
  }
  getById(id: string): Promise<User | null> {
    return Promise.resolve(this.users.find((user) => user.id === id) ?? null);
  }
  save(email: string, password: string): Promise<User> {
    if (this.users.find((user) => user.email === email)) {
      throw new Error();
    }
    const user: User = {
      id: "" + this.users.length + 1,
      email,
      password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.push(user);
    return Promise.resolve(user);
  }
}
