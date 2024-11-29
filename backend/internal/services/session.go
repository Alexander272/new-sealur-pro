package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
)

type SessionService struct {
	repo            repository.Session
	tokenManager    auth.TokenManager
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
}

func NewSessionService(repo repository.Session, manager auth.TokenManager, accessTTL, refreshTTL time.Duration) *SessionService {
	return &SessionService{
		repo:            repo,
		tokenManager:    manager,
		accessTokenTTL:  accessTTL,
		refreshTokenTTL: refreshTTL,
	}
}

type Session interface {
	SingIn(ctx context.Context, user *models.User) (string, error)
	SingOut(ctx context.Context, userId string) error
	CheckSession(ctx context.Context, u *models.User, token string) (bool, error)
	TokenParse(token string) (user *models.User, err error)
}

func (s *SessionService) SingIn(ctx context.Context, user *models.User) (string, error) {
	_, accessToken, err := s.tokenManager.NewJWT(user.Id, user.Email, user.RoleCode, user.Company, user.Name, s.accessTokenTTL)
	if err != nil {
		return "", err
	}
	refreshToken, err := s.tokenManager.NewRefreshToken()
	if err != nil {
		return "", err
	}

	accessData := &models.SessionData{
		UserId:      user.Id,
		Name:        user.Name,
		Company:     user.Company,
		RoleCode:    user.RoleCode,
		AccessToken: accessToken,
		Exp:         s.accessTokenTTL,
	}
	if err := s.repo.Create(ctx, user.Id, accessData); err != nil {
		return "", fmt.Errorf("failed to create session. error: %w", err)
	}

	refreshData := &models.SessionData{
		UserId:       user.Id,
		Name:         user.Name,
		Company:      user.Company,
		RoleCode:     user.RoleCode,
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		Exp:          s.refreshTokenTTL,
	}
	if err := s.repo.Create(ctx, fmt.Sprintf("%s_refresh", user.Id), refreshData); err != nil {
		return "", fmt.Errorf("failed to create session (refresh). error: %w", err)
	}

	return accessToken, nil
}

func (s *SessionService) SingOut(ctx context.Context, userId string) error {
	err := s.repo.Remove(ctx, userId)
	if err != nil {
		return fmt.Errorf("failed to delete session. error: %w", err)
	}

	err = s.repo.Remove(ctx, fmt.Sprintf("%s_refresh", userId))
	if err != nil {
		return fmt.Errorf("failed to delete session (refresh). error: %w", err)
	}

	return nil
}

func (s *SessionService) CheckSession(ctx context.Context, u *models.User, token string) (bool, error) {
	user, err := s.repo.Get(ctx, u.Id)
	if err != nil && !errors.Is(err, models.ErrSessionEmpty) {
		return false, fmt.Errorf("failed to get session. error: %w", err)
	}

	refreshUser, err := s.repo.Get(ctx, fmt.Sprintf("%s_refresh", u.Id))
	if err != nil {
		return false, fmt.Errorf("failed to get session (refresh). error: %w", err)
	}

	if user.AccessToken != token && refreshUser.AccessToken != token {
		return false, models.ErrToken
	}

	if user.UserId == "" {
		return true, nil
	}
	return false, nil
}

func (s *SessionService) TokenParse(token string) (user *models.User, err error) {
	claims, err := s.tokenManager.Parse(token)
	if err != nil {
		return nil, err
	}

	// var roles []*user_api.Role
	// r := claims["roles"].([]interface{})
	// for _, v := range r {
	// 	m := v.(map[string]interface{})
	// 	roles = append(roles, &user_api.Role{
	// 		Id:      m["id"].(string),
	// 		Service: m["service"].(string),
	// 		Role:    m["role"].(string),
	// 	})
	// }

	user = &models.User{
		// Id:      claims["userId"].(string),
		// Email:   claims["email"].(string),
		// Name:    claims["name"].(string),
		// Company: claims["company"].(string),
		// // Roles: roles,
		// RoleCode: claims["roleCode"].(string),
	}

	for k, v := range claims {
		switch k {
		case "userId":
			user.Id = v.(string)
		case "email":
			user.Email = v.(string)
		case "name":
			user.Name = v.(string)
		case "company":
			user.Company = v.(string)
		case "roleCode":
			user.RoleCode = v.(string)
		}
	}

	return user, nil
}
