// API Service for conversations with backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081/api/v1";

// Types
export interface Message {
  sender: string;
  sender_uid: string;
  text: string;
  timestamp: string;
}

export interface AIAnalysis {
  summary: string;
  category: string;
  priority_score: number;
  reason: string;
  sentiment: string;
  is_processed: boolean;
}

export interface Conversation {
  id: string;
  student_name: string;
  student_email: string;
  agent_uid?: string;
  agent_name?: string;
  last_message: string;
  status: string;
  messages?: Message[];
  ai_analysis: AIAnalysis;
  created_at: string;
  updated_at: string;
}

export interface ResponseSuggestion {
  tone: string;
  content: string;
}

export interface ConversationsResponse {
  success: boolean;
  data?: {
    conversations: Conversation[];
  };
  error?: string;
}

export interface ConversationResponse {
  success: boolean;
  data?: {
    conversation: Conversation;
  };
  error?: string;
}

export interface SuggestionsResponse {
  success: boolean;
  data?: {
    suggestions: ResponseSuggestion[];
  };
  error?: string;
}

/**
 * Create a new conversation (student initiates)
 */
export async function createConversation(payload: { student_name: string; student_email: string; message: string }): Promise<ConversationResponse> {
  try {
    const response = await fetch(`${API_URL}/conversations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to create conversation" };
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error("Create conversation error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Add message to existing conversation
 */
export async function addMessage(
  conversationId: string,
  payload: {
    sender_uid: string;
    sender_type: string;
    text: string;
  },
): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to add message" };
    }

    return { success: true };
  } catch (error) {
    console.error("Add message error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get all conversations (for agent or customer)
 * @param sortBy - Field to sort by (priority_score, updated_at)
 * @param order - Sort order (asc, desc)
 */
export async function getConversations(sortBy: string = "priority_score", order: string = "desc"): Promise<ConversationsResponse> {
  try {
    // Get Firebase ID token for authentication
    const { auth } = await import("@/lib/firebase/firebase");
    const token = await auth?.currentUser?.getIdToken();

    const params = new URLSearchParams({ sort_by: sortBy, order });
    const response = await fetch(`${API_URL}/conversations?${params}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("❌ Backend tidak mengembalikan JSON valid:", text);
      return { success: false, error: "Server Error: Invalid JSON response" };
    }

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch conversations" };
    }

    // Backend returns { conversations: [...] } directly
    return { success: true, data: { conversations: data.conversations || [] } };
  } catch (error) {
    console.error("Get conversations error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get single conversation with AI analysis
 */
export async function getConversation(conversationId: string): Promise<ConversationResponse> {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to fetch conversation" };
    }

    // Backend returns conversation object directly
    return { success: true, data: { conversation: data } };
  } catch (error) {
    console.error("Get conversation error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Get AI response suggestions
 */
export async function getSuggestions(conversationId: string): Promise<SuggestionsResponse> {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/suggestions`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to get suggestions" };
    }

    // Backend returns { suggestions: [...] } directly
    return { success: true, data: { suggestions: data.suggestions || [] } };
  } catch (error) {
    console.error("Get suggestions error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Assign agent to conversation
 */
export async function assignAgent(conversationId: string, payload: { agent_uid: string; agent_name: string }): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/assign`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to assign agent" };
    }

    return { success: true };
  } catch (error) {
    console.error("Assign agent error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Update conversation status
 */
export async function updateStatus(conversationId: string, status: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || "Failed to update status" };
    }

    return { success: true };
  } catch (error) {
    console.error("Update status error:", error);
    return { success: false, error: "Network error" };
  }
}
