import express from "express";
import { ensureAuthenticated } from "../auth/middleware";
import { IAuthService } from "../auth/service";
import { ITransactionRequestService, ITransactionService } from "./service";

export const transactionRouter = (
  transactionService: ITransactionService,
  authService: IAuthService
) => {
  const transactionRouter = express.Router();

  transactionRouter.post(
    "/pay",
    ensureAuthenticated(authService),
    async (req, res) => {
      const { requestId } = req.body;
      const user = req.user;

      transactionService
        .pay(user.id, requestId)
        .then(() => {
          res.status(200).json({ status: "OK" });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );

  transactionRouter.get(
    "/balance",
    ensureAuthenticated(authService),
    async (req, res) => {
      const user = req.user;
      transactionService
        .getBalance(user.id)
        .then((balance) => {
          res.status(200).json({ balance });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );

  return transactionRouter;
};

export const transactionRequestRouter = (
  transactionRequestService: ITransactionRequestService,
  authService: IAuthService
) => {
  const transactionRequestRouter = express.Router();

  transactionRequestRouter.post(
    "/create",
    ensureAuthenticated(authService),
    async (req, res) => {
      const { amount, description } = req.body;
      const user = req.user;

      transactionRequestService
        .create({
          amount,
          description,
          ownerId: user.id,
        })
        .then((transaction) => {
          res.status(200).json(transaction);
        })
        .catch((err) => {
          console.log(err);
          res.status(500).json(err);
        });
    }
  );

  transactionRequestRouter.delete(
    "/:id",
    ensureAuthenticated(authService),
    async (req, res) => {
      const { id } = req.params;
      const user = req.user;

      transactionRequestService
        .deactive(id, user.id)
        .then(() => {
          res.status(200).json({ status: "OK" });
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );

  transactionRequestRouter.get(
    "/:id",
    ensureAuthenticated(authService),
    async (req, res) => {
      const { id } = req.params;

      transactionRequestService
        .getDetails(id)
        .then((transactionRequest) => {
          res.status(200).json(transactionRequest);
        })
        .catch((err) => {
          res.status(500).json(err);
        });
    }
  );

  return transactionRequestRouter;
};
