import axios from "axios";
import queryClient from "./queryClient.js";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ─── Silent Refresh Interceptor ────────────────────────────────────────────
//
// When an API call gets a 401, we attempt ONE silent token refresh by hitting
// POST /api/auth/refresh. The backend rotates the refresh token on every use,
// so we MUST single-flight this: if multiple 401s arrive concurrently they all
// share one in-flight refresh promise rather than each firing their own
// (which would cause the second+ calls to use an already-rotated-out token).
//
// Flow:
//   1. Request 401 arrives.
//   2. If not already refreshing, start a refresh promise.
//   3. All concurrent 401s await the SAME promise.
//   4. On success → retry every original request once.
//   5. On failure → clear auth state (user = null) → let ProtectedRoute
//      redirect to /login. Do NOT retry — throw so callers see the error.

let refreshPromise = null; // single-flight guard

api.interceptors.response.use(
  // Pass through all successful responses unchanged
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    // Only attempt a silent refresh when:
    //   • The response was a 401
    //   • We haven't already retried this exact request (avoid infinite loop)
    //   • It wasn't the refresh endpoint itself that 401'd (avoid loop)
    const is401 = error.response?.status === 401;
    const alreadyRetried = originalRequest._retried;
    const isRefreshCall = originalRequest.url?.includes("/api/auth/refresh");

    if (!is401 || alreadyRetried || isRefreshCall) {
      return Promise.reject(error);
    }

    // Mark this request so we won't retry it again
    originalRequest._retried = true;

    try {
      // Single-flight: reuse an existing refresh promise if one is already running
      if (!refreshPromise) {
        refreshPromise = axios
          .post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true })
          .finally(() => {
            // Always clear the promise slot when done (success or fail)
            refreshPromise = null;
          });
      }

      await refreshPromise;

      // Refresh succeeded — the backend has set new cookies.
      // Retry the original request (cookies are sent automatically).
      return api(originalRequest);
    } catch (refreshError) {
      // Refresh failed (refresh token expired/invalid).
      // Clear the cached user data so every ProtectedRoute
      // immediately redirects to /login.
      queryClient.setQueryData(["me"], null);
      queryClient.removeQueries({ queryKey: ["me"] });

      // Propagate the original 401 error to the caller
      return Promise.reject(error);
    }
  },
);

export default api;
