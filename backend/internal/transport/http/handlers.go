package http

import (
	"net/http"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	http_v1 "github.com/Alexander272/new-sealur-pro/internal/transport/http/v1"
	"github.com/Alexander272/new-sealur-pro/pkg/limiter"
	"github.com/gin-gonic/gin"
)

type Handler struct {
	// keycloak *auth.KeycloakClient
	services *services.Services
	Modules  []Modules
}

type Modules interface {
	Init(*gin.RouterGroup, *middleware.Middleware)
}

func NewHandler(services *services.Services) *Handler {
	return &Handler{
		services: services,
		Modules:  []Modules{},
		// keycloak: keycloak,
	}
}

func (h *Handler) Init(conf *config.Config) *gin.Engine {
	router := gin.Default()

	router.Use(
		limiter.Limit(conf.Limiter.RPS, conf.Limiter.Burst, conf.Limiter.TTL),
	)

	// Init router
	router.GET("/api/ping", func(c *gin.Context) {
		c.String(http.StatusOK, "pong")
	})

	h.initAPI(router, conf)

	return router
}

func (h *Handler) initAPI(router *gin.Engine, conf *config.Config) {
	v1 := router.Group("/api/v1")
	middleware := middleware.NewMiddleware(h.services, conf.Auth)
	http_v1.Register(v1, &http_v1.Deps{Services: h.services, Conf: conf, Middleware: middleware})

	for _, module := range h.Modules {
		module.Init(v1, middleware)
	}
}
