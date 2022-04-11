const IP = "http://localhost:5000";

export const fetchClient = async (path: string, options: RequestInit = {}) => {
  const response = await fetch(`${IP}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
};

export const fetchClientWithToken = async (
  path: string,
  options: RequestInit = {}
) => {
  const response = await fetch(`${IP}/${path}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `${localStorage.getItem("accessToken")}`,
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  return response.json();
};

export default fetchClient;
