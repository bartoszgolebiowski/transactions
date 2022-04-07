import { useMachine } from "@xstate/react";
import constate from "constate";
import { assign, createMachine } from "xstate";

import { defaultAPI } from "@/api/auth";

type AuthState = {
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

const emailReg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
const passwordReg =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export const authorizationMachine = (api = defaultAPI) =>
  createMachine<AuthState>(
    {
      id: "authorization",
      initial: "loggedIn",
      context: initialState,
      states: {
        authenticating: {
          invoke: {
            id: "authenticateUser",
            src: "authenticateUser",
            onDone: {
              target: "loggedIn",
              actions: "clearLoginIn",
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
              target: "loggedOut.signUpSuccess",
              actions: "clearSignUp",
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
            },
          },
        },
      },
    },
    {
      actions: {
        clearSignUp: assign(initialState),
        clearLoginIn: assign(initialState),
        saveDataRegistration: (_, e) =>
          assign({
            register: {
              email: e.email,
              password: e.password,
              passwordAgain: e.passwordAgain,
            },
          }),
        saveDataLogin: (_, e) =>
          assign({
            login: {
              email: e.email,
              password: e.password,
            },
          }),
      },
      guards: {
        checkEmail: (_, e) => !emailReg.test(e.email),
        checkPassword: (_, e) => !passwordReg.test(e.password),
        checkPasswordAgain: (_, e) => e.passwordAgain !== e.password,
      },
      services: {
        authenticateUser: ctx => {
          const { login } = ctx;
          return api.authenticate(login.email, login.password);
        },
        signUpUser: ctx => {
          const { register } = ctx;
          return api.signUp(register.email, register.password);
        },
      },
    }
  );

const useAuthMachine = () => useMachine(authorizationMachine(defaultAPI));

export const [AuthProvider, useAuth] = constate(useAuthMachine);
