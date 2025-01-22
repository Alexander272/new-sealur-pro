package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type MaterialService struct {
	repo repository.Material
}

func NewMaterialService(repo repository.Material) *MaterialService {
	return &MaterialService{repo: repo}
}

type Material interface {
	Get(ctx context.Context, req *models.GetMaterialsDTO) (*models.Materials, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (s *MaterialService) Get(ctx context.Context, req *models.GetMaterialsDTO) (*models.Materials, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get materials. error: %w", err)
	}
	return data, nil
}

func (s *MaterialService) Create(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create material. error: %w", err)
	}
	return nil
}

func (s *MaterialService) Update(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update material. error: %w", err)
	}
	return nil
}

func (s *MaterialService) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete material. error: %w", err)
	}
	return nil
}
