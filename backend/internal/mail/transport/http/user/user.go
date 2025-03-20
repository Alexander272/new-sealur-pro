package user

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
	service services.User
}

func NewHandler(service services.User) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.User, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	user := api.Group("/user")
	{
		user.POST("/confirm", handler.confirm)
		user.POST("/recovery", handler.recovery)
	}
}

func (h *Handler) confirm(c *gin.Context) {
	dto := &models.ConfirmDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	if err := h.service.Confirm(dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "не удалось отправить подтверждение")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Отправлен тестовый email для подтверждения", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Отправлен email для подтверждения"})
}

func (h *Handler) recovery(c *gin.Context) {
	dto := &models.RecoveryDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	if err := h.service.Recovery(dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось отправить email")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Отправлен тестовый email для восстановления пароля", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Отправлен email для восстановления пароля"})
}
