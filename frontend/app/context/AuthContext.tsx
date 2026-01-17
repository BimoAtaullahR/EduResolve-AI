"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signOut as firebaseSignOut, getIdToken } from "@/lib/firebase";
import { UserRole, UserProfile, getDefaultRedirectPath } from "@/types/user";

// Storage key for user role (frontend demo - in production, get from backend)
const USER_ROLE_STORAGE_KEY = "eduskill_user_role";
const USER_PROFILE_STORAGE_KEY = "eduskill_user_profile";

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  idToken: string | null;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  setUserRole: (role: UserRole) => void;
  getRedirectPath: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRole, setUserRoleState] = useState<UserRole | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user role from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY);
      if (storedRole && Object.values(UserRole).includes(storedRole as UserRole)) {
        setUserRoleState(storedRole as UserRole);
      }

      const storedProfile = localStorage.getItem(USER_PROFILE_STORAGE_KEY);
      if (storedProfile) {
        try {
          setUserProfile(JSON.parse(storedProfile));
        } catch {
          // Invalid JSON, ignore
        }
      }
    }
  }, []);

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Get the ID token when user is authenticated
        const token = await firebaseUser.getIdToken();
        setIdToken(token);

        // Create/update user profile
        const storedRole = localStorage.getItem(USER_ROLE_STORAGE_KEY) as UserRole;
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: storedRole || UserRole.CUSTOMER,
          createdAt: new Date().toISOString(),
        };
        setUserProfile(profile);
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));

        if (!storedRole) {
          setUserRoleState(UserRole.CUSTOMER);
          localStorage.setItem(USER_ROLE_STORAGE_KEY, UserRole.CUSTOMER);
        }
      } else {
        setIdToken(null);
        setUserProfile(null);
        // Don't clear role on sign out to preserve for next login
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Set user role (called during registration)
  const setUserRole = (role: UserRole) => {
    setUserRoleState(role);
    if (typeof window !== "undefined") {
      localStorage.setItem(USER_ROLE_STORAGE_KEY, role);

      // Update profile with new role
      if (userProfile) {
        const updatedProfile = { ...userProfile, role };
        setUserProfile(updatedProfile);
        localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(updatedProfile));
      }
    }
  };

  // Get redirect path based on role
  const getRedirectPath = (): string => {
    return getDefaultRedirectPath(userRole || UserRole.CUSTOMER);
  };

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
    setUserProfile(null);
    // Clear stored data
    if (typeof window !== "undefined") {
      localStorage.removeItem(USER_ROLE_STORAGE_KEY);
      localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    }
  };

  const value: AuthContextType = {
    user,
    userProfile,
    userRole,
    loading,
    idToken,
    signOut,
    refreshToken,
    setUserRole,
    getRedirectPath,
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
