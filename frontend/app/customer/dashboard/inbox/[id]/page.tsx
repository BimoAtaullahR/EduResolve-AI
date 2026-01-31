"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";
import { useAuth } from "@/app/context/AuthContext";
import { ArrowLeft, Send, User, Headphones, Loader2, MessageSquare, CheckCircle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

interface Message {
  sender: string;
  text: string;
  timestamp: string;
}

interface AIAnalysis {
  summary: string;
  category: string;
  priority_score: number;
  sentiment: string;
}

interface Conversation {
  id: string;
  student_name: string;
  status: string;
  messages: Message[];
  ai_analysis: AIAnalysis;
  created_at: string;
  updated_at: string;
}

const statusLabels: Record<string, { label: string; color: string }> = {
  open: { label: "Menunggu Balasan", color: "text-amber-600" },
  in_progress: { label: "Sedang Diproses", color: "text-blue-600" },
  resolved: { label: "Selesai", color: "text-emerald-600" },
};

export default function StudentConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const conversationId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (conversationId && user?.uid) {
      loadConversation();
    }
  }, [conversationId, user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const loadConversation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        setError("Silakan login terlebih dahulu");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`${API_URL}/student/conversations/${conversationId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      } else {
        const data = await response.json();
        setError(data.error || "Gagal memuat percakapan");
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError("Koneksi gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/student/conversations/${conversationId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: replyText }),
      });

      if (response.ok) {
        setReplyText("");
        await loadConversation();
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengirim pesan");
      }
    } catch (err) {
      console.error("Error sending reply:", err);
      alert("Gagal mengirim pesan");
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long" });
  };

  // Group messages by date
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { date: string; messages: Message[] }[] = [];
    let currentDate = "";

    messages?.forEach((msg) => {
      const msgDate = formatDate(msg.timestamp);
      if (msgDate !== currentDate) {
        currentDate = msgDate;
        groups.push({ date: msgDate, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });

    return groups;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Memuat percakapan...</p>
        </div>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-700 font-medium mb-2">{error || "Percakapan tidak ditemukan"}</p>
          <button onClick={() => router.push("/customer/dashboard/inbox")} className="text-blue-500 hover:text-blue-600 text-sm font-medium">
            Kembali ke Inbox
          </button>
        </div>
      </div>
    );
  }

  const status = statusLabels[conversation.status] || statusLabels.open;
  const messageGroups = groupMessagesByDate(conversation.messages || []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button onClick={() => router.push("/customer/dashboard/inbox")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <Headphones className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="font-semibold text-gray-800 text-sm">Tim Support</h1>
                <p className={`text-xs ${status.color}`}>{status.label}</p>
              </div>
            </div>
          </div>
          {conversation.status === "resolved" && (
            <div className="flex items-center gap-1 text-emerald-600 text-xs bg-emerald-50 px-2 py-1 rounded-full">
              <CheckCircle className="w-3 h-3" />
              Selesai
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-6 space-y-6">
          {messageGroups.length === 0 ? (
            <div className="text-center py-8 text-gray-500">Belum ada pesan</div>
          ) : (
            messageGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Date Divider */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 h-px bg-gray-300" />
                  <span className="text-xs text-gray-500 font-medium">{group.date}</span>
                  <div className="flex-1 h-px bg-gray-300" />
                </div>

                {/* Messages */}
                <div className="space-y-3">
                  {group.messages.map((msg, msgIndex) => (
                    <div key={msgIndex} className={`flex ${msg.sender === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] ${msg.sender === "student" ? "order-1" : ""}`}>
                        <div className={`flex items-end gap-2 ${msg.sender === "student" ? "flex-row-reverse" : ""}`}>
                          {msg.sender === "support" && (
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shrink-0">
                              <Headphones className="w-4 h-4 text-white" />
                            </div>
                          )}
                          <div className={`px-4 py-3 rounded-2xl ${msg.sender === "student" ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-gray-800 rounded-bl-md shadow-sm"}`}>
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.sender === "student" ? "text-blue-200" : "text-gray-400"}`}>{formatTime(msg.timestamp)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Reply Input */}
      {conversation.status !== "resolved" && (
        <div className="bg-white border-t border-gray-200 p-4 sticky bottom-0">
          <div className="max-w-3xl mx-auto flex gap-3">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 px-4 py-3 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <button onClick={handleSendReply} disabled={!replyText.trim() || isSending} className="px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </div>
      )}

      {/* Resolved Notice */}
      {conversation.status === "resolved" && (
        <div className="bg-emerald-50 border-t border-emerald-200 p-4">
          <div className="max-w-3xl mx-auto flex items-center justify-center gap-2 text-emerald-700">
            <CheckCircle className="w-5 h-5" />
            <p className="text-sm font-medium">Percakapan ini telah diselesaikan</p>
          </div>
        </div>
      )}
    </div>
  );
}
