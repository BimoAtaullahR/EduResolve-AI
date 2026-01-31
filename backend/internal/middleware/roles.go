package middleware

import (
	"context"
	"net/http"

	"cloud.google.com/go/firestore"
	"github.com/gin-gonic/gin"
)

func RequireRole(role string, f *firestore.Client) gin.HandlerFunc {
	return func(c *gin.Context) {
		uid, exists := c.Get("user_id")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "UID tidak ditemukan"})
			return
		}

		dsnap, err := f.Collection("users").Doc(uid.(string)).Get(context.Background())
		if err != nil {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Access Denied: user profile tidak ditemukan"})
			return
		}

		data := dsnap.Data()
		roleData, ok := data["role"].(string)
		if !ok {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acces Denied: invalid role data"})
			return
		}

		if roleData != role {
			c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "Acces Denied: You are not a " + role})
			return
		}

		c.Next()

	}
}
