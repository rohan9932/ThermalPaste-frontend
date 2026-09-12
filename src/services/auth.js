import api from "./api.js";

export async function login({ identifier, password }) {
  const payload = { password };
  if (identifier) {
    payload.identifier = identifier;
  }
  const response = await api.post("/api/auth/login", payload);
  return response.data;
}

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", { username, email, password });
  return response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data;
}

export async function getMe() {
  const response = await api.get("/api/auth/me");
  return response.data?.user ?? response.data;
}
