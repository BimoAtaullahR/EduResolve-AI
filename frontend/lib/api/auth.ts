// API Service for authentication with backend
// This handles communication with the Golang backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://eduresolve-backend-165734058175.asia-southeast2.run.app/api/v1" || "http://localhost:8081/api/v1";

// Types
export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    user: {
      uid: string;
      email: string;
      name: string;
      role: string;
    };
    token?: string;
  };
  error?: string;
}

export interface RegisterPayload {
  idToken: string;
  role: string;
  name?: string;
  email?: string;
}

export interface LoginPayload {
  idToken: string;
}

/**
 * Register a new user with Google authentication
 * Sends the Firebase ID token and selected role to the backend
 */
export async function registerWithBackend(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Registration failed",
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error("Register API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error. Please check your connection.",
    };
  }
}

/**
 * Login with Google authentication
 * Sends the Firebase ID token to the backend and receives user data with role
 */
export async function loginWithBackend(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Login failed",
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error("Login API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error. Please check your connection.",
    };
  }
}

/**
 * Get current user profile from backend
 * Requires authentication token in header
 */
export async function getUserProfile(idToken: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || data.error || "Failed to get user profile",
      };
    }

    return {
      success: true,
      data: data.data || data,
    };
  } catch (error) {
    console.error("Get profile API error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}
