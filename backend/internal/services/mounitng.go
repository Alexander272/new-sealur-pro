package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type MountingService struct {
	repo repository.Mounting
}

func NewMountingService(repo repository.Mounting) *MountingService {
	return &MountingService{
		repo: repo,
	}
}

type Mounting interface {
	GetAll(ctx context.Context, req *models.GetMountingDTO) ([]*models.Mounting, error)
	Create(ctx context.Context, dto *models.MountingDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MountingDTO) error
	Update(ctx context.Context, dto *models.MountingDTO) error
	Delete(ctx context.Context, dto *models.DeleteMountingDTO) error
}

func (s *MountingService) GetAll(ctx context.Context, req *models.GetMountingDTO) ([]*models.Mounting, error) {
	mounting, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get mounting. error: %w", err)
	}
	return mounting, err
}

func (s *MountingService) Create(ctx context.Context, dto *models.MountingDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create mounting. error: %w", err)
	}
	return nil
}

func (s *MountingService) CreateSeveral(ctx context.Context, dto []*models.MountingDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several mountings. error: %w", err)
	}
	return nil
}

func (s *MountingService) Update(ctx context.Context, dto *models.MountingDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update mounting. error: %w", err)
	}
	return nil
}

func (s *MountingService) Delete(ctx context.Context, dto *models.DeleteMountingDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete mounting. error: %w", err)
	}
	return nil
}
