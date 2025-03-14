package v1

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/middleware"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/auth"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/flange_standard"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/material"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/mounting"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/standard"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/temperature"
	"github.com/Alexander272/new-sealur-pro/internal/transport/http/v1/users"
	"github.com/gin-gonic/gin"
)

type Deps struct {
	Services   *services.Services
	Conf       *config.Config
	Middleware *middleware.Middleware
}

func Register(api *gin.RouterGroup, deps *Deps) {
	// v1 := api.Group("/v1")

	auth.Register(api, &auth.Deps{Services: deps.Services, Conf: deps.Conf.Auth, Middleware: deps.Middleware})
	users.Register(api, deps.Services.User, deps.Middleware)
	temperature.Register(api, deps.Services.Temperature, deps.Middleware)
	mounting.Register(api, deps.Services.Mounting, deps.Middleware)
	standard.Register(api, deps.Services.Standard, deps.Middleware)
	flange_standard.Register(api, deps.Services.FlangeStandard, deps.Middleware)
	material.Register(api, deps.Services.Materials, deps.Middleware)
}
