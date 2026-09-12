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
  });

  const logout = async () => {
    try {
      await logoutApi();
    } catch (err) {
      console.error("Logout request failed:", err);
    } finally {
      queryClient.setQueryData(["me"], null);
    }
  };

  const value = {
    user: data ?? null,
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
