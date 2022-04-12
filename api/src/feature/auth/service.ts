import bcrypt from "bcrypt";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";

import { IUserRepository } from "./repository";

export interface IAuthService {
  me(token: string): Promise<User>;
  login(email: string, password: string): Promise<User>;
  register(email: string, password: string): Promise<User>;
}

export class AuthService implements IAuthService {
  private readonly userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }
  async me(token: string): Promise<User> {
    const user = await this.userRepository.getByEmail(
      TokenService.extract(token)
    );
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
  async login(email: string, password: string): Promise<User> {
    const user = await this.userRepository.getByEmail(email);
    if (!user) {
      throw new Error("User not found");
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new Error("Password is incorrect");
    }

    return user;
  }
  async register(email: string, password: string): Promise<User> {
    const user = await this.userRepository.getByEmail(email);
    if (user) {
      throw new Error("User already exists");
    }
    const newUser = await this.userRepository.save(
      email,
      bcrypt.hashSync(password, 10)
    );
    return newUser;
  }
}

export class TokenService {
  private static SECRET = "shhhhh";
  public static extract(token: string): string {
    const payload = jwt.verify(token, this.SECRET) as any;
    if ("email" in payload) {
      return payload.email as string;
    }
    return payload as string;
  }
  public static generate(user: User): string {
    return jwt.sign({ email: user.email }, this.SECRET);
  }
}
