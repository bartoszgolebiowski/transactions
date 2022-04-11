import { fetchClient } from "./client";

const authenticate = (email: string, password: string): Promise<string> => {
  return fetchClient("api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then(res => res.accessToken);
};

const signUp = (email: string, password: string): Promise<string> => {
  return fetchClient("api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  }).then(res => res.accessToken);
};

const initialization = (): string => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    return token;
  }
  throw new Error("No token");
};

export const authAPI = {
  authenticate,
  signUp,
  initialization,
};
