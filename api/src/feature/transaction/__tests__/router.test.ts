import bodyParser from "body-parser";
import express, { Express } from "express";
import bcrypt from "bcrypt";
import request from "supertest";

import { User } from "@prisma/client";
import { InMemoryUserRepository } from "../../auth/repository";
import { AuthService, TokenService } from "../../auth/service";
import {
  InMemoryTransactionRepository,
  InMemoryTransactionRequestRepository,
} from "../repository";
import { transactionRequestRouter, transactionRouter } from "../route";
import { TransactionRequestService, TransactionService } from "../service";

const users: User[] = [
  {
    id: "1",
    email: "test@gmail.com",
    password: bcrypt.hashSync("hash123", 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "2",
    email: "test2@gmail.com",
    password: bcrypt.hashSync("hash321", 10),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const generateToken = (id: string) => {
  const user = users.find((user) => user.id === id)!;
  return TokenService.generate(user);
};

describe("transaction router", () => {
  let app: Express;
  let transactionService: TransactionService;
  let transactionRequestService: TransactionRequestService;
  let userRepository: InMemoryUserRepository;
  let transactionRepository: InMemoryTransactionRepository;
  let transactionRequestRepository: InMemoryTransactionRequestRepository;
  let authService: AuthService;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository(users);
    transactionRepository = new InMemoryTransactionRepository([]);
    transactionRequestRepository = new InMemoryTransactionRequestRepository([]);

    authService = new AuthService(userRepository);
    transactionService = new TransactionService(
      transactionRepository,
      transactionRequestRepository
    );
    transactionRequestService = new TransactionRequestService(
      transactionRequestRepository
    );

    app = express();
    app.use(bodyParser.json());
    app.use(
      "/api/v1/transaction",
      transactionRouter(transactionService, authService)
    );
    app.use(
      "/api/v1/transaction/request",
      transactionRequestRouter(transactionRequestService, authService)
    );
  });

  it("should create transactioRequest, then pay", async () => {
    await request(app)
      .post("/api/v1/transaction/request/create")
      .set({ authorization: generateToken("1") })
      .send({
        amount: 100,
        description: "test description",
      })
      .expect(200);

    await request(app)
      .post("/api/v1/transaction/pay")
      .set({ authorization: generateToken("2") })
      .send({
        requestId: "1",
      })
      .expect(200);

    expect(await transactionService.getBalance("1")).toBe(100);
    expect(await transactionService.getBalance("2")).toBe(-100);
  });
});
