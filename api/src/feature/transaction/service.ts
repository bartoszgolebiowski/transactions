import { Transaction, TransactionRequest } from "@prisma/client";
import {
  ITransactionRepository,
  ITransactionRequestRepository,
} from "./repository";

export interface ITransactionService {
  getBalance(userId: string): Promise<number>;
  pay(userId: string, requestId: string): Promise<Transaction>;
}

export interface ITransactionRequestService {
  getDetails(id: string): Promise<TransactionRequest | null>;
  deactive(id: string, userId: string): Promise<TransactionRequest>;
  create(
    data: Parameters<ITransactionRequestRepository["save"]>[0]
  ): Promise<TransactionRequest>;
}

export class TransactionService implements ITransactionService {
  private readonly transactionRepository: ITransactionRepository;
  private readonly transactionRequestRepository: ITransactionRequestRepository;
  constructor(
    transactionRepository: ITransactionRepository,
    transactionRequestRepository: ITransactionRequestRepository
  ) {
    this.transactionRepository = transactionRepository;
    this.transactionRequestRepository = transactionRequestRepository;
  }

  async getBalance(userId: string): Promise<number> {
    const transactions = await this.transactionRepository.getAllForUser(userId);
    return transactions.reduce((acc, transaction) => {
      if (transaction.receiverId === userId) {
        return acc + transaction.amount;
      }
      return acc - transaction.amount;
    }, 0);
  }

  async pay(senderId: string, requestId: string): Promise<Transaction> {
    const request = await this.transactionRequestRepository.getById(requestId);
    if (!request) {
      throw new Error("Request not found");
    }
    if (!request.active) {
      throw new Error("Transaction request is not active");
    }
    return this.transactionRepository.save({
      amount: request.amount,
      senderId,
      receiverId: request.ownerId,
    });
  }
}

export class TransactionRequestService implements ITransactionRequestService {
  private readonly transactionRequestRepository: ITransactionRequestRepository;

  constructor(transactionRequestRepository: ITransactionRequestRepository) {
    this.transactionRequestRepository = transactionRequestRepository;
  }

  async getDetails(id: string): Promise<TransactionRequest | null> {
    return this.transactionRequestRepository.getById(id);
  }

  async create(
    data: Parameters<ITransactionRequestRepository["save"]>[0]
  ): Promise<TransactionRequest> {
    if (data.amount < 0) {
      throw new Error("Amount should be greater than 0");
    }
    return this.transactionRequestRepository.save(data);
  }

  async deactive(id: string): Promise<TransactionRequest> {
    const transactionRequest = await this.transactionRequestRepository.getById(
      id
    );
    if (!transactionRequest) {
      throw new Error("Transaction request not found");
    }
    return this.transactionRequestRepository.update({
      ...transactionRequest,
      active: false,
    });
  }
}
