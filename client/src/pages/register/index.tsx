import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import RegisterForm from "@/components/register/RegisterForm";
import { useAuth } from "@/store/authorization";

const Register = () => {
  const [current, send] = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (current.matches("loggedOut.signUpSuccess")) {
      navigate("/auth/login", { replace: true });
    }
  }, [current, navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    send("SIGN_UP", Object.fromEntries(formData));
  };

  const isEmailError = current.matches("loggedOut.invalidEmail");
  const isPassword = current.matches("loggedOut.invalidPassword");
  const isPasswordAgain = current.matches("loggedOut.invalidPasswordAgain");
  const isSignUpFailed = current.matches("loggedOut.signUpFailed");
  const disabled = current.matches("registrating");

  return (
    <RegisterForm
      isEmailError={isEmailError}
      isPasswordError={isPassword}
      isPasswordAgainError={isPasswordAgain}
      isSignUpFailed={isSignUpFailed}
      disabled={disabled}
      onSubmit={handleSubmit}
    />
  );
};

export default Register;
