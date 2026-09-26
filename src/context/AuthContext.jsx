import { createContext, useContext } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getMe, logout as logoutApi } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
    // Refetch on window focus to catch expired sessions
    refetchOnWindowFocus: true,
  });

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout request failed:", err);
    }
    // Clear cached user data — immediately sets user to null
    queryClient.setQueryData(["me"], null);
    // Remove the query so next navigation triggers a fresh fetch
    queryClient.removeQueries({ queryKey: ["me"] });
  };

  // Distinguish between:
  //   • 401 error → not authenticated, user = null (normal for logged-out visitors)
  //   • Network/5xx error → server issue, treat as not authenticated but
  //     expose the error so components can show an appropriate state
  //   • No error + data → authenticated, user = data
  const is401 =
    error?.response?.status === 401 ||
    error?.response?.data?.status === 401;

  // User is valid only if the query succeeded with real data
  // New response format: { user: {...}, profile: {...} }
  const user = !error && data?.user ? { ...data.user, ...data.profile } : null;

  // Expose whether the error is a real server/network fault (not a normal 401)
  const authError = error && !is401 ? error : null;

  const value = {
    user,
    isLoading,
    isFetching,
    error: authError, // only real errors, not "not logged in"
    refetch,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export default AuthContext;
