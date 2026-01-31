"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { MessageSquare, Clock, CheckCircle, AlertCircle, Loader2, ChevronRight, Inbox, Plus, BookOpen, CreditCard, Settings, HelpCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

interface AIAnalysis {
  priority_score: number;
  category: string;
  sentiment: string;
  is_processed: boolean;
}

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface Conversation {
  id: string;
  student_name: string;
  last_message: string;
  status: string;
  messages: Message[];
  ai_analysis: AIAnalysis;
  created_at: string;
  updated_at: string;
}

const statusConfig: Record<string, { bg: string; text: string; icon: React.ReactNode; label: string }> = {
  open: { bg: "bg-amber-100", text: "text-amber-700", icon: <Clock className="w-4 h-4" />, label: "Menunggu Balasan" },
  in_progress: { bg: "bg-blue-100", text: "text-blue-700", icon: <MessageSquare className="w-4 h-4" />, label: "Dibalas" },
  resolved: { bg: "bg-emerald-100", text: "text-emerald-700", icon: <CheckCircle className="w-4 h-4" />, label: "Selesai" },
};

const categoryIcons: Record<string, React.ReactNode> = {
  "Ujian & Tugas": <BookOpen className="w-5 h-5" />,
  Pembayaran: <CreditCard className="w-5 h-5" />,
  "Akses Materi": <Settings className="w-5 h-5" />,
  "Exam/Assignment": <BookOpen className="w-5 h-5" />,
  "Payment & Subs": <CreditCard className="w-5 h-5" />,
  "Technical Issue": <Settings className="w-5 h-5" />,
};

export default function StudentInboxPage() {
  const { userProfile } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        setError("Silakan login terlebih dahulu");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/student/conversations`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
      } else {
        const data = await response.json();
        setError(data.error || "Gagal memuat pesan");
      }
    } catch (err) {
      console.error("Error loading conversations:", err);
      setError("Koneksi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string): string => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 60) return "Baru saja";
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
  };

  const hasUnreadReply = (conv: Conversation) => {
    if (!conv.messages || conv.messages.length === 0) return false;
    return conv.messages[conv.messages.length - 1].sender === "support";
  };

  const getCategoryIcon = (category: string) => {
    return categoryIcons[category] || <HelpCircle className="w-5 h-5" />;
  };

  return (
    <div className="min-h-screen bg-great-blue py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Riwayat Keluhan</h1>
            <p className="text-gray-500 text-sm mt-1">Lihat status dan balasan dari tim support</p>
          </div>
          <Link href="/customer/dashboard/ask" className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
            <Plus className="w-4 h-4" />
            Keluhan Baru
          </Link>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-500">Memuat riwayat keluhan...</p>
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
            <p className="text-gray-700 font-medium mb-2">Terjadi Kesalahan</p>
            <p className="text-gray-500 text-sm mb-4">{error}</p>
            <button onClick={loadConversations} className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors">
              Coba Lagi
            </button>
          </div>
        ) : conversations.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-700 font-medium mb-2">Belum Ada Keluhan</p>
            <p className="text-gray-500 text-sm mb-6">Kirim keluhan pertamamu ke tim support</p>
            <Link href="/customer/dashboard/ask" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-colors">
              <MessageSquare className="w-5 h-5" />
              Kirim Keluhan
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map((conv) => {
              const status = statusConfig[conv.status] || statusConfig.open;
              const unread = hasUnreadReply(conv);
              const category = conv.ai_analysis?.category || "Lainnya";

              return (
                <Link
                  key={conv.id}
                  href={`/customer/dashboard/inbox/${conv.id}`}
                  className={`block bg-white rounded-2xl p-5 shadow-sm hover:shadow-md transition-all border-2 ${unread ? "border-blue-300 bg-blue-50/50" : "border-transparent"}`}
                >
                  <div className="flex items-start gap-4">
                    {/* Category Icon */}
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${status.bg} ${status.text}`}>{getCategoryIcon(category)}</div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          {unread && (
                            <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                              Balasan Baru
                            </span>
                          )}
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${status.bg} ${status.text}`}>{status.label}</span>
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{category}</span>
                        </div>
                        <span className="text-xs text-gray-400">{formatTimeAgo(conv.updated_at)}</span>
                      </div>

                      <p className="text-gray-800 font-medium line-clamp-2 mb-2">{conv.last_message}</p>

                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {conv.messages?.length || 0} pesan
                        </span>
                        {conv.ai_analysis?.priority_score >= 8 && <span className="text-red-600 font-medium">⚠️ Prioritas Tinggi</span>}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 shrink-0 self-center" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
