"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FiMessageCircle, FiX, FiSend, FiList } from "react-icons/fi";
import { createConversation, addMessage, getConversations, type Conversation, type Message as APIMessage } from "@/lib/api";

// Mock data for customer stats
const customerStats = [
  { name: "Courses Enrolled", value: "12", icon: "📚", color: "bg-blue-50 text-blue-600" },
  { name: "Certificates Earned", value: "8", icon: "🏆", color: "bg-yellow-50 text-yellow-600" },
  { name: "Support Tickets", value: "3", icon: "🎫", color: "bg-purple-50 text-purple-600" },
  { name: "Progress", value: "67%", icon: "📊", color: "bg-green-50 text-green-600" },
];

interface LocalMessage {
  id: string;
  text: string;
  sender: "customer" | "agent";
  timestamp: Date;
}

export default function CustomerDashboard() {
  const { userProfile, user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showConversationList, setShowConversationList] = useState(false);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<LocalMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user's conversations
  useEffect(() => {
    if (user?.uid) {
      loadConversations();
    }
  }, [user?.uid]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    if (!user?.uid) return;
    const result = await getConversations("customer", user.uid);
    if (result.success && result.data?.conversations) {
      setConversations(result.data.conversations);
    }
  };

  const openConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
    // Convert API messages to local format
    const localMessages: LocalMessage[] = (conv.messages || []).map((m: APIMessage, idx: number) => ({
      id: idx.toString(),
      text: m.text,
      sender: m.sender as "customer" | "agent",
      timestamp: new Date(m.timestamp),
    }));
    setMessages(localMessages);
    setShowConversationList(false);
  };

  const startNewConversation = () => {
    setCurrentConversationId(null);
    setMessages([
      {
        id: "welcome",
        text: "Hello! How can we help you today? Describe your issue and our support team will respond shortly.",
        sender: "agent",
        timestamp: new Date(),
      },
    ]);
    setShowConversationList(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || !user) return;

    const messageText = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Add message to UI immediately
    const newMessage: LocalMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "customer",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      if (!currentConversationId) {
        // Step 2: Register with backend (send ID token + role)
        const result = await createConversation({
          student_name: userProfile?.displayName || user.email || "Customer",
          student_email: user.email || "",
          message: messageText,
        });

        if (result.success && result.data?.conversation) {
          setCurrentConversationId(result.data.conversation.id);
          // Add system response
          setMessages((prev) => [
            ...prev,
            {
              id: "system-1",
              text: "Your message has been sent to our support team. They will respond shortly.",
              sender: "agent",
              timestamp: new Date(),
            },
          ]);
          loadConversations();
        }
      } else {
        // Add to existing conversation
        await addMessage(currentConversationId, {
          sender_uid: user.uid,
          sender_type: "customer",
          text: messageText,
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#ebf2ff] to-white p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#1f2937] mb-2">Welcome back, {userProfile?.displayName?.split(" ")[0] || "Learner"}! 👋</h1>
          <p className="text-[#6b7280] text-lg">Ready to continue your learning journey?</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {customerStats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center text-2xl`}>{stat.icon}</div>
              </div>
              <p className="text-sm text-[#6b7280] mb-1">{stat.name}</p>
              <p className="text-2xl font-bold text-[#1f2937]">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-[#1f2937] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[#52abff] hover:bg-blue-50 transition-all duration-200">
              <span className="text-2xl">📖</span>
              <div className="text-left">
                <p className="font-medium text-[#1f2937]">Browse Courses</p>
                <p className="text-sm text-[#6b7280]">Explore new content</p>
              </div>
            </button>
            <button className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[#52abff] hover:bg-blue-50 transition-all duration-200">
              <span className="text-2xl">📝</span>
              <div className="text-left">
                <p className="font-medium text-[#1f2937]">My Assignments</p>
                <p className="text-sm text-[#6b7280]">View pending tasks</p>
              </div>
            </button>
            <button
              onClick={() => {
                setIsChatOpen(true);
                startNewConversation();
              }}
              className="flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-[#52abff] hover:bg-blue-50 transition-all duration-200"
            >
              <span className="text-2xl">💬</span>
              <div className="text-left">
                <p className="font-medium text-[#1f2937]">Get Support</p>
                <p className="text-sm text-[#6b7280]">Chat with us</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => {
            setIsChatOpen(true);
            if (conversations.length > 0) {
              setShowConversationList(true);
            } else {
              startNewConversation();
            }
          }}
          className="fixed bottom-6 right-6 bg-[#52abff] hover:bg-[#20578f] text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 z-50"
          aria-label="Open chat"
        >
          <FiMessageCircle size={28} />
        </button>
      )}

      {/* Chat Widget */}
      {isChatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-[#52abff] to-[#20578f] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">💬</div>
              <div>
                <h3 className="font-semibold">Customer Support</h3>
                <p className="text-xs text-white/80">{currentConversationId ? "Conversation active" : "Start a new conversation"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => setShowConversationList(!showConversationList)} className="hover:bg-white/20 rounded-full p-2 transition-colors" aria-label="View conversations">
                <FiList size={18} />
              </button>
              <button onClick={() => setIsChatOpen(false)} className="hover:bg-white/20 rounded-full p-2 transition-colors" aria-label="Close chat">
                <FiX size={20} />
              </button>
            </div>
          </div>

          {/* Conversation List View */}
          {showConversationList ? (
            <div className="flex-1 h-96 overflow-y-auto bg-gray-50 p-4">
              <button onClick={startNewConversation} className="w-full mb-4 p-3 bg-[#52abff] hover:bg-[#20578f] text-white rounded-xl font-medium transition-colors">
                + New Conversation
              </button>
              {conversations.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No conversations yet</p>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <button key={conv.id} onClick={() => openConversation(conv)} className="w-full p-3 bg-white rounded-xl border border-gray-200 hover:border-[#52abff] text-left transition-all">
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${conv.status === "open" ? "bg-yellow-100 text-yellow-800" : conv.status === "in_progress" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}>
                          {conv.status}
                        </span>
                        <span className="text-xs text-gray-400">{new Date(conv.updated_at).toLocaleDateString()}</span>
                      </div>
                      <p className="text-sm text-gray-700 truncate">{conv.last_message}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Chat Messages */}
              <div className="flex-1 p-4 overflow-y-auto h-96 bg-gray-50">
                {messages.map((message) => (
                  <div key={message.id} className={`mb-4 flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%]`}>
                      <div className={`rounded-2xl px-4 py-2.5 ${message.sender === "customer" ? "bg-[#52abff] text-white rounded-br-sm" : "bg-white text-[#1f2937] border border-gray-200 rounded-bl-sm"}`}>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                      </div>
                      <p className={`text-xs text-[#6b7280] mt-1 ${message.sender === "customer" ? "text-right" : "text-left"}`}>{formatTime(message.timestamp)}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="mb-4 flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    placeholder="Type your message..."
                    disabled={isLoading}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full focus:outline-none focus:border-[#52abff] focus:ring-2 focus:ring-[#52abff]/20 transition-all disabled:bg-gray-100"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-[#52abff] hover:bg-[#20578f] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-2.5 transition-colors"
                    aria-label="Send message"
                  >
                    <FiSend size={20} />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
