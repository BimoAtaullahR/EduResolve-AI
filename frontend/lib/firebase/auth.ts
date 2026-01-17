import { signInWithPopup, GoogleAuthProvider, signOut as firebaseSignOut, onAuthStateChanged, User, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./firebase";

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

// Types
export interface AuthResult {
  success: boolean;
  user?: User;
  idToken?: string;
  error?: string;
}

/**
 * Sign in with Google using popup
 * Returns the user and ID token for backend authentication
 */
export async function signInWithGoogle(): Promise<AuthResult> {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Get the ID token to send to backend
    const idToken = await user.getIdToken();

    console.log("Google Sign-in successful");
    console.log("ID Token obtained for backend authentication");

    return {
      success: true,
      user,
      idToken,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Google Sign-in error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign up with email and password
 * Returns the user and ID token for backend authentication
 */
export async function signUpWithEmail(email: string, password: string, fullName: string): Promise<AuthResult> {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Update the user profile with the full name
    await updateProfile(user, {
      displayName: fullName,
    });

    // Get the ID token to send to backend
    const idToken = await user.getIdToken();

    console.log("Email Sign-up successful");

    return {
      success: true,
      user,
      idToken,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Email Sign-up error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign in with email and password
 * Returns the user and ID token for backend authentication
 */
export async function signInWithEmail(email: string, password: string): Promise<AuthResult> {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    // Get the ID token to send to backend
    const idToken = await user.getIdToken();

    console.log("Email Sign-in successful");

    return {
      success: true,
      user,
      idToken,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Email Sign-in error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<{ success: boolean; error?: string }> {
  try {
    await firebaseSignOut(auth);
    console.log("Sign-out successful");

    return { success: true };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    console.error("Sign-out error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Get the current user's ID token
 * Useful for making authenticated API calls to your backend
 */
export async function getIdToken(): Promise<string | null> {
  const user = auth?.currentUser;
  if (!user) return null;

  try {
    // Force refresh to get a fresh token
    const token = await user.getIdToken(true);
    return token;
  } catch (error) {
    console.error("Error getting ID token:", error);
    return null;
  }
}

/**
 * Subscribe to auth state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Get the current authenticated user
 */
export function getCurrentUser(): User | null {
  return auth?.currentUser || null;
}
