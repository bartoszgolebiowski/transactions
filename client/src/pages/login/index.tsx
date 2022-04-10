import * as React from "react";

import LoginForm from "@/components/login/LoginForm";
import { useAuth } from "@/store/authorization";

const Login = () => {
  const [current, send] = useAuth();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    send("LOG_IN", Object.fromEntries(formData));
  };

  const isEmailError = current.matches("loggedOut.invalidEmail");
  const isAuthFailed = current.matches("loggedOut.authFailed");
  const disabled = current.matches("authenticating");

  return (
    <LoginForm
      isEmailError={isEmailError}
      isAuthFailed={isAuthFailed}
      disabled={disabled}
      onSubmit={handleSubmit}
    />
  );
};

export default Login;
