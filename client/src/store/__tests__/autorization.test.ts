import waitForExpect from "wait-for-expect";
import { interpret } from "xstate";

import { authorizationMachine } from "../authorization";

const mockAuthenticate = (
  email: string,
  password: string,
  ms = 1500
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) resolve(email);
      else reject("oopsy doopsy");
    }, ms);
  });
};

const mockSignUp = (
  email: string,
  password: string,
  ms = 1500
): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) resolve(email);
      else reject("oopsy doopsy");
    }, ms);
  });
};

const initialization = (): string => {
  throw new Error("No Token");
};

const mockAuthAPI = {
  authenticate: mockAuthenticate,
  signUp: mockSignUp,
  initialization,
};

describe("autorization-machine", () => {
  beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => "");
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe("initialization", () => {
    it("should be initialized with initializing state", () => {
      const machine = interpret(authorizationMachine(mockAuthAPI)).start();

      expect(machine.state.value).toBe("initializing");
    });

    it("should go to loggedIn state, if initialization returns token", async () => {
      const api = {
        signUp: jest.fn(),
        authenticate: jest.fn().mockResolvedValue("email"),
        initialization: jest.fn().mockResolvedValue("token"),
      };
      const machine = interpret(authorizationMachine(api)).start();

      await waitForExpect(() => expect(machine.state.value).toBe("loggedIn"));
    });

    it("should go to loggedOut state, if initialization throws an error", async () => {
      const api = {
        signUp: jest.fn(),
        authenticate: jest.fn().mockResolvedValue("email"),
        initialization: jest.fn().mockRejectedValue("No token"),
      };
      const machine = interpret(authorizationMachine(api)).start();

      await waitForExpect(() =>
        expect(machine.state.value).toEqual({ loggedOut: "noErrors" })
      );
    });
  });

  describe("SIGN_UP", () => {
    it("should be in state .invalidEmail, when email input in not email", () => {
      const machine = interpret(authorizationMachine(mockAuthAPI)).start(
        "loggedOut"
      );

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
      const machine = interpret(authorizationMachine(mockAuthAPI)).start(
        "loggedOut"
      );

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
      const machine = interpret(authorizationMachine(mockAuthAPI)).start(
        "loggedOut"
      );

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
        initialization,
      };
      const machine = interpret(authorizationMachine(api)).start("loggedOut");

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
        passwordAgain: "123!@#qweasd",
      });
      expect(api.signUp).toHaveBeenCalled();
      expect(machine.state.value).toBe("registrating");
      await waitForExpect(() => {
        expect(machine.state.value).toBe("loggedIn");
      });
      expect(machine.state.context.register).toStrictEqual({
        email: "",
        password: "",
        passwordAgain: "",
      });
    });

    it("should go to registrating state and invoke signUpUser service, after failed registration go to loggedOut.signUpFailed state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn().mockRejectedValue("error"),
        authenticate: jest.fn(),
        initialization,
      };
      const machine = interpret(authorizationMachine(api)).start("loggedOut");

      machine.send("SIGN_UP", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
        passwordAgain: "123!@#qweasd",
      });

      expect(machine.state.value).toBe("registrating");
      await expect(api.signUp).rejects.toBe("error");
      await waitForExpect(() => {
        expect(machine.state.context.register).toStrictEqual({
          email: "",
          password: "",
          passwordAgain: "",
        });
      });
      expect(api.signUp).toHaveBeenCalled();
      expect(machine.state.value).toStrictEqual({
        loggedOut: "signUpFailed",
      });
    });
  });

  describe("LOG_IN", () => {
    it("should be in state .invalidEmail, when email input in not email", () => {
      const machine = interpret(authorizationMachine(mockAuthAPI)).start(
        "loggedOut"
      );

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
        initialization,
      };
      const machine = interpret(authorizationMachine(api)).start("loggedOut");

      machine.send("LOG_IN", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
      });
      expect(machine.state.value).toBe("authenticating");
      await waitForExpect(() => {
        expect(machine.state.value).toBe("loggedIn");
      });
      expect(machine.state.context.login).toStrictEqual({
        email: "",
        password: "",
      });
    });

    it("should go to authenticating and invoke authenticateUser service, after failed authentication go to loggedOut.authFailed state, context register object should not contain personal details from form", async () => {
      const api = {
        signUp: jest.fn(),
        authenticate: jest.fn().mockRejectedValue("error"),
        initialization,
      };
      const machine = interpret(authorizationMachine(api)).start("loggedOut");

      machine.send("LOG_IN", {
        email: "test@gmail.com",
        password: "123!@#qweasd",
      });

      expect(machine.state.value).toBe("authenticating");
      await expect(api.authenticate).rejects.toBe("error");
      await waitForExpect(() => {
        expect(machine.state.context.login).toStrictEqual({
          email: "",
          password: "",
        });
      });
      expect(machine.state.value).toStrictEqual({
        loggedOut: "authFailed",
      });
    });
  });

  describe("LOG_OUT", () => {
    it("should go to state logout after LOG_OUT event when state is loggedIn", async () => {
      const machine = interpret(authorizationMachine(mockAuthAPI)).start(
        "loggedIn"
      );
      machine.send("LOG_OUT");
      expect(machine.state.value).toStrictEqual({ loggedOut: "noErrors" });
    });
  });
});
