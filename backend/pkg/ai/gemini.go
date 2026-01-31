package ai

import (
	"context"
	"fmt"
	"log"
	"os"

	"github.com/google/generative-ai-go/genai"
	"google.golang.org/api/option"
)

type GeminiClient struct {
	Client *genai.Client
	Model  *genai.GenerativeModel
}

// menghubungkan backend dengan API Gemini
func InitGemini(ctx context.Context) (*GeminiClient, error) {
	apiKey := os.Getenv("GEMINI_API_KEY")
	if apiKey == "" {
		return nil, fmt.Errorf("GEMINI_API_KEY tidak ditemukan di .env")
	}

	//inisialisasi Client
	client, err := genai.NewClient(ctx, option.WithAPIKey(apiKey))
	if err != nil {
		return nil, err
	}

	model := client.GenerativeModel("gemini-2.5-flash")
	log.Println("Berhasil terhubung ke Gemini API")

	return &GeminiClient{
		Client: client,
		Model:  model,
	}, nil
}
