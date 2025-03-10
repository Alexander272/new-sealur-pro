package http

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/files/transport/http/files"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	Services *services.Services
	conf     config.MinIOConfig
}

func NewHandler(services *services.Services, conf config.MinIOConfig) *Handler {
	return &Handler{
		Services: services,
		conf:     conf,
	}
}

func (h *Handler) Init(api *gin.RouterGroup, middleware *middleware.Middleware) {
	files.Register(api, &files.Deps{
		Service:    h.Services.Files,
		Middleware: middleware,
		Config:     h.conf,
	})
}
