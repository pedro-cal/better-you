import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiFetch } from "@/src/lib/apiClient";
import { tokenStorage } from "@/src/lib/storage";

export interface AuthUser {
  id: string;
  email: string;
  name: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isLoadingToken: boolean;
  setAuth: (token: string, user: AuthUser) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoadingToken, setIsLoadingToken] = useState(true);

  useEffect(() => {
    tokenStorage.get().then((stored) => {
      setToken(stored);
      setIsLoadingToken(false);
    });
  }, []);

  const setAuth = async (newToken: string, newUser: AuthUser) => {
    await tokenStorage.set(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const clearAuth = async () => {
    await tokenStorage.clear();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, isLoadingToken, setAuth, clearAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

function useAuthContext(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

export function useAuth() {
  const { token, user, isLoadingToken, setAuth, clearAuth } = useAuthContext();

  const login = useMutation({
    mutationFn: (vars: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: ({ data }) => setAuth(data.token, data.user),
  });

  const register = useMutation({
    mutationFn: (vars: { name: string; email: string; password: string }) =>
      apiFetch<AuthResponse>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(vars),
      }),
    onSuccess: ({ data }) => setAuth(data.token, data.user),
  });

  return {
    token,
    user,
    isAuthenticated: !!token,
    isLoadingToken,
    login,
    register,
    logout: clearAuth,
  };
}
