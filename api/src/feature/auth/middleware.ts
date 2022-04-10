import { Response, Request, NextFunction } from "express";
import { IAuthService } from "./service";

export const ensureAuthenticated =
  (authService: IAuthService) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        throw new Error("No token provided");
      }
      const user = await authService.me(token);
      if (!user) {
        throw new Error("User not found");
      }
      req.user = user;
      next();
    } catch (err) {
      if (err instanceof Error) {
        res.status(401).send({
          error: err.message,
        });
      }
    }
  };
