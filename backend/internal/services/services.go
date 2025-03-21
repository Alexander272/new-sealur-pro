package services

import (
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/Alexander272/new-sealur-pro/pkg/hasher"
)

type Services struct {
	Confirm
	Limit
	Session
	User

	Feedback
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
	Mail         *mail.Services
	Links        config.LinksConfig
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
		Mail:     deps.Mail,
		Role:     role,
		Confirm:  confirm,
		Links:    deps.Links,
	})
	session := NewSessionService(&SessionDeps{
		Repo:     deps.Repos.Session,
		Manager:  deps.TokenManager,
		Keycloak: deps.Keycloak,
		User:     user,
	})

	feedback := NewFeedbackService(deps.Mail)

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

		Feedback:       feedback,
		FlangeStandard: flangeStandard,
		Materials:      materials,
		Mounting:       mounting,
		Standard:       standard,
		Temperature:    temperature,
	}
}
