package service

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"

	"cloud.google.com/go/firestore"
	"github.com/BimoAtaullahR/ai-customer-support/internal/model"
	"github.com/BimoAtaullahR/ai-customer-support/pkg/ai"
	"github.com/google/generative-ai-go/genai"
)

type AIService struct {
	geminiClient *ai.GeminiClient
	firestore    *firestore.Client
}

func NewAIService(g *ai.GeminiClient, f *firestore.Client) *AIService {
	return &AIService{geminiClient: g, firestore: f}
}

func (s *AIService) ProcessComplaint(ctx context.Context, conversationsID string, complainText string) (*model.AIAnalysis, error) {
	if complainText == "" {
		return nil, errors.New("complain text cannot be empty")
	}

	//konstruksi prompt
	prompt := fmt.Sprintf(`Analisislah keluhan mahasiswa berikut: "%s".
	Berikan output dalam format JSON mentah dengan field berikut:
	- summary (string): ringkasan singkat keluhan.
	- category (string): kategori keluhan (misal: Akademik, Fasilitas, Keuangan).
	- priority_score (integer 1-10): tingkat urgensi.
	- reason (string): alasan penentuan skor dan kategori.
	- sentiment (string): sentimen pesan (positif/negatif/netral).`, complainText)

	//konfigurasi model
	aiModel := s.geminiClient.Model
	aiModel.ResponseMIMEType = "application/json"

	//panggil generatecontent
	resp, err := aiModel.GenerateContent(ctx, genai.Text(prompt))
	if err != nil {
		return nil, fmt.Errorf("gagal memanggil gemini: %w", err)
	}

	if len(resp.Candidates) == 0 {
		return nil, fmt.Errorf("gemini tidak memberikan respon")
	}

	//response parsing
	var analysis model.AIAnalysis
	respText := fmt.Sprint(resp.Candidates[0].Content.Parts[0])
	if err := json.Unmarshal([]byte(respText), &analysis); err != nil {
		return nil, fmt.Errorf("gagal Unmarshal JSON AI: %w", err)
	}
	//set isprocessed jadi true
	analysis.IsProcessed = true
	//update database
	_, err = s.firestore.Collection("conversations").Doc(conversationsID).Set(ctx, map[string]interface{}{
		"ai_analysis": analysis,
	}, firestore.MergeAll)

	if err != nil {
		return nil, fmt.Errorf("gagal update firestore: %w", err)
	}

	return &analysis, nil
}
