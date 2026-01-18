package middleware

import (
	"context"
	"net/http"
	"strings"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

// middleware menerima client auth dari firebase admin SDK
func AuthMiddleware(authClient *auth.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		//mendapatkan header "Authorization"
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Header otorisasi diperlukan"})
			c.Abort()
			return
		}

		//mendapatkan token dari header
		idToken := strings.TrimPrefix(authHeader, "Bearer ")
		if idToken == authHeader {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Format header harus 'Bearer <token>'"})
			c.Abort()
			return
		}

		//verifikasi token menggunakan firebase SDK
		token, err := authClient.VerifyIDToken(context.Background(), idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Token tidak valid atau kedaluwarsa"})
			c.Abort()
			return
		}

		c.Set("user_id", token.UID)
		c.Next()
	}
}
