import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "admin" | "editor" | "viewer";

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string, phone?: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * The CMS is a local authoring tool and its routes are compiled out of the
   * production build, so these come from .env.local — which is gitignored —
   * rather than from this file. They were hardcoded here until 27 Sep 2026,
   * which put the password in the public repository and in the shipped
   * JavaScript, where anyone could read it. Treat that one as burned.
   *
   * Unset means unusable: an empty credential must never match an empty form.
   */
  const ADMIN_CREDENTIALS = {
    email: import.meta.env.VITE_ADMIN_EMAIL ?? "",
    password: import.meta.env.VITE_ADMIN_PASSWORD ?? "",
    name: "Anshy Yadav",
    role: "admin" as UserRole,
  };
  const credentialsConfigured =
    ADMIN_CREDENTIALS.email !== "" && ADMIN_CREDENTIALS.password !== "";

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("portfolio_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("portfolio_user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check credentials against admin account
      if (
        credentialsConfigured &&
        email === ADMIN_CREDENTIALS.email &&
        password === ADMIN_CREDENTIALS.password
      ) {
        const mockUser: User = {
          id: "admin_001",
          email: ADMIN_CREDENTIALS.email,
          name: ADMIN_CREDENTIALS.name,
          role: ADMIN_CREDENTIALS.role,
          createdAt: new Date().toISOString(),
        };

        setUser(mockUser);
        localStorage.setItem("portfolio_user", JSON.stringify(mockUser));
      } else {
        throw new Error("Invalid email or password");
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, phone?: string) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Check if trying to use admin email
      if (credentialsConfigured && email === ADMIN_CREDENTIALS.email) {
        throw new Error("Email already exists");
      }

      // Check password strength
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long");
      }

      // Mock user data (in real app, this would come from backend)
      // Default role for new signups is 'viewer'
      const mockUser: User = {
        id: Math.random().toString(36).substring(7),
        email,
        name,
        phone,
        role: "viewer",
        createdAt: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem("portfolio_user", JSON.stringify(mockUser));
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("portfolio_user");
  };

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        isLoading,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}