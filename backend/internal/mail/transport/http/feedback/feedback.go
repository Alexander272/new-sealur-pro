package feedback

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/mail/models"
	"github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	service services.Feedback
}

func NewHandler(service services.Feedback) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Feedback, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	feedback := api.Group("/feedback")
	{
		feedback.POST("", handler.send)
	}
}

func (h *Handler) send(c *gin.Context) {
	dto := &models.FeedbackDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	if err := h.service.Send(dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось отправить отзыв")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Отправлен тестовый отзыв", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Отзыв отправлен"})
}
