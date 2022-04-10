import express, { Express } from "express";
import request from "supertest";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { authRouter } from "../route";
import { AuthService } from "../service";
import { InMemoryUserRepository } from "../repository";

describe("auth route", () => {
  let app: Express;
  beforeEach(() => {
    app = express();
    app.use(bodyParser.json());
    app.use(
      "/api/v1/auth",
      authRouter(
        new AuthService(
          new InMemoryUserRepository([
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
          ])
        )
      )
    );
  });

  describe("login", () => {
    it("should return 400, when input is not valid", (done) => {
      request(app)
        .post("/api/v1/auth/login")
        .send({
          test: "test",
        })
        .expect(400)
        .end((err, res) => {
          done();
        });
    });

    it("should return 401, when no user is found", (done) => {
      request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test3@gmail.com",
          password: "123",
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toBe("User not found");
          done();
        });
    });

    it("should return 401, when wrong password", (done) => {
      request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@gmail.com",
          password: "123",
        })
        .expect(401)
        .end((err, res) => {
          expect(res.body.error).toBe("Password is incorrect");
          done();
        });
    });

    it("should return 200 with accessToken, when email and password match", (done) => {
      request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "test@gmail.com",
          password: "hash123",
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.accessToken).toBeDefined();
          done();
        });
    });
  });

  describe("register", () => {
    it("should return 400, when input is not valid", (done) => {
      request(app)
        .post("/api/v1/auth/register")
        .send({
          test: "test",
        })
        .expect(400)
        .end((err, res) => {
          done();
        });
    });

    it("should return 409, when user already exists", (done) => {
      request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@gmail.com",
          password: bcrypt.hashSync("hash123", 10),
        })
        .expect(409)
        .end((err, res) => {
          expect(res.body.error).toBe("User already exists");
          done();
        });
    });

    it("should return 200, when new user is created", (done) => {
      request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test3@gmail.com",
          password: "123321qweasdzxc",
        })
        .expect(200)
        .end((err, res) => {
          expect(res.body.accessToken).toBeDefined();
          done();
        });
    });
  });
});
