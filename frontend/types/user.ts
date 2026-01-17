// User Role Types
export enum UserRole {
  CUSTOMER = "customer",
  CUSTOMER_SUPPORT = "customer_support",
}

// User Profile Interface
export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  role: UserRole;
  createdAt: string;
}

// Role display names for UI
export const RoleDisplayNames: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: "Learner",
  [UserRole.CUSTOMER_SUPPORT]: "Customer Support",
};

// Role descriptions for registration
export const RoleDescriptions: Record<UserRole, string> = {
  [UserRole.CUSTOMER]: "I want to learn and access courses",
  [UserRole.CUSTOMER_SUPPORT]: "I'm a support staff helping learners",
};

// Check if user has access to dashboard
export function canAccessDashboard(role: UserRole): boolean {
  return role === UserRole.CUSTOMER_SUPPORT;
}

// Get default redirect path based on role
export function getDefaultRedirectPath(role: UserRole): string {
  switch (role) {
    case UserRole.CUSTOMER_SUPPORT:
      return "/dashboard";
    case UserRole.CUSTOMER:
    default:
      return "/";
  }
}
