import { PrismaClient, Transaction, TransactionRequest } from "@prisma/client";

type TransactionCreate = Omit<Transaction, "id" | "createdAt">;
type TransactionRequestCreate = Omit<
  TransactionRequest,
  "id" | "createdAt" | "active"
>;
type TransactionRequestUpdate = Omit<TransactionRequest, "createdAt">;

export interface ITransactionRepository {
  getAllForUser(userId: string): Promise<Transaction[]>;
  save(transaction: TransactionCreate): Promise<Transaction>;
}

export interface ITransactionRequestRepository {
  getAllActiveForUser(userId: string): Promise<TransactionRequest[]>;
  getById(id: string): Promise<TransactionRequest | null>;
  save(data: TransactionRequestCreate): Promise<TransactionRequest>;
  update(data: TransactionRequestUpdate): Promise<TransactionRequest>;
}

export class PrismaTransactionRepository implements ITransactionRepository {
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  async getAllForUser(userId: string): Promise<Transaction[]> {
    return this.prisma.transaction.findMany({
      where: {
        OR: [{ receiverId: userId }, { senderId: userId }],
      },
    });
  }
  async save(data: TransactionCreate): Promise<Transaction> {
    return this.prisma.transaction.create({
      data,
    });
  }
}

export class PrismaTransactionRequestRepository
  implements ITransactionRequestRepository
{
  private readonly prisma: PrismaClient;
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }
  getAllActiveForUser(userId: string): Promise<TransactionRequest[]> {
    return this.prisma.transactionRequest.findMany({
      where: {
        ownerId: userId,
        active: true,
      },
    });
  }
  save(data: TransactionRequestCreate): Promise<TransactionRequest> {
    return this.prisma.transactionRequest.create({
      data: {
        ...data,
        active: true,
      },
    });
  }
  update({
    id,
    ...data
  }: TransactionRequestUpdate): Promise<TransactionRequest> {
    return this.prisma.transactionRequest.update({
      where: { id },
      data,
    });
  }
  getById(id: string): Promise<TransactionRequest | null> {
    return this.prisma.transactionRequest.findFirst({
      where: { id },
    });
  }
}

export class InMemoryTransactionRepository implements ITransactionRepository {
  private readonly transactions: Transaction[];
  constructor(transactions: Transaction[]) {
    this.transactions = transactions;
  }
  async getAllForUser(userId: string): Promise<Transaction[]> {
    return this.transactions.filter(
      (transaction) =>
        transaction.receiverId === userId || transaction.senderId === userId
    );
  }
  async save(data: TransactionCreate): Promise<Transaction> {
    const transaction: Transaction = {
      ...data,
      id: String(this.transactions.length + 1),
      createdAt: new Date(),
    };
    this.transactions.push(transaction);
    return transaction;
  }
}

export class InMemoryTransactionRequestRepository
  implements ITransactionRequestRepository
{
  private readonly requests: TransactionRequest[];
  constructor(requests: TransactionRequest[]) {
    this.requests = requests;
  }
  async getAllActiveForUser(userId: string): Promise<TransactionRequest[]> {
    return Promise.resolve(
      this.requests.filter(
        (request) => request.ownerId === userId && request.active
      ) ?? []
    );
  }
  async save(data: TransactionRequestCreate): Promise<TransactionRequest> {
    const request: TransactionRequest = {
      ...data,
      id: String(this.requests.length + 1),
      createdAt: new Date(),
      active: true,
    };
    this.requests.push(request);
    return Promise.resolve(request);
  }
  async update({
    id,
    ...data
  }: TransactionRequestUpdate): Promise<TransactionRequest> {
    const request: TransactionRequest = {
      ...data,
      id,
      createdAt: new Date(),
    };
    const index = this.requests.findIndex((request) => request.id === id);
    this.requests[index] = request;
    return Promise.resolve(request);
  }
  getById(id: string): Promise<TransactionRequest | null> {
    return Promise.resolve(
      this.requests.find((request) => request.id === id) ?? null
    );
  }
}
