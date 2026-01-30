package handler

import (
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/BimoAtaullahR/ai-customer-support/internal/model"
	"github.com/BimoAtaullahR/ai-customer-support/internal/service"
	"github.com/gin-gonic/gin"
)

type StudentHandler struct {
	firestoreClient *firestore.Client
	aiService       *service.AIService
}

func NewStudentHandler(client *firestore.Client, aiSvc *service.AIService) *StudentHandler {
	return &StudentHandler{
		firestoreClient: client,
		aiService:       aiSvc,
	}
}

type CreateComplaintRequest struct {
	StudentName string `json:"student_name"`
	Text        string `json:"text" binding:"required"`
}

func (h *StudentHandler) SubmitComplaint(c *gin.Context) {
	userID, exists := c.Get("user_id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Unauthorized"})
		return
	}
	uid := userID.(string)

	var req CreateComplaintRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	analysis, err := h.aiService.ProcessComplaint(c.Request.Context(), req.Text)
	if err != nil {
		analysis = &model.AIAnalysis{
			PriorityScore: 5,
			Category:      "Uncategorized",
			Summary:       "AI Analysis Failed",
			IsProcessed:   false,
		}
	}

	newConv := model.Conversation{
		StudentId:   uid,
		StudentName: req.StudentName,
		Status:      "open",
		LastMessage: req.Text,
		AIAnalysis:  *analysis,
		Messages: []model.Message{
			{
				Sender:    "student",
				Text:      req.Text,
				Timestamp: time.Now(),
			},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	ref, _, err := h.firestoreClient.Collection("conversations").Add(c.Request.Context(), newConv)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Faied to save complaint"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"success":   true,
		"message":   "Complaint submitted and analyzed",
		"ticket_id": ref.ID,
	})

}
