"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import DashboardSidebar from "@/app/components/DashboardSidebar";
import { UserRole } from "@/types/user";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.CUSTOMER_SUPPORT} redirectTo="/login">
      <div className="min-h-screen bg-gray-50 flex">
        <DashboardSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
