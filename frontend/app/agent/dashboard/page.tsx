"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getConversations, type Conversation } from "@/lib/api";
import { AlertTriangle, Clock, CheckCircle, TrendingUp, ArrowUpDown, RefreshCw, MessageSquare, User, Zap, Eye, Filter } from "lucide-react";

type SortOption = "priority_score" | "updated_at";
type OrderOption = "asc" | "desc";

const priorityConfig: Record<number, { bg: string; text: string; glow: string }> = {
  1: { bg: "bg-slate-100", text: "text-slate-600", glow: "" },
  2: { bg: "bg-slate-100", text: "text-slate-600", glow: "" },
  3: { bg: "bg-emerald-100", text: "text-emerald-700", glow: "" },
  4: { bg: "bg-lime-100", text: "text-lime-700", glow: "" },
  5: { bg: "bg-yellow-100", text: "text-yellow-700", glow: "" },
  6: { bg: "bg-amber-100", text: "text-amber-700", glow: "" },
  7: { bg: "bg-orange-100", text: "text-orange-700", glow: "ring-2 ring-orange-200" },
  8: { bg: "bg-red-100", text: "text-red-700", glow: "ring-2 ring-red-200" },
  9: { bg: "bg-red-200", text: "text-red-800", glow: "ring-2 ring-red-300 animate-pulse" },
  10: { bg: "bg-red-300", text: "text-red-900", glow: "ring-2 ring-red-400 animate-pulse" },
};

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  open: { bg: "bg-amber-50", text: "text-amber-700", icon: <Clock className="w-3 h-3" /> },
  in_progress: { bg: "bg-blue-50", text: "text-blue-700", icon: <RefreshCw className="w-3 h-3" /> },
  resolved: { bg: "bg-emerald-50", text: "text-emerald-700", icon: <CheckCircle className="w-3 h-3" /> },
};

