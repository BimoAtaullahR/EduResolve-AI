package handler

import (
	"net/http"
	"time"

	"cloud.google.com/go/firestore"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	authClient      *auth.Client
	firestoreClient *firestore.Client
}

func NewAuthHandler(a *auth.Client, f *firestore.Client) *AuthHandler {
	return &AuthHandler{authClient: a, firestoreClient: f}
}

func (h *AuthHandler) Register(c *gin.Context) {
	var req struct {
		IDToken string `json:"idToken"`
		Role    string `json:"role"`
		Name    string `json:"name"`
		Email   string `json:"email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Format data tidak valid"})
		return
	}

	token, err := h.authClient.VerifyIDToken(c.Request.Context(), req.IDToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid"})
		return
	}

	userProfile := map[string]interface{}{
		"uid":        token.UID,
		"name":       req.Name,
		"email":      req.Email,
		"role":       req.Role,
		"created_at": time.Now(),
	}

	_, err = h.firestoreClient.Collection("users").Doc(token.UID).Set(c.Request.Context(), userProfile)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal menyimpan data user ke database"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"user": userProfile},
	})
}

func (h *AuthHandler) Login(c *gin.Context) {
	var req struct {
		IDToken string `json:"idToken"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token dibutuhkan"})
		return
	}

	token, err := h.authClient.VerifyIDToken(c.Request.Context(), req.IDToken)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Sesi tidak valid, silakan login ulang"})
		return
	}

	doc, err := h.firestoreClient.Collection("users").Doc(token.UID).Get(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User belum terdaftar di sistem database"})
		return
	}

	userProfile := doc.Data()
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    gin.H{"user": userProfile},
	})
}
