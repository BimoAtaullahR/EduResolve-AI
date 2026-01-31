"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { auth } from "@/lib/firebase/firebase";
import { ArrowLeft, Send, User, Headphones, Clock, AlertTriangle, Sparkles, Loader2, CheckCircle, MessageSquare, Wand2, RefreshCw } from "lucide-react";

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
  reason: string;
  sentiment: string;
  is_processed: boolean;
}

interface Conversation {
  id: string;
  student_name: string;
  student_email: string;
  status: string;
  messages: Message[];
  ai_analysis: AIAnalysis;
  created_at: string;
  updated_at: string;
}

interface Suggestion {
  tone: string;
  content: string;
}

const priorityColors: Record<number, string> = {
  1: "bg-slate-100 text-slate-600",
  2: "bg-slate-100 text-slate-600",
  3: "bg-emerald-100 text-emerald-700",
  4: "bg-lime-100 text-lime-700",
  5: "bg-yellow-100 text-yellow-700",
  6: "bg-amber-100 text-amber-700",
  7: "bg-orange-100 text-orange-700",
  8: "bg-red-100 text-red-700",
  9: "bg-red-200 text-red-800",
  10: "bg-red-300 text-red-900",
};

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const conversationId = params.id as string;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);
  const [cooldownSeconds, setCooldownSeconds] = useState(0);
  const lastSuggestionTimeRef = useRef<number>(0);

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  // Cooldown timer effect
  useEffect(() => {
    if (cooldownSeconds > 0) {
      const timer = setTimeout(() => setCooldownSeconds(cooldownSeconds - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownSeconds]);

  const loadConversation = async () => {
    setIsLoading(true);
    try {
      const token = await auth?.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      if (response.ok) {
        const data = await response.json();
        setConversation(data);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const COOLDOWN_DURATION = 60; // 60 seconds cooldown

  const loadSuggestions = async () => {
    // Check if already loading
    if (isLoadingSuggestions) {
      console.log("Already loading suggestions, skipping...");
      return;
    }

    // Check cooldown
    const now = Date.now();
    const timeSinceLastRequest = (now - lastSuggestionTimeRef.current) / 1000;
    if (timeSinceLastRequest < COOLDOWN_DURATION && lastSuggestionTimeRef.current > 0) {
      const remainingCooldown = Math.ceil(COOLDOWN_DURATION - timeSinceLastRequest);
      alert(`Tunggu ${remainingCooldown} detik sebelum generate AI lagi (rate limit protection)`);
      return;
    }

    setIsLoadingSuggestions(true);
    setSuggestions([]);
    try {
      const token = await auth?.currentUser?.getIdToken();
      if (!token) {
        console.error("No auth token available");
        alert("Silakan login terlebih dahulu");
        setIsLoadingSuggestions(false);
        return;
      }

      console.log("Fetching suggestions for conversation:", conversationId);
      const response = await fetch(`${API_URL}/conversations/${conversationId}/suggestions`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Suggestions response:", data);

      if (response.ok) {
        setSuggestions(data.suggestions || []);
        if (!data.suggestions || data.suggestions.length === 0) {
          console.log("No suggestions returned from AI");
        }
      } else {
        console.error("Failed to load suggestions:", data.error);
        alert(`Gagal generate AI response: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
      alert("Koneksi ke server gagal");
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim() || isSending) return;

    setIsSending(true);
    setSendSuccess(false);
    try {
      const token = await auth?.currentUser?.getIdToken();
      const response = await fetch(`${API_URL}/conversations/${conversationId}/reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ text: replyText }),
      });

      if (response.ok) {
        setReplyText("");
        setSendSuccess(true);
        await loadConversation();
        setTimeout(() => setSendSuccess(false), 3000);
      } else {
        const data = await response.json();
        alert(data.error || "Gagal mengirim pesan");
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      alert("Gagal mengirim pesan");
    } finally {
      setIsSending(false);
    }
  };

  const useSuggestion = (content: string) => {
    setReplyText(content);
  };

  const formatTime = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-slate-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500">Conversation not found</p>
        </div>
      </div>
    );
  }

  const priority = conversation.ai_analysis?.priority_score || 0;

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/agent/dashboard")} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="font-semibold text-slate-800">{conversation.student_name || "Unknown Student"}</h1>
                  <p className="text-sm text-slate-500">{conversation.student_email}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${priorityColors[priority]}`}>Priority {priority}/10</span>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.messages?.length === 0 && <div className="text-center py-8 text-slate-400">Belum ada pesan</div>}
          {conversation.messages?.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "support" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${msg.sender === "support" ? "order-1" : ""}`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.sender === "student" && (
                    <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                      <User className="w-3 h-3 text-slate-600" />
                    </div>
                  )}
                  <span className="text-xs text-slate-500">{formatTime(msg.timestamp)}</span>
                  {msg.sender === "support" && (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <Headphones className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className={`px-4 py-3 rounded-2xl ${msg.sender === "support" ? "bg-blue-500 text-white rounded-br-md" : "bg-white text-slate-800 rounded-bl-md shadow-sm border border-slate-100"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Reply Input */}
        <div className="bg-white border-t border-slate-200 p-4">
          {/* Success Message */}
          {sendSuccess && (
            <div className="mb-3 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Pesan berhasil terkirim!
            </div>
          )}

          {/* Generate AI Button */}
          <div className="flex gap-2 mb-3">
            <button onClick={loadSuggestions} disabled={isLoadingSuggestions} className="flex items-center gap-2 px-4 py-2 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-colors disabled:opacity-50">
              {isLoadingSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
              {isLoadingSuggestions ? "Generating..." : "Generate AI Response"}
            </button>
          </div>

          <div className="flex gap-3">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Ketik balasan..."
              rows={2}
              className="flex-1 px-4 py-3 border border-slate-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendReply();
                }
              }}
            />
            <button
              onClick={handleSendReply}
              disabled={!replyText.trim() || isSending}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              Kirim
            </button>
          </div>
        </div>
      </div>

      {/* Right Sidebar - AI Analysis & Suggestions */}
      <div className="w-96 bg-white border-l border-slate-200 overflow-y-auto">
        {/* AI Analysis */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-purple-500" />
            <h2 className="font-semibold text-slate-800">AI Analysis</h2>
          </div>

          {conversation.ai_analysis?.is_processed ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 mb-1">Summary</p>
                <p className="text-sm text-slate-700">{conversation.ai_analysis.summary}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Category</p>
                  <p className="text-sm font-medium text-purple-700">{conversation.ai_analysis.category}</p>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <p className="text-xs text-slate-500 mb-1">Sentiment</p>
                  <p className="text-sm font-medium capitalize">
                    {[conversation.ai_analysis.sentiment]} {conversation.ai_analysis.sentiment}
                  </p>
                </div>
              </div>
              <div className="bg-amber-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <p className="text-xs text-amber-700 font-medium">Priority Reason</p>
                </div>
                <p className="text-sm text-amber-800">{conversation.ai_analysis.reason}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 text-purple-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">AI processing...</p>
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-500" />
              <h2 className="font-semibold text-slate-800">AI Suggestions</h2>
            </div>
            <button onClick={loadSuggestions} disabled={isLoadingSuggestions} className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50" title="Refresh Suggestions">
              <RefreshCw className={`w-4 h-4 text-slate-500 ${isLoadingSuggestions ? "animate-spin" : ""}`} />
            </button>
          </div>

          {isLoadingSuggestions ? (
            <div className="text-center py-6">
              <Loader2 className="w-6 h-6 text-blue-500 animate-spin mx-auto mb-2" />
              <p className="text-sm text-slate-500">Generating suggestions...</p>
            </div>
          ) : suggestions.length > 0 ? (
            <div className="space-y-3">
              {suggestions.map((suggestion, index) => (
                <div key={index} className="bg-slate-50 rounded-xl p-4 hover:bg-blue-50 hover:border-blue-200 transition-colors cursor-pointer group border border-transparent" onClick={() => useSuggestion(suggestion.content)}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">{suggestion.tone}</span>
                    <span className="text-xs text-slate-400 group-hover:text-blue-500">Klik untuk pakai</span>
                  </div>
                  <p className="text-sm text-slate-700 line-clamp-3">{suggestion.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6">
              <MessageSquare className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500 mb-3">Belum ada suggestions</p>
              <button onClick={loadSuggestions} className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium flex items-center gap-2 mx-auto">
                <Wand2 className="w-4 h-4" />
                Generate AI Response
              </button>
            </div>
          )}
        </div>

        {/* Ticket Info */}
        <div className="p-6 border-t border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-500" />
            <h2 className="font-semibold text-slate-800">Ticket Info</h2>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Created</span>
              <span className="text-slate-700">{formatDate(conversation.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Updated</span>
              <span className="text-slate-700">{formatDate(conversation.updated_at)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Status</span>
              <span className={`font-medium capitalize ${conversation.status === "open" ? "text-amber-600" : conversation.status === "resolved" ? "text-green-600" : "text-blue-600"}`}>{conversation.status?.replace("_", " ")}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
