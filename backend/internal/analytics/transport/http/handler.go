package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/analytics/services"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/transport/http/order"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/transport/http/user"
	"github.com/Alexander272/new-sealur-pro/internal/constants"
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
	analytics := api.Group("/analytics", middleware.VerifyToken, middleware.CheckAccess(constants.AllowCCO))
	order.Register(analytics, h.services.Order, middleware)
	user.Register(analytics, h.services.User, middleware)
}
