"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { FiMessageCircle, FiX, FiSend, FiList, FiTrendingUp, FiAward, FiBookOpen, FiClock } from "react-icons/fi";
import { createConversation, addMessage, getConversations, type Conversation, type Message as APIMessage } from "@/lib/api";
import Link from "next/link";

// Enhanced stats with better visuals
const customerStats = [
  {
    name: "Active Courses",
    value: "12",
    icon: FiBookOpen,
    gradient: "from-[#52abff] to-[#20578f]",
    progress: 75,
    subtitle: "3 in progress",
  },
  {
    name: "Certificates",
    value: "8",
    icon: FiAward,
    gradient: "from-[#facc15] to-[#f59e0b]",
    progress: 67,
    subtitle: "4 more to unlock",
  },
  {
    name: "Study Hours",
    value: "142",
    icon: FiClock,
    gradient: "from-[#8b5cf6] to-[#6366f1]",
    progress: 85,
    subtitle: "This month",
  },
  {
    name: "Performance",
    value: "94%",
    icon: FiTrendingUp,
    gradient: "from-[#10b981] to-[#059669]",
    progress: 94,
    subtitle: "Above average",
  },
];

const recentActivities = [
  {
    course: "Advanced React Patterns",
    progress: 78,
    lastAccessed: "2 hours ago",
    color: "bg-[#52abff]",
  },
  {
    course: "UI/UX Design Fundamentals",
    progress: 45,
    lastAccessed: "Yesterday",
    color: "bg-[#facc15]",
  },
  {
    course: "JavaScript Masterclass",
    progress: 92,
    lastAccessed: "3 days ago",
    color: "bg-[#8b5cf6]",
  },
];

