import { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: getMe,
    retry: false,
  });

  const value = {
    user: data ?? null,
    isLoading,
    isFetching,
    error,
    refetch,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}

export default AuthContext;
