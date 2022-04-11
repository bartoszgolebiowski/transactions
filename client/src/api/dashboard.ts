import { fetchClientWithToken } from "./client";

export const getBalance = (): Promise<number> => {
  return fetchClientWithToken("api/v1/transaction/balance", {
    method: "GET",
  }).then(res => res.balance);
};

export const pay = (requestId: string): Promise<unknown> => {
  return fetchClientWithToken("api/v1/transaction/pay", {
    method: "POST",
    body: JSON.stringify({ requestId }),
  });
};

export type CreateTransactionRequestInput = {
  amount: number;
  description: string;
};

export type CreateTransactionRequestOutput = {
  id: string;
  active: boolean;
  amount: number;
  description: string;
  createdAt: Date;
  ownerId: string;
};

export const createTransactionRequest = (
  body: CreateTransactionRequestInput
): Promise<CreateTransactionRequestOutput> => {
  return fetchClientWithToken("api/v1/transaction/request/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
};

export const getTransactionRequestById = (
  id: string
): Promise<CreateTransactionRequestOutput> => {
  return fetchClientWithToken(`api/v1/transaction/request/${id}`, {
    method: "GET",
  });
};

export const deactiveTransactionRequest = (
  id: string
): Promise<CreateTransactionRequestOutput> => {
  return fetchClientWithToken(`api/v1/transaction/request/${id}`, {
    method: "DELETE",
  });
};

export const getUserTransactionRequests = (): Promise<
  CreateTransactionRequestOutput[]
> => {
  return fetchClientWithToken("api/v1/transaction/request", {
    method: "GET",
  }).then(res => res.transactions);
};
