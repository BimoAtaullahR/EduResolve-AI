"use client";

import { useAuth } from "@/app/context/AuthContext";

// Mock data for dashboard stats
const stats = [
  { name: "Total Customers", value: "2,651", change: "+12.5%", up: true },
  { name: "Active Tickets", value: "48", change: "-8.2%", up: false },
  { name: "Resolved Today", value: "124", change: "+23.1%", up: true },
  { name: "Avg Response Time", value: "2.4 min", change: "-15.3%", up: false },
];

const recentTickets = [
  { id: "TKT-001", customer: "John Doe", issue: "Cannot access course", status: "Open", priority: "High" },
  { id: "TKT-002", customer: "Jane Smith", issue: "Payment failed", status: "In Progress", priority: "Medium" },
  { id: "TKT-003", customer: "Bob Wilson", issue: "Certificate not received", status: "Open", priority: "Low" },
  { id: "TKT-004", customer: "Alice Brown", issue: "Video playback issue", status: "Resolved", priority: "Medium" },
  { id: "TKT-005", customer: "Charlie Davis", issue: "Account locked", status: "Open", priority: "High" },
];

const statusColors: Record<string, string> = {
  Open: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Resolved: "bg-green-100 text-green-800",
};

const priorityColors: Record<string, string> = {
  High: "bg-red-100 text-red-800",
  Medium: "bg-orange-100 text-orange-800",
  Low: "bg-gray-100 text-gray-800",
};

export default function DashboardPage() {
  const { userProfile } = useAuth();

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userProfile?.displayName?.split(" ")[0] || "Support"}! 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your support queue today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 mb-2">{stat.name}</p>
            <div className="flex items-end justify-between">
              <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
              <span className={`text-sm font-medium ${stat.up ? "text-green-600" : "text-red-600"}`}>{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Tickets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Recent Tickets</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket ID</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#52abff]">{ticket.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.customer}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">{ticket.issue}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[ticket.status]}`}>{ticket.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[ticket.priority]}`}>{ticket.priority}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#52abff] hover:text-[#20578f] text-sm font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
