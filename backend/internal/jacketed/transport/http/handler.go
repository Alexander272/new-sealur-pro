package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/services"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/transport/http/construction"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/transport/http/flange_type"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/transport/http/jacketed_type"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/transport/http/standard_info"
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
	jacketed := api.Group("/jacketed", middleware.VerifyToken)
	standard_info.Register(jacketed, h.services.StandardInfo, middleware)
	flange_type.Register(jacketed, h.services.FlangeType, middleware)
	jacketed_type.Register(jacketed, h.services.JacketedBaseType, middleware)
	construction.Register(jacketed, h.services.Construction, middleware)
}
