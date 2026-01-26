"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getConversations, type Conversation } from "@/lib/api";

const priorityColors: Record<number, string> = {
  1: "bg-gray-100 text-gray-800",
  2: "bg-gray-100 text-gray-800",
  3: "bg-gray-100 text-gray-800",
  4: "bg-yellow-100 text-yellow-800",
  5: "bg-yellow-100 text-yellow-800",
  6: "bg-orange-100 text-orange-800",
  7: "bg-orange-100 text-orange-800",
  8: "bg-red-100 text-red-800",
  9: "bg-red-100 text-red-800",
  10: "bg-red-200 text-red-900",
};

const statusColors: Record<string, string> = {
  open: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-blue-100 text-blue-800",
  resolved: "bg-green-100 text-green-800",
};

const sentimentColors: Record<string, string> = {
  positive: "bg-green-100 text-green-800",
  neutral: "bg-gray-100 text-gray-800",
  negative: "bg-red-100 text-red-800",
  anxious: "bg-orange-100 text-orange-800",
};

export default function AgentDashboardPage() {
  const { userProfile, user } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalOpen: 0,
    totalInProgress: 0,
    totalResolved: 0,
    avgPriority: 0,
  });

  useEffect(() => {
    loadConversations();
    // Refresh every 30 seconds
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const result = await getConversations("agent", user?.uid || "");
      if (result.success && result.data?.conversations) {
        const convs = result.data.conversations;
        setConversations(convs);

        // Calculate stats
        const open = convs.filter((c) => c.status === "open").length;
        const inProgress = convs.filter((c) => c.status === "in_progress").length;
        const resolved = convs.filter((c) => c.status === "resolved").length;
        const processedConvs = convs.filter((c) => c.ai_analysis?.is_processed);
        const avgPriority = processedConvs.length > 0 ? Math.round(processedConvs.reduce((sum, c) => sum + (c.ai_analysis?.priority_score || 0), 0) / processedConvs.length) : 0;

        setStats({ totalOpen: open, totalInProgress: inProgress, totalResolved: resolved, avgPriority });
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityLabel = (score: number): string => {
    if (score >= 8) return "High";
    if (score >= 5) return "Medium";
    return "Low";
  };

  const handleViewConversation = (convId: string) => {
    router.push(`/agent/dashboard/conversation/${convId}`);
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Welcome back, {userProfile?.displayName?.split(" ")[0] || "Support Agent"}! 👋</h1>
        <p className="text-gray-500 mt-1">Here&apos;s what&apos;s happening with your support queue today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Open Tickets</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-yellow-600">{stats.totalOpen}</p>
            <span className="text-2xl">📬</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">In Progress</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-blue-600">{stats.totalInProgress}</p>
            <span className="text-2xl">⏳</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Resolved Today</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-green-600">{stats.totalResolved}</p>
            <span className="text-2xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Avg Priority Score</p>
          <div className="flex items-end justify-between">
            <p className="text-3xl font-bold text-gray-800">{stats.avgPriority}/10</p>
            <span className="text-2xl">📊</span>
          </div>
        </div>
      </div>

      {/* Conversations Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">Incoming Conversations</h2>
          <button onClick={loadConversations} className="text-sm text-[#52abff] hover:text-[#20578f] font-medium">
            Refresh
          </button>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500">Loading conversations...</div>
        ) : conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No conversations yet. Customer messages will appear here.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Last Message</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {conversations.map((conv) => (
                  <tr key={conv.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{conv.student_name || "Unknown"}</p>
                        <p className="text-xs text-gray-500">{conv.student_email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate">{conv.last_message}</p>
                    </td>
                    <td className="px-6 py-4">
                      {conv.ai_analysis?.is_processed ? (
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800">{conv.ai_analysis.category || "—"}</span>
                      ) : (
                        <span className="text-xs text-gray-400">Processing...</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {conv.ai_analysis?.is_processed ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${priorityColors[conv.ai_analysis.priority_score] || "bg-gray-100 text-gray-800"}`}>
                          {conv.ai_analysis.priority_score}/10 ({getPriorityLabel(conv.ai_analysis.priority_score)})
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {conv.ai_analysis?.is_processed ? (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${sentimentColors[conv.ai_analysis.sentiment] || "bg-gray-100 text-gray-800"}`}>{conv.ai_analysis.sentiment || "—"}</span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${statusColors[conv.status]}`}>{conv.status.replace("_", " ")}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button onClick={() => handleViewConversation(conv.id)} className="text-[#52abff] hover:text-[#20578f] text-sm font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
