import api from "./api.js";

export async function login({ identifier, password }) {
  const payload = { password };
  if (identifier) {
    payload.identifier = identifier;
  }
  const response = await api.post("/api/auth/login", payload);
  return response.data?.data ?? response.data;
}

export async function register({ username, email, password }) {
  const response = await api.post("/api/auth/register", {
    username,
    email,
    password,
  });
  return response.data?.data ?? response.data;
}

export async function logout() {
  const response = await api.post("/api/auth/logout");
  return response.data?.data ?? response.data;
}

export async function getMe() {
  // Skip the silent-refresh interceptor for this call.
  // If /me returns 401 it means there's genuinely no valid session
  // (no cookies at all), not an expired access token — attempting a
  // refresh here would be wrong and cause a loop on initial page load.
  const response = await api.get("/api/auth/me", { _retried: true });
  return response.data?.data?.user ?? response.data?.user ?? response.data;
}

