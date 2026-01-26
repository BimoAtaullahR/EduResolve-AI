package service

import (
	"context"
	"log"
	"time"

	"cloud.google.com/go/firestore"
	"github.com/BimoAtaullahR/ai-customer-support/internal/model"
	"google.golang.org/api/iterator"
)

//mengambil semua data yang ada di firestore
//lakukan logic masing masing jenis data yakni distribusi isu, rata rata sentiment, dan daily ticket

type AnalyticsService struct {
	firestore *firestore.Client
}

func NewAnalyticsService(client *firestore.Client) *AnalyticsService {
	return &AnalyticsService{firestore: client}
}

func (s *AnalyticsService) GetOverview(ctx context.Context) (*model.AnalyticsOverview, error) {
	iter := s.firestore.Collection("conversations").Documents(ctx)
	defer iter.Stop()

	issueDist := make(map[string]int)
	dateMap := make(map[string]int)
	var countPriority int
	var totalPriority float64

	for {
		doc, err := iter.Next()
		if err == iterator.Done {
			break
		}
		if err != nil {
			log.Printf("Error iterating documents: %v", err)
			return nil, err
		}

		var conv model.Conversation
		if err := doc.DataTo(&conv); err != nil {
			continue //data rusak
		}

		category := conv.AIAnalysis.Category
		if category == "" {
			category = "Others"
		}
		issueDist[category]++

		if conv.AIAnalysis.PriorityScore > 0 {
			countPriority++
			totalPriority += float64(conv.AIAnalysis.PriorityScore)
		}

		dateKey := conv.UpdatedAt.Format("2006-01-02")
		dateMap[dateKey]++

	}

	var avgPriority float64
	if countPriority > 0 {
		avgPriority = totalPriority / float64(countPriority)
	}

	var dailyTickets []model.DailyTicketStats
	now := time.Now()

	for i := 6; i >= 0; i-- {
		targetDate := now.AddDate(0, 0, -i)
		dateSTR := targetDate.Format("2006-01-02")

		count := 0
		if val, ok := dateMap[dateSTR]; ok {
			count = val
		}

		dailyTickets = append(dailyTickets, model.DailyTicketStats{
			Date:  dateSTR,
			Count: count,
		})
	}

	return &model.AnalyticsOverview{
		IssueDistribution:    issueDist,
		AveragePriorityScore: avgPriority,
		DailyTickets:         dailyTickets,
	}, nil
}
