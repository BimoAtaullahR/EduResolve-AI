"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { getConversation, getSuggestions, addMessage, assignAgent, updateStatus, type Conversation, type ResponseSuggestion } from "@/lib/api";
import { FiArrowLeft, FiSend, FiCopy, FiCheck, FiUser, FiClock, FiAlertCircle } from "react-icons/fi";

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

const sentimentColors: Record<string, string> = {
  positive: "bg-green-100 text-green-700 border-green-200",
  neutral: "bg-gray-100 text-gray-700 border-gray-200",
  negative: "bg-red-100 text-red-700 border-red-200",
  anxious: "bg-orange-100 text-orange-700 border-orange-200",
};

export default function ConversationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { userProfile, user } = useAuth();
  const conversationId = params.id as string;

  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [suggestions, setSuggestions] = useState<ResponseSuggestion[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadConversation();
  }, [conversationId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation?.messages]);

  const loadConversation = async () => {
    setIsLoading(true);
    try {
      const result = await getConversation(conversationId);
      if (result.success && result.data?.conversation) {
        setConversation(result.data.conversation);
      }
    } catch (error) {
      console.error("Error loading conversation:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
      const result = await getSuggestions(conversationId);
      if (result.success && result.data?.suggestions) {
        setSuggestions(result.data.suggestions);
      }
    } catch (error) {
      console.error("Error loading suggestions:", error);
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAssign = async () => {
    if (!user || !userProfile) return;
    try {
      await assignAgent(conversationId, {
        agent_uid: user.uid,
        agent_name: userProfile.displayName || user.email || "Agent",
      });
      loadConversation();
    } catch (error) {
      console.error("Error assigning:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    setIsSending(true);
    try {
      await addMessage(conversationId, {
        sender_uid: user.uid,
        sender_type: "agent",
        text: inputMessage,
      });
      setInputMessage("");
      loadConversation();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleResolve = async () => {
    try {
      await updateStatus(conversationId, "resolved");
      loadConversation();
    } catch (error) {
      console.error("Error resolving:", error);
    }
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const useSuggestion = (text: string) => {
    setInputMessage(text);
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Loading conversation...</div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500">Conversation not found</div>
      </div>
    );
  }

  const ai = conversation.ai_analysis;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => router.push("/agent/dashboard")} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <FiArrowLeft size={20} />
            </button>
            <div>
              <h1 className="font-semibold text-gray-900">{conversation.customer_name || "Customer"}</h1>
              <p className="text-sm text-gray-500">{conversation.customer_email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {conversation.status !== "resolved" && !conversation.agent_uid && (
              <button onClick={handleAssign} className="px-4 py-2 bg-[#52abff] hover:bg-[#20578f] text-white rounded-lg text-sm font-medium transition-colors">
                Claim Ticket
              </button>
            )}
            {conversation.status !== "resolved" && conversation.agent_uid && (
              <button onClick={handleResolve} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
                Mark Resolved
              </button>
            )}
            <span
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                conversation.status === "open" ? "bg-yellow-100 text-yellow-800" : conversation.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
              }`}
            >
              {conversation.status.replace("_", " ")}
            </span>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {conversation.messages?.map((message, idx) => (
            <div key={idx} className={`flex ${message.sender === "agent" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[70%] ${message.sender === "agent" ? "order-2" : ""}`}>
                <div className={`rounded-2xl px-4 py-3 ${message.sender === "agent" ? "bg-[#52abff] text-white rounded-br-sm" : "bg-white text-gray-900 border border-gray-200 rounded-bl-sm"}`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${message.sender === "agent" ? "justify-end" : ""}`}>
                  <FiClock size={12} />
                  <span>{formatTime(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type your reply..."
              disabled={isSending || conversation.status === "resolved"}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-[#52abff] focus:ring-2 focus:ring-[#52abff]/20 disabled:bg-gray-100"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isSending || conversation.status === "resolved"}
              className="px-6 py-3 bg-[#52abff] hover:bg-[#20578f] disabled:bg-gray-300 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <FiSend size={18} />
              Send
            </button>
          </div>
        </div>
      </div>

      {/* AI Panel Sidebar */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <span className="text-xl">🤖</span> AI Analysis
          </h2>
        </div>

        {ai?.is_processed ? (
          <div className="p-4 space-y-4">
            {/* Summary */}
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
                <FiAlertCircle size={16} /> Summary
              </h3>
              <p className="text-sm text-blue-800">{ai.summary}</p>
            </div>

            {/* Priority & Sentiment */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Priority</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${priorityColors[ai.priority_score] || "bg-gray-100"}`}>{ai.priority_score}/10</span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Sentiment</p>
                <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full capitalize ${sentimentColors[ai.sentiment] || "bg-gray-100"}`}>{ai.sentiment}</span>
              </div>
            </div>

            {/* Category */}
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <p className="text-xs text-purple-600 uppercase tracking-wide mb-1">Category</p>
              <p className="font-medium text-purple-900">{ai.category}</p>
            </div>

            {/* Reason */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">AI Reasoning</p>
              <p className="text-sm text-gray-700">{ai.reason}</p>
            </div>

            {/* Suggestions */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Response Suggestions</h3>
                <button onClick={loadSuggestions} disabled={isLoadingSuggestions} className="text-sm text-[#52abff] hover:text-[#20578f] font-medium disabled:text-gray-400">
                  {isLoadingSuggestions ? "Loading..." : "Generate"}
                </button>
              </div>

              {suggestions.length > 0 ? (
                <div className="space-y-3">
                  {suggestions.map((suggestion, idx) => (
                    <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-500 uppercase">{suggestion.tone}</span>
                        <div className="flex gap-1">
                          <button onClick={() => copyToClipboard(suggestion.content, idx)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors" title="Copy">
                            {copiedIndex === idx ? <FiCheck size={14} className="text-green-600" /> : <FiCopy size={14} className="text-gray-500" />}
                          </button>
                          <button onClick={() => useSuggestion(suggestion.content)} className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors text-[#52abff]" title="Use this">
                            <FiSend size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{suggestion.content}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">Click &quot;Generate&quot; to get AI-powered response suggestions</p>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="animate-spin w-8 h-8 border-2 border-[#52abff] border-t-transparent rounded-full mx-auto mb-3"></div>
            <p>AI is analyzing...</p>
          </div>
        )}
      </div>
    </div>
  );
}
