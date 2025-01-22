package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type BaseConstructionService struct {
	repo repository.BaseConstruction
}

func NewBaseConstructionService(repo repository.BaseConstruction) *BaseConstructionService {
	return &BaseConstructionService{repo: repo}
}

type BaseConstruction interface {
	Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.BaseConstructionDTO) error
	Update(ctx context.Context, dto *models.BaseConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error
}

func (s *BaseConstructionService) Get(ctx context.Context, req *models.GetBaseConstructionDTO) ([]*models.Construction, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base construction. error: %w", err)
	}
	return data, nil
}

func (s *BaseConstructionService) Create(ctx context.Context, dto *models.BaseConstructionDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base construction. error: %w", err)
	}
	return nil
}

func (s *BaseConstructionService) Update(ctx context.Context, dto *models.BaseConstructionDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base construction. error: %w", err)
	}
	return nil
}

func (s *BaseConstructionService) Delete(ctx context.Context, dto *models.DeleteBaseConstructionDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base construction. error: %w", err)
	}
	return nil
}
