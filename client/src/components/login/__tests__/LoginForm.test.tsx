import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";

import LoginForm from "../LoginForm";

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

describe("LoginForm", () => {
  it("should render 2 inputs 2 buttons and Login text", () => {
    const onSubmit = jest.fn();
    render(
      <LoginForm
        isEmailError={false}
        isAuthFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.queryAllByRole("button")).toHaveLength(2);
    expect(
      screen.getByRole("heading", {
        name: /login/i,
      })
    ).toBeInTheDocument();
  });

  it("should display email error when isEmailError true", () => {
    const onSubmit = jest.fn();
    render(
      <LoginForm
        isEmailError={true}
        isAuthFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  });

  it("should display auth failed error when isAuthFailed true", () => {
    const onSubmit = jest.fn();
    render(
      <LoginForm
        isEmailError={false}
        isAuthFailed={true}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    expect(
      screen.getByText(/login has failed, try again/i)
    ).toBeInTheDocument();
  });

  it("should display disabled buttons and inputs when disabled true", () => {
    const onSubmit = jest.fn();
    render(
      <LoginForm
        isEmailError={false}
        isAuthFailed={false}
        disabled={true}
        onSubmit={onSubmit}
      />
    );

    [
      ...screen.queryAllByRole("textbox"),
      screen.getByLabelText(/password/i),
      ...screen.queryAllByRole("button"),
    ].forEach(element => {
      expect(element).toBeDisabled();
    });
  });

  it("should invoke onSubmit after submitting form", () => {
    const onSubmit = jest.fn();
    render(
      <LoginForm
        isEmailError={false}
        isAuthFailed={false}
        disabled={false}
        onSubmit={onSubmit}
      />
    );
    userEvent.click(screen.getByRole("button", { name: /login/i }));
    expect(onSubmit).toHaveBeenCalled();
  });
});
