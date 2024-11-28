package services

import (
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
)

type Services struct {
}

type Deps struct {
	Repos        *repository.Repository
	TokenManager auth.TokenManager
	// Keycloak        *auth.KeycloakClient
	AccessTokenTTL  time.Duration
	RefreshTokenTTL time.Duration
	ConfirmTTL      time.Duration
	LimitTTL        time.Duration
}

func NewServices(deps Deps) *Services {
	return &Services{}
}
