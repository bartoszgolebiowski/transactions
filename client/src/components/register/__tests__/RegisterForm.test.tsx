import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import * as React from "react";

import RegisterForm from "../RegisterForm";

jest.mock("react-router-dom", () => ({
  Link: ({
    children,
    to,
  }: {
    children: React.ReactElement;
    to: string;
    color: string;
  }) => <a href={to}>{children}</a>,
}));

describe("RegisterForm", () => {
  it("should render 3 inputs 2 buttons and Login text", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={false}
        isPasswordAgainError={false}
        isSignUpFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    screen
      .queryAllByLabelText(/password/i)
      .forEach(input => expect(input).toBeDefined());

    expect(screen.queryAllByRole("button")).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        name: /registration/i,
      })
    ).toBeInTheDocument();
  });

  it("should display email error when isEmailError true", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={true}
        isPasswordError={false}
        isPasswordAgainError={false}
        isSignUpFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("should display password error when isPasswordError true", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={true}
        isPasswordAgainError={false}
        isSignUpFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByText(/Password it too weak/i)).toBeInTheDocument();
  });

  it("should display passwordAgain error when isPasswordAgainError true", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={false}
        isPasswordAgainError={true}
        isSignUpFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByText(/Passwords are not the same/i)).toBeInTheDocument();
  });

  it("should display SignUpFailed message when isSignUpFailed true", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={false}
        isPasswordAgainError={false}
        isSignUpFailed={true}
        disabled={false}
        onSubmit={onSubmit}
      />
    );

    expect(
      screen.getByText(/Registration has failed, try again/i)
    ).toBeInTheDocument();
  });

  it("should display disabled buttons and inputs when disabled true", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={false}
        isPasswordAgainError={false}
        isSignUpFailed={false}
        disabled={true}
        onSubmit={onSubmit}
      />
    );

    [
      ...screen.queryAllByRole("textbox"),
      ...screen.queryAllByLabelText(/password/i),
      ...screen.queryAllByRole("button"),
    ].forEach(element => {
      expect(element).toBeDisabled();
    });
  });

  it("should invoke onSubmit after submitting form", () => {
    const onSubmit = jest.fn(e => e.preventDefault());
    render(
      <RegisterForm
        isEmailError={false}
        isPasswordError={false}
        isPasswordAgainError={false}
        isSignUpFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    userEvent.click(screen.getByRole("button", { name: /register/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
