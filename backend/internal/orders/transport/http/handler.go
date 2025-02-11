package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/orders/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/transport/http/order"
	"github.com/Alexander272/new-sealur-pro/internal/orders/transport/http/position"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	services *services.Services
}

func NewHandler(services *services.Services) *Handler {
	return &Handler{
		services: services,
	}
}

func (h *Handler) Init(api *gin.RouterGroup, middleware *middleware.Middleware) {
	orders := api.Group("/orders", middleware.VerifyToken)
	order.Register(orders, h.services.Order, middleware)
	position.Register(orders, h.services.Position, middleware)
}
