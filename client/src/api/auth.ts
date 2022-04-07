export const mockAuthenticate = (
  email: string,
  password: string,
  ms = 1500
) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) resolve(email);
      else reject("oopsy doopsy");
    }, ms);
  });
};

export const mockSignUp = (email: string, password: string, ms = 1500) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < 0.5) resolve(email);
      else reject("oopsy doopsy");
    }, ms);
  });
};

export const defaultAPI = {
  authenticate: mockAuthenticate,
  signUp: mockSignUp,
};
