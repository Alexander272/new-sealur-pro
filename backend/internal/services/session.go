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
	SignOut(ctx context.Context, dto *models.SignOutDTO) error
	SignUp(ctx context.Context, dto *models.SignUpDTO) error
	Refresh(ctx context.Context, dto *models.RefreshDTO) (*models.User, error)
	DecodeToken(ctx context.Context, claims *jwt.MapClaims) (*models.User, error)
	// SingIn(ctx context.Context, user *models.User) (string, error)
	// SingOut(ctx context.Context, userId string) error
	// CheckSession(ctx context.Context, u *models.User, token string) (bool, error)
	// TokenParse(token string) (user *models.User, err error)
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

	return cnd, nil
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

	// token, err := s.tokenManager.Retrospect(res.AccessToken)
	// if err != nil {
	// 	return nil, err
	// }
	// user, err := s.DecodeToken(ctx, token.Claims)
	// if err != nil {
	// 	return nil, err
	// }
	user, err := s.user.GetById(ctx, &models.GetUserByIdDTO{ProviderId: res.SessionState})
	if err != nil {
		return nil, err
	}

	user.AccessToken = res.AccessToken
	user.RefreshToken = res.RefreshToken

	return user, nil
}

func (s *SessionService) DecodeToken(ctx context.Context, claims *jwt.MapClaims) (*models.User, error) {
	var nick string
	c := *claims
	u, ok := c["preferred_username"]
	if ok {
		nick = u.(string)
	}

	user, err := s.user.GetByNick(ctx, &models.GetUserByNickDTO{Nickname: nick})
	if err != nil {
		return nil, err
	}
	return user, nil
}

// func (s *SessionService) SingIn(ctx context.Context, user *models.User) (string, error) {
// 	_, accessToken, err := s.tokenManager.NewJWT(user.Id, user.Email, user.Role, user.Company, user.Name, s.accessTokenTTL)
// 	if err != nil {
// 		return "", err
// 	}
// 	refreshToken, err := s.tokenManager.NewRefreshToken()
// 	if err != nil {
// 		return "", err
// 	}

// 	accessData := &models.SessionData{
// 		UserId:      user.Id,
// 		Name:        user.Name,
// 		Company:     user.Company,
// 		Role:        user.Role,
// 		AccessToken: accessToken,
// 		Exp:         s.accessTokenTTL,
// 	}
// 	if err := s.repo.Create(ctx, user.Id, accessData); err != nil {
// 		return "", fmt.Errorf("failed to create session. error: %w", err)
// 	}

// 	refreshData := &models.SessionData{
// 		UserId:       user.Id,
// 		Name:         user.Name,
// 		Company:      user.Company,
// 		Role:         user.Role,
// 		AccessToken:  accessToken,
// 		RefreshToken: refreshToken,
// 		Exp:          s.refreshTokenTTL,
// 	}
// 	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", user.Id), refreshData); err != nil {
// 		return "", fmt.Errorf("failed to create session (refresh). error: %w", err)
// 	}

// 	return accessToken, nil
// }

// func (s *SessionService) SingOut(ctx context.Context, userId string) error {
// 	err := s.repo.Remove(ctx, userId)
// 	if err != nil {
// 		return fmt.Errorf("failed to delete session. error: %w", err)
// 	}

// 	err = s.repo.Remove(ctx, fmt.Sprintf("%s_refresh", userId))
// 	if err != nil {
// 		return fmt.Errorf("failed to delete session (refresh). error: %w", err)
// 	}

// 	return nil
// }

// func (s *SessionService) CheckSession(ctx context.Context, u *models.User, token string) (bool, error) {
// 	user, err := s.repo.Get(ctx, u.Id)
// 	if err != nil && !errors.Is(err, models.ErrSessionEmpty) {
// 		return false, fmt.Errorf("failed to get session. error: %w", err)
// 	}

// 	refreshUser, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", u.Id))
// 	if err != nil {
// 		return false, fmt.Errorf("failed to get session (refresh). error: %w", err)
// 	}

// 	if user.AccessToken != token && refreshUser.AccessToken != token {
// 		return false, models.ErrToken
// 	}

// 	if user.UserId == "" {
// 		return true, nil
// 	}
// 	return false, nil
// }

// func (s *SessionService) TokenParse(token string) (user *models.User, err error) {
// 	claims, err := s.tokenManager.Parse(token)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// var roles []*user_api.Role
// 	// r := claims["roles"].([]interface{})
// 	// for _, v := range r {
// 	// 	m := v.(map[string]interface{})
// 	// 	roles = append(roles, &user_api.Role{
// 	// 		Id:      m["id"].(string),
// 	// 		Service: m["service"].(string),
// 	// 		Role:    m["role"].(string),
// 	// 	})
// 	// }

// 	user = &models.User{
// 		// Id:      claims["userId"].(string),
// 		// Email:   claims["email"].(string),
// 		// Name:    claims["name"].(string),
// 		// Company: claims["company"].(string),
// 		// // Roles: roles,
// 		// RoleCode: claims["roleCode"].(string),
// 	}

// 	for k, v := range claims {
// 		switch k {
// 		case "userId":
// 			user.Id = v.(string)
// 		case "email":
// 			user.Email = v.(string)
// 		case "name":
// 			user.Name = v.(string)
// 		case "company":
// 			user.Company = v.(string)
// 		case "role":
// 			user.Role = v.(string)
// 		}
// 	}

// 	return user, nil
// }
