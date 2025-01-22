package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type ConstructionService struct {
	repo repository.Construction
}

func NewConstructionService(repo repository.Construction) *ConstructionService {
	return &ConstructionService{repo: repo}
}

type Construction interface {
	Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error)
	Create(ctx context.Context, dto *models.ConstructionDTO) error
	Update(ctx context.Context, dto *models.ConstructionDTO) error
	Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error
}

func (s *ConstructionService) Get(ctx context.Context, req *models.GetConstructionDTO) ([]*models.Construction, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get construction. error: %w", err)
	}
	return data, nil
}

func (s *ConstructionService) Create(ctx context.Context, dto *models.ConstructionDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create construction. error: %w", err)
	}
	return nil
}

func (s *ConstructionService) Update(ctx context.Context, dto *models.ConstructionDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update construction. error: %w", err)
	}
	return nil
}

func (s *ConstructionService) Delete(ctx context.Context, dto *models.DeleteConstructionDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete construction. error: %w", err)
	}
	return nil
}
