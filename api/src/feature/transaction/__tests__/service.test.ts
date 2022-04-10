import { TransactionRequestService, TransactionService } from "../service";
import { InMemoryTransactionRequestRepository } from "./../repository";
import { InMemoryTransactionRepository } from "../repository";

describe("Service", () => {
  describe("TransactionService", () => {
    let transactionService: TransactionService;
    beforeEach(() => {
      transactionService = new TransactionService(
        new InMemoryTransactionRepository([
          {
            id: "1",
            amount: 10,
            createdAt: new Date(),
            receiverId: "2",
            senderId: "1",
          },
          {
            id: "2",
            amount: 120,
            createdAt: new Date(),
            receiverId: "3",
            senderId: "1",
          },
          {
            id: "3",
            amount: 20,
            createdAt: new Date(),
            receiverId: "3",
            senderId: "1",
          },
          {
            id: "4",
            amount: 25,
            createdAt: new Date(),
            receiverId: "1",
            senderId: "3",
          },
        ]),
        new InMemoryTransactionRequestRepository([
          {
            id: "1",
            amount: 100,
            description: "test",
            ownerId: "1",
            createdAt: new Date(),
            active: true,
          },
          {
            id: "2",
            amount: 100,
            description: "test",
            ownerId: "1",
            createdAt: new Date(),
            active: false,
          },
        ])
      );
    });

    it("should calculate account balance", async () => {
      expect(await transactionService.getBalance("1")).toBe(-125);
    });

    it("should return 0 if user does not have any transactions", async () => {
      expect(await transactionService.getBalance("5")).toBe(0);
    });

    it("should add new transaction, balance should be reduced for userId 2, for userId 1 balance should be enlarged", async () => {
      expect(await transactionService.getBalance("1")).toBe(-125);
      expect(await transactionService.getBalance("2")).toBe(10);
      await transactionService.pay("2", "1");
      expect(await transactionService.getBalance("1")).toBe(-25);
      expect(await transactionService.getBalance("2")).toBe(-90);
    });

    it("should not add new transaction when transactionRequest is not found", async () => {
      try {
        expect(await transactionService.getBalance("1")).toBe(-125);
        expect(await transactionService.getBalance("2")).toBe(10);
        await transactionService.pay("2", "1");
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe("Transaction request not found");
        }
      }
      expect(await transactionService.getBalance("1")).toBe(-25);
      expect(await transactionService.getBalance("2")).toBe(-90);
    });

    it("should not add new transaction, transactionRequest is unactive", async () => {
      try {
        expect(await transactionService.getBalance("1")).toBe(-125);
        expect(await transactionService.getBalance("2")).toBe(10);
        await transactionService.pay("2", "2");
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe("Transaction request is not active");
        }
      }
      expect(await transactionService.getBalance("1")).toBe(-125);
      expect(await transactionService.getBalance("2")).toBe(10);
    });
  });

  describe("TransactionRequestService", () => {
    let transactionRequestService: TransactionRequestService;
    beforeEach(() => {
      transactionRequestService = new TransactionRequestService(
        new InMemoryTransactionRequestRepository([
          {
            id: "1",
            amount: 100,
            description: "test",
            ownerId: "1",
            createdAt: new Date(),
            active: true,
          },
        ])
      );
    });

    it("should return object for specific id", async () => {
      expect(await transactionRequestService.getDetails("1")).toBeDefined();
    });

    it("should return null when details does not exist", async () => {
      expect(await transactionRequestService.getDetails("2")).toBeNull();
    });

    it("should create new transaction request", async () => {
      const transactionRequest = await transactionRequestService.create({
        amount: 100,
        description: "test",
        ownerId: "1",
      });
      expect(
        await transactionRequestService.getDetails(transactionRequest.id)
      ).toBeDefined();
    });

    it("should not create new transaction request, when amount is 0", async () => {
      try {
        await transactionRequestService.create({
          amount: -100,
          description: "test",
          ownerId: "1",
        });
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe("Amount should be greater than 0");
        }
      }
    });

    it("should not create new transaction request, when amount is negative", async () => {
      try {
        await transactionRequestService.create({
          amount: -100,
          description: "test",
          ownerId: "1",
        });
      } catch (err) {
        if (err instanceof Error) {
          expect(err.message).toBe("Amount should be greater than 0");
        }
      }
    });

    it("should deactivate transaction request", async () => {
      const transactionRequest = await transactionRequestService.getDetails(
        "1"
      );
      expect(transactionRequest!.active).toBe(true);
      await transactionRequestService.deactive("1");
      const deactivatedTransactionRequest =
        await transactionRequestService.getDetails("1");
      expect(deactivatedTransactionRequest!.active).toBe(false);
    });
  });
});
