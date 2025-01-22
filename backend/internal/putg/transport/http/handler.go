package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/putg/services"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/configuration"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/construction"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/filler"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/flange_type"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/info"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/materials"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/size"
	"github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/standard_info"
	putg_type "github.com/Alexander272/new-sealur-pro/internal/putg/transport/http/type"
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
	putg := api.Group("/putg")
	configuration.Register(putg, h.services.Configuration, middleware)
	construction.Register(putg, h.services, middleware)
	filler.Register(putg, h.services, middleware)
	flange_type.Register(putg, h.services.FlangeType, middleware)
	info.Register(putg, h.services.Info, middleware)
	materials.Register(putg, h.services.Material, middleware)
	size.Register(putg, h.services.Size, middleware)
	standard_info.Register(putg, h.services.StandardInfo, middleware)
	putg_type.Register(putg, h.services.Type, middleware)
}
