package main

import (
	"log"
	"net/http"

	"github.com/BimoAtaullahR/ai-customer-support/internal/config"
	"github.com/BimoAtaullahR/ai-customer-support/internal/handler"
	"github.com/BimoAtaullahR/ai-customer-support/internal/middleware"
	"github.com/BimoAtaullahR/ai-customer-support/pkg/firebase"
	"github.com/gin-gonic/gin"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Println("Peringatan: File .env tidak ditemukan, menggunakan env system")
	}
	//muat konfigurasi (dari .env)
	cfg := config.LoadFirebaseConfig()
	if cfg.ServiceAccountPath == "" {
		log.Fatal("FIREBASE_SERVICE_ACCOUNT_PATH tidak ditemukan di .env")
	}

	//inisialisasi Firebase App
	app, ctx, err := firebase.InitFirebase(cfg)
	if err != nil {
		log.Fatalf("Gagal inisialisasi Firebase: %v", err)
	}

	//inisialisasi Firestore Client (untuk operasional database)
	firestoreClient, err := app.Firestore(ctx)
	if err != nil {
		log.Fatalf("Gagal inisialisasi Firebase: %v", err)
	}
	defer firestoreClient.Close()

	//setup Gin Router
	r := gin.Default()

	//middleware sederhana untuk CORS agar frontend bisa akses
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	//inisialisasi auth client
	authClient, _ := app.Auth(ctx)

	//inisialisasi handler auth
	authHandler := handler.NewAuthHandler(authClient, firestoreClient)

	//grouping API sesuai contract
	v1 := r.Group("/api/v1")
	{
		//endpoint auth
		authGroup := v1.Group("/auth")
		{
			authGroup.POST("/register", authHandler.Register)
			authGroup.POST("/login", authHandler.Login)
		}
		//endpoint inbox & conversations
		conversations := v1.Group("/conversations")
		{
			conversations.GET("", middleware.AuthMiddleware(authClient), func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Fetch conversations ready"})
			})
			conversations.GET("/:id", func(c *gin.Context) {
				c.JSON(http.StatusOK, gin.H{"message": "Detail conversations ready"})
			})
		}
	}

	//menjalankan server
	port := ":8080"
	log.Printf("Server berjalan di port: %s", port)
	r.Run(port)
}
