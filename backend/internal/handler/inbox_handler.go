package handler

import (
	"net/http"

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
