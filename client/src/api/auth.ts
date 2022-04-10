const authenticate = (email: string, password: string): Promise<string> => {
  return fetch("http://localhost:5000/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("oopsy doopsy");
      } else {
        return res.json();
      }
    })
    .then(res => res.accessToken);
};

const signUp = (email: string, password: string): Promise<string> => {
  return fetch("http://localhost:5000/api/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("oopsy doopsy");
      } else {
        return res.json();
      }
    })
    .then(res => res.accessToken);
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
