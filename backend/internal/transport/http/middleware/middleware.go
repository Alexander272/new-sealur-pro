package middleware

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/services"
)

type Middleware struct {
	CookieName string
	services   *services.Services
	auth       config.AuthConfig
	UserIdCtx  string
}

func NewMiddleware(services *services.Services, auth config.AuthConfig) *Middleware {
	return &Middleware{
		services:  services,
		auth:      auth,
		UserIdCtx: "userId",
	}
}
