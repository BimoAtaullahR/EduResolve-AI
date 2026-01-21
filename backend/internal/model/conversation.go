package model

import "time"

type Message struct {
	Sender    string    `json:"sender" firestore:"sender"` // "student" atau "support"
	Text      string    `json:"text" firestore:"text"`
	Timestamp time.Time `json:"timestamp" firestore:"timestamp"`
}

type AIAnalysis struct {
	Summary       string `json:"summary" firestore:"summary"`
	Category      string `json:"category" firestore:"category"`
	PriorityScore int    `json:"priority_score" firestore:"priority_score"`
	Reason        string `json:"reason" firestore:"reason"`
	Sentiment     string `json:"sentiment" firestore:"sentiment"`
	IsProcessed   bool   `json:"is_processed" firestore:"is_processed"`
}

type Conversation struct {
	ID          string     `json:"id" firestore:"-"` // ID dokumen firestore, tidak perlu disimpan di dalam body doc
	StudentName string     `json:"student_name" firestore:"student_name"`
	LastMessage string     `json:"last_message" firestore:"last_message"`
	Status      string     `json:"status" firestore:"status"` // "open", "in_progress", "resolved"
	Messages    []Message  `json:"messages" firestore:"messages"`
	AIAnalysis  AIAnalysis `json:"ai_analysis" firestore:"ai_analysis"`
	UpdatedAt   time.Time  `json:"updated_at" firestore:"updated_at"`
}
