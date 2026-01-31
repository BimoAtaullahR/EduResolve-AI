package handler

import (
	"net/http"
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

	// 1. Definisikan Query
	// Kita mengakses field 'priority_score' di dalam map 'ai_analysis'
	// 'firestore.Desc' artinya skor 10 akan berada di urutan paling atas
	query := h.firestoreClient.Collection("conversations").
		OrderBy("ai_analysis.priority_score", firestore.Desc)

	// 2. Eksekusi Query
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
		// 3. Mapping data Firestore ke Struct Go
		if err := doc.DataTo(&conv); err != nil {
			continue // Skip jika ada data yang korup
		}

		// Set ID dokumen agar Frontend bisa melakukan navigasi ke detail chat
		conv.ID = doc.Ref.ID

		conversations = append(conversations, conv)
	}

	// Jika kosong, kembalikan array kosong bukan null
	if conversations == nil {
		conversations = []model.Conversation{}
	}

	c.JSON(http.StatusOK, gin.H{
		"conversations": conversations,
	})
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
		Sender:    "agent", // Hardcode sender sebagai agent/support
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
