package user

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/services"
	"github.com/Alexander272/new-sealur-pro/internal/models/response"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
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

	users := api.Group("/users")
	{
		users.GET("/stats", handler.getUsersStats)
		users.GET("/info", handler.getUsersInfo)
	}
}

func (h *Handler) getUsersStats(c *gin.Context) {
	periodParam := c.QueryMap("period")
	req := &models.Period{
		Start: periodParam["from"],
		End:   periodParam["to"],
	}

	data, err := h.service.GetUsersStats(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data})
}

func (h *Handler) getUsersInfo(c *gin.Context) {
	periodParam := c.QueryMap("period")
	fromManager := c.Query("fromManager")
	withOrders := c.Query("withOrders")
	confirmed := c.Query("confirmed")

	from := fromManager == "true"
	orders := withOrders == "true"

	req := &models.GetUsersInfoDTO{
		Period: &models.Period{
			Start: periodParam["from"],
			End:   periodParam["to"],
		},
		FromManager: &from,
		WithOrders:  &orders,
		Confirmed:   confirmed != "false",
	}
	if fromManager == "" {
		req.FromManager = nil
	}
	if withOrders == "" {
		req.WithOrders = nil
	}

	data, err := h.service.GetUsersInfo(c, req)
	if err != nil {
		response.NewErrorResponse(c, http.StatusInternalServerError, err.Error(), "Произошла ошибка")
		error_bot.Send(c, err.Error(), req)
		return
	}
	c.JSON(http.StatusOK, response.DataResponse{Data: data, Total: len(data)})
}
