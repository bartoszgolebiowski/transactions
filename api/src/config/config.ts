import bodyParser from "body-parser";
import express from "express";
import cors from "cors";
import { authRouter } from "../feature/auth/route";
import { IAuthService } from "../feature/auth/service";
import {
  ITransactionRequestService,
  ITransactionService,
} from "feature/transaction/service";
import {
  transactionRequestRouter,
  transactionRouter,
} from "feature/transaction/route";

interface IConfiguration {
  initServer(): void;
}

export class Configuration implements IConfiguration {
  app: express.Express;
  authService: IAuthService;
  transactionService: ITransactionService;
  transactionRequestService: ITransactionRequestService;

  constructor(
    licenceService: IAuthService,
    transactionService: ITransactionService,
    transactionRequestService: ITransactionRequestService
  ) {
    this.app = express();
    this.authService = licenceService;
    this.transactionService = transactionService;
    this.transactionRequestService = transactionRequestService;
  }

  initServer() {
    this.app.use(bodyParser.json());
    this.app.use(
      cors({
        origin: ["http://localhost:3000"],
      })
    );
    this.initRoutes();
    this.start();
  }

  initRoutes(): void {
    this.app.use("/api/v1/auth", authRouter(this.authService));
    this.app.use(
      "/api/v1/transaction",
      transactionRouter(this.transactionService, this.authService)
    );
    this.app.use(
      "/api/v1/transaction/request",
      transactionRequestRouter(this.transactionRequestService, this.authService)
    );
  }

  start(): void {
    this.app.listen(process.env.PORT || 5000, () => {
      console.log(`Express app listening at port ${process.env.PORT || 5000}`);
    });
  }
}
