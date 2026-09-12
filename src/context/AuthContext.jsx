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

  // User is only valid if query succeeded AND returned data.
  // If getMe threw (401), error is set and data is undefined.
  const user = (!error && data) ? data : null;

  const value = {
    user,
    isLoading,
    isFetching,
    error,
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
