package model

type AnalyticsOverview struct {
	IssueDistribution    map[string]int     `json:"issue_distribution"`
	AveragePriorityScore float64            `json:"average_priority_score"`
	DailyTickets         []DailyTicketStats `json:"daily_tickets"`
}

type DailyTicketStats struct {
	Date  string `json:"date"`
	Count int    `json:"count"`
}