export default function AgentDashboardPage() {
  const { userProfile } = useAuth();
  const router = useRouter();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>("priority_score");
  const [order, setOrder] = useState<OrderOption>("desc");
  const [stats, setStats] = useState({
    totalOpen: 0,
    totalInProgress: 0,
    totalResolved: 0,
    avgPriority: 0,
    criticalCount: 0,
  });

  useEffect(() => {
    loadConversations();
    const interval = setInterval(loadConversations, 30000);
    return () => clearInterval(interval);
  }, [sortBy, order]);

  const loadConversations = async () => {
    setIsLoading(true);
    try {
      const result = await getConversations(sortBy, order);
      if (result.success && result.data?.conversations) {
        const convs = result.data.conversations;
        setConversations(convs);

        const open = convs.filter((c) => c.status === "open").length;
        const inProgress = convs.filter((c) => c.status === "in_progress").length;
        const resolved = convs.filter((c) => c.status === "resolved").length;
        const critical = convs.filter((c) => (c.ai_analysis?.priority_score || 0) >= 8).length;
        const processedConvs = convs.filter((c) => c.ai_analysis?.is_processed);
        const avgPriority = processedConvs.length > 0 ? Math.round(processedConvs.reduce((sum, c) => sum + (c.ai_analysis?.priority_score || 0), 0) / processedConvs.length) : 0;

        setStats({ totalOpen: open, totalInProgress: inProgress, totalResolved: resolved, avgPriority, criticalCount: critical });
      }
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityLabel = (score: number): string => {
    if (score >= 8) return "Critical";
    if (score >= 6) return "High";
    if (score >= 4) return "Medium";
    return "Low";
  };

  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const handleViewConversation = (convId: string) => {
    router.push(`/agent/dashboard/conversation/${convId}`);
  };

  const toggleSort = (field: SortOption) => {
    if (sortBy === field) {
      setOrder(order === "desc" ? "asc" : "desc");
    } else {
      setSortBy(field);
      setOrder("desc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                Welcome back, {userProfile?.displayName?.split(" ")[0] || "Agent"}!<span className="ml-2">👋</span>
              </h1>
              <p className="text-slate-500 text-sm mt-1">AI-Powered Support Queue • Sorted by Priority</p>
            </div>
            <button onClick={loadConversations} disabled={isLoading} className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-all shadow-sm hover:shadow-md disabled:opacity-50">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm font-medium">Open Tickets</span>
              <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-amber-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalOpen}</p>
            <p className="text-xs text-amber-600 mt-1">Awaiting response</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm font-medium">In Progress</span>
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalInProgress}</p>
            <p className="text-xs text-blue-600 mt-1">Being handled</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm font-medium">Resolved</span>
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-slate-800">{stats.totalResolved}</p>
            <p className="text-xs text-emerald-600 mt-1">Completed today</p>
          </div>

          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-slate-500 text-sm font-medium">Critical</span>
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-red-600">{stats.criticalCount}</p>
            <p className="text-xs text-red-500 mt-1">Priority 8-10</p>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-5 shadow-lg text-white">
            <div className="flex items-center justify-between mb-3">
              <span className="text-blue-100 text-sm font-medium">Avg Priority</span>
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
            <p className="text-3xl font-bold">{stats.avgPriority}/10</p>
            <p className="text-xs text-blue-200 mt-1">AI-calculated</p>
          </div>
        </div>

        {/* Conversations List */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Table Header */}
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Incoming Conversations</h2>
                  <p className="text-sm text-slate-500">
                    {conversations.length} total • Sorted by {sortBy === "priority_score" ? "AI Priority" : "Time"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleSort("priority_score")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === "priority_score" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <Filter className="w-4 h-4" />
                  Priority
                  {sortBy === "priority_score" && <ArrowUpDown className="w-3 h-3" />}
                </button>
                <button
                  onClick={() => toggleSort("updated_at")}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${sortBy === "updated_at" ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  <Clock className="w-4 h-4" />
                  Recent
                  {sortBy === "updated_at" && <ArrowUpDown className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Conversation Cards */}
          {isLoading ? (
            <div className="p-12 text-center">
              <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
              <p className="text-slate-500">Loading conversations...</p>
            </div>
          ) : conversations.length === 0 ? (
            <div className="p-12 text-center">
              <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 text-lg font-medium">No conversations yet</p>
              <p className="text-slate-400 text-sm mt-1">Customer messages will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {conversations.map((conv, index) => {
                const priority = conv.ai_analysis?.priority_score || 0;
                const priorityStyle = priorityConfig[priority] || priorityConfig[1];
                const status = statusConfig[conv.status] || statusConfig.open;
                const sentiment = conv.ai_analysis?.sentiment || "neutral";

                return (
                  <div key={conv.id} className="p-5 hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => handleViewConversation(conv.id)}>
                    <div className="flex items-start gap-4">
                      {/* Priority Indicator */}
                      <div className="flex-shrink-0">
                        <div className={`w-14 h-14 rounded-2xl flex flex-col items-center justify-center ${priorityStyle.bg} ${priorityStyle.glow}`}>
                          <span className={`text-xl font-bold ${priorityStyle.text}`}>{priority}</span>
                          <span className="text-[10px] text-slate-500">PRIORITY</span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-800">{conv.student_name || "Unknown Student"}</h3>
                              <p className="text-xs text-slate-400">{formatTimeAgo(conv.updated_at)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {/* Status Badge */}
                            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${status.bg} ${status.text}`}>
                              {status.icon}
                              {conv.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>

                        {/* Message Preview */}
                        <p className="text-slate-600 text-sm line-clamp-2 mb-3">{conv.last_message}</p>

                        {/* Tags */}
                        <div className="flex items-center gap-2 flex-wrap">
                          {conv.ai_analysis?.is_processed && (
                            <>
                              <span className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">{conv.ai_analysis.category || "Uncategorized"}</span>
                              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle.bg} ${priorityStyle.text}`}>{getPriorityLabel(priority)}</span>
                            </>
                          )}
                          {!conv.ai_analysis?.is_processed && <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-medium animate-pulse">AI Processing...</span>}
                        </div>
                      </div>

                      {/* Action */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="flex items-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium shadow-sm">
                          <Eye className="w-4 h-4" />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
