import { useMachine } from "@xstate/react";
import constate from "constate";
import { assign, createMachine } from "xstate";

import { authAPI } from "@/api/auth";

type AuthState = {
  user: {
    email: string;
  } | null;
  login: {
    email: string;
    password: string;
  };
  register: {
    email: string;
    password: string;
    passwordAgain: string;
  };
};

const initialState: AuthState = {
  user: null,
  login: {
    email: "",
    password: "",
  },
  register: {
    email: "",
    password: "",
    passwordAgain: "",
  },
};

const ACCESS_TOKEN_KEY = "accessToken";
const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const passwordReg =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const saveToken = (token: string) =>
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
const clearToken = () => localStorage.removeItem(ACCESS_TOKEN_KEY);
const clearUser = () => null;

const parseJwt = (token: string) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload;
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const authorizationMachine = (api = authAPI) =>
  createMachine<AuthState>(
    {
      id: "authorization",
      initial: "initializing",
      context: initialState,
      states: {
        initializing: {
          invoke: {
            id: "initialization",
            src: "initialization",
            onDone: {
              target: "loggedIn",
              actions: ["extractUser"],
            },
            onError: {
              target: "loggedOut",
              actions: ["clearToken"],
            },
          },
        },
        authenticating: {
          invoke: {
            id: "authenticateUser",
            src: "authenticateUser",
            onDone: {
              target: "loggedIn",
              actions: ["saveToken", "extractUser", "clearLoginIn"],
            },
            onError: {
              target: "loggedOut.authFailed",
              actions: "clearLoginIn",
            },
          },
        },
        registrating: {
          invoke: {
            id: "signUpUser",
            src: "signUpUser",
            onDone: {
              target: "loggedIn",
              actions: ["saveToken", "extractUser", "clearSignUp"],
            },
            onError: {
              target: "loggedOut.signUpFailed",
              actions: "clearSignUp",
            },
          },
        },
        loggedOut: {
          initial: "noErrors",
          states: {
            noErrors: {},
            invalidEmail: {},
            invalidPassword: {},
            invalidPasswordAgain: {},
            authFailed: {},
            signUpFailed: {},
            signUpSuccess: {},
          },
          on: {
            allways: {
              target: ".noErrors",
            },
            SIGN_UP: [
              {
                target: ".invalidEmail",
                cond: "checkEmail",
              },
              {
                target: ".invalidPassword",
                cond: "checkPassword",
              },
              {
                target: ".invalidPasswordAgain",
                cond: "checkPasswordAgain",
              },
              {
                target: "registrating",
                actions: "saveDataRegistration",
              },
            ],
            LOG_IN: [
              {
                target: ".invalidEmail",
                cond: "checkEmail",
              },
              {
                target: "authenticating",
                actions: "saveDataLogin",
              },
            ],
          },
        },
        loggedIn: {
          on: {
            LOG_OUT: {
              target: "loggedOut",
              actions: ["clearToken", "clearUser"],
            },
          },
        },
      },
    },
    {
      actions: {
        saveToken: (_, e) => saveToken(e.data),
        clearToken: () => clearToken(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        clearUser: assign({ user: clearUser() }) as any,
        extractUser: assign({
          user: (_, e) => parseJwt(e.data),
        }),
        clearSignUp: assign(initialState),
        clearLoginIn: assign(initialState),
        saveDataRegistration: assign({
          register: (_, e) => ({
            email: e.email,
            password: e.password,
            passwordAgain: e.passwordAgain,
          }),
        }),
        saveDataLogin: assign({
          login: (_, e) => ({
            email: e.email,
            password: e.password,
          }),
        }),
      },
      guards: {
        checkEmail: (_, e) => !emailReg.test(e.email),
        checkPassword: (_, e) => !passwordReg.test(e.password),
        checkPasswordAgain: (_, e) => e.passwordAgain !== e.password,
      },
      services: {
        initialization: async () => {
          try {
            const token = api.initialization();
            return token;
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              throw new Error(e.message);
            }
            throw new Error(`Something went wrong ${e}`);
          }
        },
        authenticateUser: async ctx => {
          const { login } = ctx;
          try {
            const token = await api.authenticate(login.email, login.password);
            return token;
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              throw new Error(e.message);
            }
            throw new Error(`Something went wrong ${e}`);
          }
        },
        signUpUser: async ctx => {
          const { register } = ctx;
          try {
            const token = await api.signUp(register.email, register.password);
            return token;
          } catch (e) {
            console.error(e);
            if (e instanceof Error) {
              throw new Error(e.message);
            }
            throw new Error(`Something went wrong ${e}`);
          }
        },
      },
    }
  );

const machine = authorizationMachine();
const useAuthMachine = () => useMachine(machine);

export const [AuthProvider, useAuth] = constate(useAuthMachine);
