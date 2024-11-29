package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/snp/services"
	"github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/filler"
	"github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/info"
	"github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/materials"
	"github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/size"
	"github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/standard_info"
	snp_type "github.com/Alexander272/new-sealur-pro/internal/snp/transport/http/type"
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
	snp := api.Group("/snp", middleware.UserIdentity)
	filler.Register(snp, h.services.Filler, middleware)
	info.Register(snp, h.services.Info, middleware)
	materials.Register(snp, h.services.Materials, middleware)
	size.Register(snp, h.services.Size, middleware)
	standard_info.Register(snp, h.services.StandardInfo, middleware)
	snp_type.Register(snp, h.services.Type, middleware)
}
