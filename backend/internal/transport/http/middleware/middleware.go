package middleware

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/services"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
)

type Middleware struct {
	keycloak *auth.KeycloakClient
	services *services.Services
	auth     config.AuthConfig
	token    auth.TokenManager
}

type MiddlewareDeps struct {
	Keycloak *auth.KeycloakClient
	Services *services.Services
	Auth     config.AuthConfig
	Token    auth.TokenManager
}

func NewMiddleware(deps *MiddlewareDeps) *Middleware {
	return &Middleware{
		services: deps.Services,
		auth:     deps.Auth,
		keycloak: deps.Keycloak,
		token:    deps.Token,
	}
}
