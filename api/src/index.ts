import {
  PrismaTransactionRepository,
  PrismaTransactionRequestRepository,
} from "./feature/transaction/repository";
import {
  TransactionRequestService,
  TransactionService,
} from "./feature/transaction/service";
import { PrismaClient } from "@prisma/client";
import { PrismaUserRepository } from "./feature/auth/repository";
import { AuthService } from "./feature/auth/service";
import { Configuration } from "./config/config";

const prismaClient = new PrismaClient();

//repositories
const userRepository = new PrismaUserRepository(prismaClient);
const transactionRepository = new PrismaTransactionRepository(prismaClient);
const transactionRquestRepository = new PrismaTransactionRequestRepository(
  prismaClient
);

//services
const authService = new AuthService(userRepository);
const transactionRequestService = new TransactionRequestService(
  transactionRquestRepository
);
const transactionService = new TransactionService(
  transactionRepository,
  transactionRequestService
);

new Configuration(
  authService,
  transactionService,
  transactionRequestService
).initServer();
