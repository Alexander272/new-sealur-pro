package services

import (
	"context"
	"fmt"
	"strings"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
	"github.com/golang-jwt/jwt/v5"
)

type SessionService struct {
	repo         repository.Session
	tokenManager auth.TokenManager
	keycloak     *auth.KeycloakClient
	user         User
}

type SessionDeps struct {
	Repo     repository.Session
	Manager  auth.TokenManager
	Keycloak *auth.KeycloakClient
	User     User
}

func NewSessionService(deps *SessionDeps) *SessionService {
	return &SessionService{
		repo:         deps.Repo,
		tokenManager: deps.Manager,
		keycloak:     deps.Keycloak,
		user:         deps.User,
	}
}

type Session interface {
	SignIn(ctx context.Context, dto *models.SignInDTO) (*models.User, error)
	Create(ctx context.Context, dto *models.User) error
	SignOut(ctx context.Context, dto *models.SignOutDTO) error
	SignUp(ctx context.Context, dto *models.SignUpDTO) error
	Refresh(ctx context.Context, dto *models.RefreshDTO) (*models.User, error)
	DecodeToken(ctx context.Context, claims *jwt.MapClaims) (*models.User, error)
}

func (s *SessionService) SignIn(ctx context.Context, dto *models.SignInDTO) (*models.User, error) {
	cnd, err := s.user.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: dto.Username})
	if err != nil {
		return nil, err
	}

	if cnd.Realm == "" {
		if err := s.user.CreateInProvider(ctx, cnd, dto); err != nil {
			return nil, err
		}
	}

	res, err := s.keycloak.Client.Login(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, cnd.Realm, dto.Username, dto.Password)
	if err != nil {
		return nil, fmt.Errorf("failed to login to keycloak. error: %w", err)
	}

	cnd.AccessToken = res.AccessToken
	cnd.RefreshToken = res.RefreshToken

	//TODO надо бы наверное фиксировать когда пользователь заходил в систему и еще можно попробовать вести таблицу с сессиями (запоминать ip, устройство и тд), можно кстати эти две таблицы объединить

	return cnd, nil
}

func (s *SessionService) Create(ctx context.Context, dto *models.User) error {
	res, err := s.keycloak.Client.Login(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, dto.Realm, dto.Nickname, dto.Password)
	if err != nil {
		return fmt.Errorf("failed to login to keycloak. error: %w", err)
	}

	dto.AccessToken = res.AccessToken
	dto.RefreshToken = res.RefreshToken
	return nil
}

func (s *SessionService) SignOut(ctx context.Context, dto *models.SignOutDTO) error {
	err := s.keycloak.Client.Logout(ctx, s.keycloak.ClientId, s.keycloak.ClientSecret, dto.Realm, dto.RefreshToken)
	if err != nil {
		return fmt.Errorf("failed to logout to keycloak. error: %w", err)
	}
	return nil
}

func (s *SessionService) SignUp(ctx context.Context, dto *models.SignUpDTO) error {
	createDTO := &models.UserDTO{
		Nickname:   strings.Split(dto.Email, "@")[0],
		Company:    dto.Company,
		Address:    dto.Address,
		Inn:        dto.Inn,
		Kpp:        dto.Kpp,
		Region:     dto.Region,
		City:       dto.City,
		Name:       dto.Name,
		Position:   dto.Position,
		Email:      dto.Email,
		Phone:      dto.Phone,
		Password:   dto.Password,
		ManagerId:  dto.ManagerId,
		UseLink:    dto.UseLink,
		UseLanding: dto.UseLanding,
	}

	if err := s.user.Create(ctx, createDTO); err != nil {
		return err
	}
	return nil
}

func (s *SessionService) Refresh(ctx context.Context, dto *models.RefreshDTO) (*models.User, error) {
	res, err := s.keycloak.Client.RefreshToken(ctx, dto.RefreshToken, s.keycloak.ClientId, s.keycloak.ClientSecret, dto.Realm)
	if err != nil {
		return nil, fmt.Errorf("failed to refresh token in keycloak. error: %w", err)
	}

	token, err := s.tokenManager.Retrospect(res.AccessToken)
	if err != nil {
		return nil, err
	}
	user, err := s.DecodeToken(ctx, token.Claims)
	if err != nil {
		return nil, err
	}
	// logger.Debug("refresh", logger.StringAttr("SessionState", res.SessionState), logger.AnyAttr("res", res))
	// user, err := s.user.GetById(ctx, &models.GetUserByIdDTO{ProviderId: res.SessionState})
	// if err != nil {
	// 	return nil, err
	// }

	user.AccessToken = res.AccessToken
	user.RefreshToken = res.RefreshToken

	return user, nil
}

func (s *SessionService) DecodeToken(ctx context.Context, claims *jwt.MapClaims) (*models.User, error) {
	user := &models.User{}

	c := *claims
	u, ok := c["preferred_username"]
	if ok {
		user.Nickname = u.(string)
	}
	pId, ok := c["sub"]
	if ok {
		user.ProviderId = pId.(string)
	}
	e, ok := c["email"]
	if ok {
		user.Email = e.(string)
	}
	r, ok := c["pro_role"]
	if ok {
		user.Role = r.(string)
	}
	id, ok := c["origin_id"]
	if ok {
		user.Id = id.(string)
	}
	issuer, ok := c["iss"]
	if ok {
		parts := strings.Split(issuer.(string), "/")
		user.Realm = parts[len(parts)-1]
	}

	// user, err := s.user.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: nick})
	// if err != nil {
	// 	return nil, err
	// }
	return user, nil
}
