"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { UserRole, canAccessDashboard } from "@/types/user";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ children, requiredRole, requireAuth = true, redirectTo = "/login" }: ProtectedRouteProps) {
  const { user, userRole, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Check if specific role is required
    if (requiredRole && userRole !== requiredRole) {
      // If requiring customer support but user is customer, redirect to home
      if (requiredRole === UserRole.CUSTOMER_SUPPORT && !canAccessDashboard(userRole || UserRole.CUSTOMER)) {
        router.push("/");
        return;
      }
      // If requiring customer but user is support, redirect to dashboard
      if (requiredRole === UserRole.CUSTOMER && userRole === UserRole.CUSTOMER_SUPPORT) {
        router.push("/dashboard");
        return;
      }
    }
  }, [user, userRole, loading, requireAuth, requiredRole, redirectTo, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#52abff] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If auth is required but no user, don't render children
  if (requireAuth && !user) {
    return null;
  }

  // If role is required but doesn't match, don't render children
  if (requiredRole && userRole !== requiredRole) {
    if (requiredRole === UserRole.CUSTOMER_SUPPORT && !canAccessDashboard(userRole || UserRole.CUSTOMER)) {
      return null;
    }
  }

  return <>{children}</>;
}
