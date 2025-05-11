
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User, isAuthenticated, getCurrentUser, logout } from "@/services/auth";
import { toast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isChef: boolean;
  isCustomer: boolean;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is already logged in
    if (isAuthenticated()) {
      const currentUser = getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setIsLoggedIn(false);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
  };

  const isChef = Boolean(user?.user_metadata?.role === "chef");
  const isCustomer = Boolean(user?.user_metadata?.role === "customer");

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isChef,
        isCustomer,
        login: handleLogin,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
