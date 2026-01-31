package handler

import (
	"net/http"
	"sort"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/BimoAtaullahR/ai-customer-support/internal/model"
	"github.com/gin-gonic/gin"
	"google.golang.org/api/iterator"
)

type InboxHandler struct {
	firestoreClient *firestore.Client
}

func NewInboxHandler(client *firestore.Client) *InboxHandler {
	return &InboxHandler{
		firestoreClient: client,
	}
}

func (h *InboxHandler) GetConversations(c *gin.Context) {
	var conversations []model.Conversation

	// Read query parameters for sorting
	sortBy := c.DefaultQuery("sort_by", "priority_score")
	order := c.DefaultQuery("order", "desc")

	// Determine sort direction
	sortDirection := firestore.Desc
	if order == "asc" {
		sortDirection = firestore.Asc
	}

	// Build query based on sort_by parameter
	var query firestore.Query
	switch sortBy {
	case "updated_at":
		query = h.firestoreClient.Collection("conversations").
			OrderBy("updated_at", sortDirection)
	case "priority_score":
		fallthrough
	default:
		// Default: sort by AI analysis priority score
		query = h.firestoreClient.Collection("conversations").
			OrderBy("ai_analysis.priority_score", sortDirection)
	}

	// Execute query
	iter := query.Documents(c.Request.Context())
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data percakapan"})
			return
		}

		var conv model.Conversation
		if err := doc.DataTo(&conv); err != nil {
			continue // Skip corrupted data
		}

		// Set document ID for frontend navigation
		conv.ID = doc.Ref.ID

		conversations = append(conversations, conv)
	}

	// Return empty array instead of null
	if conversations == nil {
		conversations = []model.Conversation{}
	}

	c.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})
}

// GetStudentConversations - Get conversations for the logged-in student
func (h *InboxHandler) GetStudentConversations(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	var conversations []model.Conversation

	// Query conversations where student_id matches the logged-in user
	iter := h.firestoreClient.Collection("conversations").
		Where("student_id", "==", uid).
		Documents(c.Request.Context())
	defer iter.Stop()

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data percakapan"})
			return
		}

		var conv model.Conversation
		if err := doc.DataTo(&conv); err != nil {
			continue
		}
		conv.ID = doc.Ref.ID
		conversations = append(conversations, conv)
	}

	// Sort by updated_at descending (newest first)
	sort.Slice(conversations, func(i, j int) bool {
		return conversations[i].UpdatedAt.After(conversations[j].UpdatedAt)
	})

	if conversations == nil {
		conversations = []model.Conversation{}
	}

	c.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})
}

// GetStudentConversationDetail - Get a single conversation detail for student
func (h *InboxHandler) GetStudentConversationDetail(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)
	convID := c.Param("id")

	doc, err := h.firestoreClient.Collection("conversations").Doc(convID).Get(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Percakapan tidak ditemukan"})
		return
	}

	var conv model.Conversation
	if err := doc.DataTo(&conv); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal membaca data"})
		return
	}
	conv.ID = doc.Ref.ID

	// Verify ownership - student can only see their own conversations
	if conv.StudentId != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak"})
		return
	}

	c.JSON(http.StatusOK, conv)
}

type ReplyRequest struct {
	Text string `json:"text" binding:"required"`
}

func (h *InboxHandler) ReplyConversation(c *gin.Context) {
	// 1. Ambil ID Conversation dari URL
	convID := c.Param("id")

	// 2. Bind JSON Body
	var req ReplyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// 3. Siapkan Object Pesan Baru
	newMessage := model.Message{
		Sender:    "support", // Changed from "agent" to "support" for consistency
		Text:      req.Text,
		Timestamp: time.Now(),
	}

	// 4. Update Firestore secara Atomic
	// Kita update 3 field sekaligus: messages (append), last_message, dan updated_at
	_, err := h.firestoreClient.Collection("conversations").Doc(convID).Update(c.Request.Context(), []firestore.Update{
		{
			Path:  "messages",
			Value: firestore.ArrayUnion(newMessage), // PENTING: Menambahkan ke array, bukan menimpa
		},
		{
			Path:  "last_message",
			Value: req.Text,
		},
		{
			Path:  "updated_at",
			Value: time.Now(),
		},
		{
			Path:  "status",
			Value: "in_progress",
		},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengirim balasan: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"timestamp": newMessage.Timestamp,
	})
}

// StudentReplyConversation - Student reply to their own conversation
func (h *InboxHandler) StudentReplyConversation(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)
	convID := c.Param("id")

	// Verify ownership first
	doc, err := h.firestoreClient.Collection("conversations").Doc(convID).Get(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Percakapan tidak ditemukan"})
		return
	}

	var conv model.Conversation
	doc.DataTo(&conv)
	if conv.StudentId != uid {
		c.JSON(http.StatusForbidden, gin.H{"error": "Akses ditolak"})
		return
	}

	var req ReplyRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	newMessage := model.Message{
		Sender:    "student",
		Text:      req.Text,
		Timestamp: time.Now(),
	}

	_, err = h.firestoreClient.Collection("conversations").Doc(convID).Update(c.Request.Context(), []firestore.Update{
		{Path: "messages", Value: firestore.ArrayUnion(newMessage)},
		{Path: "last_message", Value: req.Text},
		{Path: "updated_at", Value: time.Now()},
	})

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengirim balasan"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success":   true,
		"timestamp": newMessage.Timestamp,
	})
}
