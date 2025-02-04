package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type RoleService struct {
	repo repository.Role
}

func NewRoleService(repo repository.Role) *RoleService {
	return &RoleService{
		repo: repo,
	}
}

type Role interface {
	Get(ctx context.Context, req *models.GetRolesDTO) ([]*models.Role, error)
	GetDefault(ctx context.Context) (*models.Role, error)
}

func (s *RoleService) Get(ctx context.Context, req *models.GetRolesDTO) ([]*models.Role, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get roles. error: %w", err)
	}
	return data, nil
}

func (s *RoleService) GetDefault(ctx context.Context) (*models.Role, error) {
	role, err := s.repo.GetDefault(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get default role. error: %w", err)
	}
	return role, nil
}
