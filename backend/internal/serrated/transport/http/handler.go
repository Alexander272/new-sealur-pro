package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/serrated/services"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/flange_type"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/standard_info"
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
	serrated := api.Group("/serrated", middleware.VerifyToken)
	standard_info.Register(serrated, h.services.StandardInfo, middleware)
	flange_type.Register(serrated, h.services.FlangeType, middleware)
}
