"use client";

import ProtectedRoute from "@/app/components/ProtectedRoute";
import { UserRole } from "@/types/user";
import CustomerSidebar from "@/app/components/CustomerSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.CUSTOMER} redirectTo="/login">
      <div className="min-h-screen bg-gray-50 flex">
        <CustomerSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </ProtectedRoute>
  );
}
