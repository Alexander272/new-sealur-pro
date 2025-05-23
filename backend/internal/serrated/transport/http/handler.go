package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/serrated/services"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/construction"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/flange_type"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/materials"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/plating"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/serrated_type"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http/sizes"
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
	serrated_type.Register(serrated, h.services, middleware)
	construction.Register(serrated, h.services.Construction, middleware)
	sizes.Register(serrated, h.services.Size, middleware)
	plating.Register(serrated, h.services.Plating, middleware)
	materials.Register(serrated, h.services.Material, middleware)
}
