package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type MaterialsService struct {
	repo repository.Materials
}

func NewMaterialsService(repo repository.Materials) *MaterialsService {
	return &MaterialsService{
		repo: repo,
	}
}

type Materials interface {
	Get(ctx context.Context, req *models.GetMaterialDTO) (*models.Materials, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (s *MaterialsService) Get(ctx context.Context, req *models.GetMaterialDTO) (*models.Materials, error) {
	materials, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp material. error: %w", err)
	}
	return materials, err
}

func (s *MaterialsService) Create(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create snp material. error: %w", err)
	}
	return nil
}

func (s *MaterialsService) Update(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update snp material. error: %w", err)
	}
	return nil
}

func (s *MaterialsService) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete snp material. error: %w", err)
	}
	return nil
}
