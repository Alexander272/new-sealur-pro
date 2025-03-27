package order

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/services"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	orders "github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
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

	orders := api.Group("/orders")
	{
		orders.GET("/stats", handler.getOrdersStats)
		orders.GET("/stats/grouped", handler.getGroupedOrdersStats)
		orders.GET("/count", handler.getOrdersCount)
	}
}

func (h *Handler) getOrdersStats(c *gin.Context) {
	req := &models.GetOrdersStatsDTO{}
	// if err := c.Bind(req); err != nil {
	// 	response.NewErrorResponse(c, http.StatusBadRequest, err.Error(), "Произошла ошибка")
	// 	error_bot.Send(c, err.Error(), req)
	// 	return
	// }

	data, err := h.service.GetOrdersStats(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getGroupedOrdersStats(c *gin.Context) {
	periodParam := c.QueryMap("period")
	req := &models.Period{
		Start: periodParam["from"],
		End:   periodParam["to"],
	}

	data, err := h.service.GetGroupedOrdersStats(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}

func (h *Handler) getOrdersCount(c *gin.Context) {
	req := &models.GetOrdersCountDTO{
		Type: "",
	}
	filterType := c.Query("type")
	if filterType != "" {
		req.Type = orders.PositionType(filterType)
	}

	data, err := h.service.GetOrdersCount(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}
