import express from "express";
import { IAuthService, TokenService } from "./service";
import { validateLogin, validateRegistration } from "./validator";

export const authRouter = (authSerice: IAuthService) => {
  const authRouter = express.Router();
  authRouter.post("/login", validateLogin, async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await authSerice.login(email, password);
      res.status(200).json({ accessToken: TokenService.generate(user) });
    } catch (err) {
      if (err instanceof Error) {
        res.status(401).json({ error: err.message }).send();
      } else {
        res.status(500).json({ error: "Unknown error" }).send();
      }
    }
  });
  authRouter.post("/register", validateRegistration, async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await authSerice.register(email, password);
      res.status(200).json({ accessToken: TokenService.generate(user) });
    } catch (err) {
      if (err instanceof Error) {
        console.error(err.stack);
        res.status(409).json({ error: err.message }).send();
      } else {
        res.status(500).json({ error: "Unknown error" }).send();
      }
    }
  });

  return authRouter;
};
