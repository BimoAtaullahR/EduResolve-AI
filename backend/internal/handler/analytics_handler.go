package handler

import (
	"net/http"

	"github.com/BimoAtaullahR/ai-customer-support/internal/service"
	"github.com/gin-gonic/gin"
)

type AnalyticsHandler struct {
	analyticsService *service.AnalyticsService
}

func NewAnalyticsHandler(as *service.AnalyticsService) *AnalyticsHandler {
	return &AnalyticsHandler{analyticsService: as}
}

func (s *AnalyticsHandler) GetOverview(c *gin.Context) {
	overview, err := s.analyticsService.GetOverview(c)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Gagal mengambil data analytics" + err.Error()})
		return
	}
	c.JSON(http.StatusOK, overview)
}
