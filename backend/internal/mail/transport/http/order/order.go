package order

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
	service services.Order
}

func NewHandler(service services.Order) *Handler {
	return &Handler{
		service: service,
	}
}

func Register(api *gin.RouterGroup, service services.Order, middleware *middleware.Middleware) {
	handler := NewHandler(service)

	order := api.Group("/order")
	{
		order.POST("", handler.send)
		order.POST("/redirect", handler.redirect)
	}
}

func (h *Handler) send(c *gin.Context) {
	dto := &models.OrderDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	if err := h.service.Send(dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось отправить заказ")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Отправлен тестовый заказ", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Отправлен заказ"})
}

func (h *Handler) redirect(c *gin.Context) {
	dto := &models.RedirectDTO{}
	if err := c.BindJSON(dto); err != nil {
		response.NewErrorResponse(c, http.StatusBadRequest, "empty params", "Отправлены некорректные данные")
		return
	}

	if err := h.service.Redirect(dto); err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Не удалось перенаправить заказ")
		error_bot.Send(c, err.Error(), dto)
		return
	}
	logger.Info("Перенаправлен тестовый заказ", logger.AnyAttr("dto", dto))
	c.JSON(http.StatusOK, response.IdResponse{Message: "Перенаправлен заказ"})
}
