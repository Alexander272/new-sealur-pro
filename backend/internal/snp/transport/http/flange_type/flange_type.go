package flange_type

import (
	"github.com/Alexander272/new-sealur-pro/internal/snp/services"
)

type Handler struct {
	service services.FlangeType
}

func NewHandler(service services.FlangeType) *Handler {
	return &Handler{
		service: service,
	}
}

// func Register(api *gin.RouterGroup, service services.FlangeType, middleware *middleware.Middleware) {}
