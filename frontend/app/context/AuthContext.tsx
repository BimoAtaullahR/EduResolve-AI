"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "firebase/auth";
import { onAuthStateChange, signOut as firebaseSignOut, getIdToken } from "@/lib/firebase";
import { UserRole, UserProfile, getDefaultRedirectPath } from "@/types/user";

// Storage key prefix for user role (stored per user UID for persistence)
const USER_ROLE_STORAGE_PREFIX = "eduskill_user_role_";

// Helper to get role storage key for a specific user
const getRoleStorageKey = (uid: string) => `${USER_ROLE_STORAGE_PREFIX}${uid}`;

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  idToken: string | null;
  signOut: () => Promise<void>;
  refreshToken: () => Promise<string | null>;
  setUserRole: (role: UserRole, uid?: string) => void;
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

  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        // Get the ID token when user is authenticated
        const token = await firebaseUser.getIdToken();
        setIdToken(token);

        // Get stored role for this specific user (by UID)
        const storedRole = localStorage.getItem(getRoleStorageKey(firebaseUser.uid));
        const role = storedRole && Object.values(UserRole).includes(storedRole as UserRole) ? (storedRole as UserRole) : UserRole.CUSTOMER; // Default to customer if no role stored

        setUserRoleState(role);

        // Create user profile
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          role: role,
          createdAt: new Date().toISOString(),
        };
        setUserProfile(profile);

        console.log(`User ${firebaseUser.uid} logged in with role: ${role}`);
      } else {
        setIdToken(null);
        setUserProfile(null);
        setUserRoleState(null);
      }

      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Set user role (stored per user UID)
  const setUserRole = (role: UserRole, uid?: string) => {
    const userId = uid || user?.uid;

    if (!userId) {
      console.warn("Cannot set role: No user ID available");
      return;
    }

    setUserRoleState(role);

    // Store role for this specific user (persists across logout/login)
    localStorage.setItem(getRoleStorageKey(userId), role);
    console.log(`Role set for user ${userId}: ${role}`);

    // Update profile with new role
    if (userProfile) {
      const updatedProfile = { ...userProfile, role };
      setUserProfile(updatedProfile);
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

  // Sign out (don't clear role - it's tied to user ID, not session)
  const signOut = async () => {
    await firebaseSignOut();
    setUser(null);
    setIdToken(null);
    setUserProfile(null);
    setUserRoleState(null);
    // Note: We do NOT clear the role from localStorage
    // The role is tied to the user's UID and should persist
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
