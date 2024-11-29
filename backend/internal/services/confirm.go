package services

import (
	"context"
	"fmt"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
	"github.com/Alexander272/new-sealur-pro/pkg/auth"
)

type ConfirmService struct {
	repo         repository.Confirm
	tokenManager auth.TokenManager
	confirmTTL   time.Duration
}

func NewConfirmService(repo repository.Confirm, tokenManager auth.TokenManager, confirmTTL time.Duration) *ConfirmService {
	return &ConfirmService{
		repo:         repo,
		tokenManager: tokenManager,
		confirmTTL:   confirmTTL,
	}
}

type Confirm interface {
	Get(ctx context.Context, code string) (*models.ConfirmData, error)
	Create(ctx context.Context, userId string) (string, error)
}

func (s *ConfirmService) Get(ctx context.Context, code string) (*models.ConfirmData, error) {
	data, err := s.repo.Get(ctx, code)
	if err != nil {
		return nil, fmt.Errorf("failed to get data from code. error: %w", err)
	}
	return data, nil
}

func (s *ConfirmService) Create(ctx context.Context, userId string) (string, error) {
	code, err := s.tokenManager.NewRefreshToken()
	if err != nil {
		return "", fmt.Errorf("failed to generate code. error: %w", err)
	}

	data := &models.ConfirmData{
		UserId: userId,
		Code:   code,
		Exp:    s.confirmTTL,
	}

	if err := s.repo.Create(ctx, data); err != nil {
		return "", fmt.Errorf("failed to create confirm record. error: %w", err)
	}
	return code, nil
}
