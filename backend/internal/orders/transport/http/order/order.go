package order

import (
	"github.com/Alexander272/new-sealur-pro/internal/orders/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
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

	orders := api.Group("")
	{
		orders.GET("/current", handler.getCurrent)
		orders.PUT("/info", handler.setInfo)
	}
}

func (h *Handler) getCurrent(c *gin.Context) {

}

func (h *Handler) setInfo(c *gin.Context) {}
