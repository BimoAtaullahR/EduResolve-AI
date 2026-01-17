"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signOut as firebaseSignOut, getIdToken } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  idToken: string | null;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Get the ID token when user is authenticated
        const token = await firebaseUser.getIdToken();
        setIdToken(token);
      } else {
        setIdToken(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Refresh the ID token
  const refreshToken = async (): Promise<string | null> => {
    const token = await getIdToken();
    setIdToken(token);
    return token;
  };

  // Sign out
  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setIdToken(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    idToken,
    signOut,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
