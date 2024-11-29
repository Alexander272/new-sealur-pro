package services

import (
	"context"
	"fmt"
	"time"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type LimitService struct {
	repo     repository.Limit
	limitTTL time.Duration
}

func NewLimitService(repo repository.Limit, limitTTL time.Duration) *LimitService {
	return &LimitService{
		repo:     repo,
		limitTTL: limitTTL,
	}
}

type Limit interface {
	Get(ctx context.Context, clientIP string) (data *models.LimitData, err error)
	Create(ctx context.Context, clientIP string) error
	AddAttempt(ctx context.Context, clientIP string) error
	Remove(ctx context.Context, clientIP string) error
}

func (s *LimitService) Get(ctx context.Context, clientIP string) (data *models.LimitData, err error) {
	data, err = s.repo.Get(ctx, clientIP)
	if err != nil {
		return data, fmt.Errorf("failed to get limit. error: %w", err)
	}

	return data, nil
}

func (s *LimitService) Create(ctx context.Context, clientIP string) error {
	if err := s.repo.Create(ctx, clientIP, s.limitTTL); err != nil {
		return fmt.Errorf("failed to create limit. error: %w", err)
	}
	return nil
}

func (s *LimitService) AddAttempt(ctx context.Context, clientIP string) error {
	if err := s.repo.AddAttempt(ctx, clientIP, s.limitTTL); err != nil {
		return fmt.Errorf("failed to add attempt to limit. error: %w", err)
	}
	return nil
}

func (s *LimitService) Remove(ctx context.Context, clientIP string) error {
	if err := s.repo.Remove(ctx, clientIP); err != nil {
		return fmt.Errorf("failed to remove limit. error: %w", err)
	}
	return nil
}
