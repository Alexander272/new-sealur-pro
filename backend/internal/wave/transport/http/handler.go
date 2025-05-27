package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/internal/wave/services"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/configuration"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/construction"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/flange_type"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/info"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/materials"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/plating"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/sizes"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/standard_info"
	"github.com/Alexander272/new-sealur-pro/internal/wave/transport/http/wave_type"
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
	wave := api.Group("/wave", middleware.VerifyToken)
	standard_info.Register(wave, h.services.StandardInfo, middleware)
	flange_type.Register(wave, h.services.FlangeType, middleware)
	wave_type.Register(wave, h.services, middleware)
	construction.Register(wave, h.services, middleware)
	sizes.Register(wave, h.services.Size, middleware)
	plating.Register(wave, h.services.Plating, middleware)
	materials.Register(wave, h.services.Material, middleware)
	configuration.Register(wave, h.services.Configuration, middleware)
	info.Register(wave, h.services.Info, middleware)
}