const upcomingDeadlines = [
  { task: "React Assignment #5", course: "Advanced React", dueDate: "Tomorrow", priority: "high" },
  { task: "Design Project Review", course: "UI/UX Design", dueDate: "In 3 days", priority: "medium" },
  { task: "JavaScript Quiz", course: "JS Masterclass", dueDate: "Next week", priority: "low" },
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

  useEffect(() => {
    if (user?.uid) {
      loadConversations();
    }
  }, [user?.uid]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const loadConversations = async () => {
    if (!user?.uid) return;
    const result = await getConversations();
    if (result.success && result.data?.conversations) {
      setConversations(result.data.conversations);
    }
  };

  const openConversation = (conv: Conversation) => {
    setCurrentConversationId(conv.id);
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

    const newMessage: LocalMessage = {
      id: Date.now().toString(),
      text: messageText,
      sender: "customer",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, newMessage]);

    try {
      if (!currentConversationId) {
        const result = await createConversation({
          student_name: userProfile?.displayName || user.email || "Customer",
          student_email: user.email || "",
          message: messageText,
        });

        if (result.success && result.data?.conversation) {
          setCurrentConversationId(result.data.conversation.id);
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

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-[#facc15]/20 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#ebf2ff] via-white to-[#ebf2ff]">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-r from-[#52abff] to-[#20578f] opacity-5"></div>
        <div className="relative max-w-7xl mx-auto px-4 md:px-8 pt-8 pb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold bg-linear-to-r from-[#20578f] to-[#52abff] bg-clip-text text-transparent mb-2">Welcome back, {userProfile?.displayName?.split(" ")[0] || "Learner"}! 👋</h1>
              <p className="text-[#6b7280] text-lg">Let's continue your amazing learning journey</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-8">
        {/* Stats Grid - Enhanced */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 -mt-6">
          {customerStats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={stat.name}
                className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-linear-to-br ${stat.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-linear-to-r ${stat.gradient} text-white`}>+{stat.progress}%</div>
                  </div>

                  <h3 className="text-sm font-medium text-[#6b7280] mb-1">{stat.name}</h3>
                  <div className="flex items-end justify-between mb-3">
                    <p className="text-3xl font-bold text-[#1f2937]">{stat.value}</p>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-100 rounded-full h-2 mb-2">
                    <div className={`h-2 rounded-full bg-linear-to-r ${stat.gradient} transition-all duration-1000`} style={{ width: `${stat.progress}%` }}></div>
                  </div>
                  <p className="text-xs text-[#6b7280]">{stat.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#1f2937]">Continue Learning</h2>
              <Link href="/customer/dashboard/courses" className="text-[#52abff] hover:text-[#20578f] font-semibold text-sm transition-colors">
                View All →
              </Link>
            </div>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="group p-5 rounded-2xl border-2 border-gray-100 hover:border-[#52abff] hover:shadow-md transition-all duration-300 cursor-pointer">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-[#1f2937] group-hover:text-[#52abff] transition-colors">{activity.course}</h3>
                    <span className="text-xs text-[#6b7280] bg-gray-100 px-3 py-1 rounded-full">{activity.lastAccessed}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-[#6b7280]">Progress</span>
                        <span className="text-sm font-bold text-[#1f2937]">{activity.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                        <div className={`h-3 ${activity.color} rounded-full transition-all duration-500 shadow-sm`} style={{ width: `${activity.progress}%` }}></div>
                      </div>
                    </div>
                    <button className="px-5 py-2 bg-linear-to-r from-[#52abff] to-[#20578f] text-white rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105">Resume</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
            <h2 className="text-2xl font-bold text-[#1f2937] mb-6">Upcoming Tasks</h2>

            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div key={index} className="p-4 rounded-2xl border-2 border-gray-100 hover:border-[#52abff] transition-all duration-300">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-sm text-[#1f2937]">{item.task}</h4>
                    <span className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(item.priority)}`}>{item.priority}</span>
                  </div>
                  <p className="text-xs text-[#6b7280] mb-2">{item.course}</p>
                  <div className="flex items-center gap-1 text-xs text-[#52abff] font-medium">
                    <FiClock className="w-3 h-3" />
                    Due {item.dueDate}
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-300 rounded-2xl text-[#6b7280] hover:border-[#52abff] hover:text-[#52abff] transition-all duration-300 font-medium">+ Add New Task</button>
          </div>
        </div>

        {/* Quick Actions - Enhanced */}
        <div className="bg-linear-to-br from-white to-[#ebf2ff] rounded-3xl p-8 shadow-lg border border-gray-100">
          <h2 className="text-2xl font-bold text-[#1f2937] mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/customer/dashboard/courses">
              <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[#52abff] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1">
                <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#52abff] to-[#20578f] opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
                <div className="relative">
                  <div className="w-14 h-14 bg-linear-to-br from-[#52abff] to-[#20578f] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-3xl">📖</span>
                  </div>
                  <h3 className="font-bold text-lg text-[#1f2937] mb-2">Browse Courses</h3>
                  <p className="text-sm text-[#6b7280]">Discover new learning opportunities</p>
                </div>
              </div>
            </Link>

            <div className="group relative overflow-hidden bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[#facc15] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1">
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#facc15] to-[#f59e0b] opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-[#facc15] to-[#f59e0b] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">📝</span>
                </div>
                <h3 className="font-bold text-lg text-[#1f2937] mb-2">My Assignments</h3>
                <p className="text-sm text-[#6b7280]">View and submit pending tasks</p>
              </div>
            </div>

            <div
              onClick={() => {
                setIsChatOpen(true);
                startNewConversation();
              }}
              className="group relative overflow-hidden bg-white p-6 rounded-2xl border-2 border-gray-200 hover:border-[#8b5cf6] transition-all duration-300 cursor-pointer hover:shadow-xl hover:-translate-y-1"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-br from-[#8b5cf6] to-[#6366f1] opacity-5 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500"></div>
              <div className="relative">
                <div className="w-14 h-14 bg-linear-to-br from-[#8b5cf6] to-[#6366f1] rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">💬</span>
                </div>
                <h3 className="font-bold text-lg text-[#1f2937] mb-2">Get Support</h3>
                <p className="text-sm text-[#6b7280]">Chat with our support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
