import waitForExpect from "wait-for-expect";
import { interpret } from "xstate";

import { authorizationMachine } from "../authorization";

describe("autorization-machine", () => {
  it("should be initialized with loggedOut state", () => {
    const machine = interpret(authorizationMachine()).start();

    expect(machine.state.value).toStrictEqual({ loggedOut: "noErrors" });
  });

  describe("SIGN_UP", () => {
    it("should be in state .invalidEmail, when email input in not email", () => {
      const machine = interpret(authorizationMachine()).start();

      machine.send("SIGN_UP", {
        email: "test",
        password: "test",
        passwordAgain: "test",
      });
      expect(machine.state.value).toStrictEqual({
        loggedOut: "invalidEmail",
      });
    });

    it("should be in state .invalidPassword, when password value is easy password", () => {
      const machine = interpret(authorizationMachine()).start();

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "test",
        passwordAgain: "test",
      });
      expect(machine.state.value).toStrictEqual({
        loggedOut: "invalidPassword",
      });
    });

    it("should be in state .invalidPasswordAgain, when passwordAgain value in not same as password value", () => {
      const machine = interpret(authorizationMachine()).start();

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
        passwordAgain: "123!@#qweash",
      });
      expect(machine.state.value).toStrictEqual({
        loggedOut: "invalidPasswordAgain",
      });
    });

    it("should go to registrating state and invoke signUpUser service, after successfully registration go to loggedOut.signUpSuccess state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn().mockResolvedValue("email"),
        authenticate: jest.fn(),
      };
      const machine = interpret(authorizationMachine(api)).start();

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
        passwordAgain: "123!@#qweasd",
      });
      expect(machine.state.context.register).toStrictEqual({
        email: "",
        password: "",
        passwordAgain: "",
      });
      expect(api.signUp).toHaveBeenCalled();
      expect(machine.state.value).toBe("registrating");
      await waitForExpect(() => {
        expect(machine.state.value).toStrictEqual({
          loggedOut: "signUpSuccess",
        });
      });
    });

    it("should go to registrating state and invoke signUpUser service, after failed registration go to loggedOut.signUpFailed state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn().mockRejectedValue("error"),
        authenticate: jest.fn(),
      };
      const machine = interpret(authorizationMachine(api)).start();

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
        passwordAgain: "123!@#qweasd",
      });
      expect(machine.state.context.register).toStrictEqual({
        email: "",
        password: "",
        passwordAgain: "",
      });
      expect(machine.state.value).toBe("registrating");
      await expect(api.signUp).rejects.toBe("error");
      expect(api.signUp).toHaveBeenCalled();
      expect(machine.state.value).toStrictEqual({
        loggedOut: "signUpFailed",
      });
    });
  });

  describe("LOG_IN", () => {
    it("should be in state .invalidEmail, when email input in not email", () => {
      const machine = interpret(authorizationMachine()).start();

      machine.send("LOG_IN", {
        email: "test",
        password: "test",
      });
      expect(machine.state.value).toStrictEqual({
        loggedOut: "invalidEmail",
      });
    });

    it("should go to authenticating state and invoke authenticateUser service, after successfully authentication go to loggedIn state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn(),
        authenticate: jest.fn().mockResolvedValue("email"),
      };
      const machine = interpret(authorizationMachine(api)).start();

      machine.send("LOG_IN", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
      });
      expect(machine.state.context.login).toStrictEqual({
        email: "",
        password: "",
      });
      expect(api.authenticate).toHaveBeenCalled();
      expect(machine.state.value).toBe("authenticating");
      await waitForExpect(() => {
        expect(machine.state.value).toBe("loggedIn");
      });
    });

    it("should go to authenticating and invoke authenticateUser service, after failed authentication go to loggedOut.authFailed state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn(),
        authenticate: jest.fn().mockRejectedValue("error"),
      };
      const machine = interpret(authorizationMachine(api)).start();

      machine.send("LOG_IN", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
      });
      expect(machine.state.context.login).toStrictEqual({
        email: "",
        password: "",
      });
      expect(machine.state.value).toBe("authenticating");
      await expect(api.authenticate).rejects.toBe("error");
      expect(api.authenticate).toHaveBeenCalled();
      expect(machine.state.value).toStrictEqual({
        loggedOut: "authFailed",
      });
    });
  });

  describe("LOG_OUT", () => {
    it("should go to state logout after LOG_OUT event when state is loggedIn", async () => {
      const machine = interpret(authorizationMachine()).start("loggedIn");
      machine.send("LOG_OUT");
      expect(machine.state.value).toStrictEqual({ loggedOut: "noErrors" });
    });
  });
});
