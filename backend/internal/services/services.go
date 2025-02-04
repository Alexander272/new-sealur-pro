package services

import (
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/Alexander272/new-sealur-pro/pkg/hasher"
)

type Services struct {
	Confirm
	Limit
	Session
	User

	FlangeStandard
	Materials
	Mounting
	Standard
	Temperature
}

type Deps struct {
	Repos        *repository.Repository
	TokenManager auth.TokenManager
	Hasher       hasher.PasswordHasher
	Keycloak     *auth.KeycloakClient
	ConfirmTTL   time.Duration
	LimitTTL     time.Duration
}

func NewServices(deps Deps) *Services {
	confirm := NewConfirmService(deps.Repos.Confirm, deps.TokenManager, deps.ConfirmTTL)
	limit := NewLimitService(deps.Repos.Limit, deps.LimitTTL)

	role := NewRoleService(deps.Repos.Role)
	user := NewUserService(&UserDeps{
		Repo:     deps.Repos.User,
		Hasher:   deps.Hasher,
		Keycloak: deps.Keycloak,
		Role:     role,
	})
	session := NewSessionService(&SessionDeps{
		Repo:     deps.Repos.Session,
		Manager:  deps.TokenManager,
		Keycloak: deps.Keycloak,
		User:     user,
	})

	standard := NewStandardService(deps.Repos.Standard)
	flangeStandard := NewFlangeStandardService(deps.Repos.FlangeStandard)
	materials := NewMaterialsService(deps.Repos.Material)
	mounting := NewMountingService(deps.Repos.Mounting)
	temperature := NewTemperatureService(deps.Repos.Temperature)

	return &Services{
		Confirm: confirm,
		Limit:   limit,
		User:    user,
		Session: session,

		FlangeStandard: flangeStandard,
		Materials:      materials,
		Mounting:       mounting,
		Standard:       standard,
		Temperature:    temperature,
	}
}
