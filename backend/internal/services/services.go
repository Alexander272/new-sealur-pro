package services

import (
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
)

type Services struct {
	Confirm
	Limit
	Session

	FlangeStandard
	Materials
	Mounting
	Standard
	Temperature
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
	confirm := NewConfirmService(deps.Repos.Confirm, deps.TokenManager, deps.ConfirmTTL)
	limit := NewLimitService(deps.Repos.Limit, deps.LimitTTL)
	session := NewSessionService(deps.Repos.Session, deps.TokenManager, deps.AccessTokenTTL, deps.RefreshTokenTTL)

	standard := NewStandardService(deps.Repos.Standard)
	flangeStandard := NewFlangeStandardService(deps.Repos.FlangeStandard)
	materials := NewMaterialsService(deps.Repos.Material)
	mounting := NewMountingService(deps.Repos.Mounting)
	temperature := NewTemperatureService(deps.Repos.Temperature)

	return &Services{
		Confirm: confirm,
		Limit:   limit,
		Session: session,

		FlangeStandard: flangeStandard,
		Materials:      materials,
		Mounting:       mounting,
		Standard:       standard,
		Temperature:    temperature,
	}
}
