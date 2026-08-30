import { api } from "./api.js";

export async function login({ identifier, password }) {
  const payload = { password };
  if (identifier) {
    payload.identifier = identifier;
  }
  const data = await api.post("/login", payload);
  return data;
}

export async function register({ username, email, password }) {
  const data = await api.post("/register", { username, email, password });
  return data;
}

export async function logout() {
  const data = await api.post("/logout");
  return data;
}

export async function getCurrentUser() {
  const data = await api.get("/user/me");
  return data;
}
