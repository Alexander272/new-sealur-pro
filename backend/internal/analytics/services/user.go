package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/repository"
)

type UserService struct {
	repo repository.User
}

func NewUserService(repo repository.User) *UserService {
	return &UserService{
		repo: repo,
	}
}

type User interface {
	GetUsersStats(ctx context.Context, req *models.Period) (*models.UsersStats, error)
	GetUsersInfo(ctx context.Context, req *models.GetUsersInfoDTO) ([]*models.UsersInfo, error)
}

func (s *UserService) GetUsersStats(ctx context.Context, req *models.Period) (*models.UsersStats, error) {
	data, err := s.repo.GetUsersStats(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get users statistics. error: %w", err)
	}
	return data, nil
}

func (s *UserService) GetUsersInfo(ctx context.Context, req *models.GetUsersInfoDTO) ([]*models.UsersInfo, error) {
	data, err := s.repo.GetUsersInfo(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get users info. error: %w", err)
	}
	return data, nil
}
