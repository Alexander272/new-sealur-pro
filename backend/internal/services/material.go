package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type MaterialsService struct {
	repo repository.Material
}

func NewMaterialsService(repo repository.Material) *MaterialsService {
	return &MaterialsService{
		repo: repo,
	}
}

type Materials interface {
	GetAll(ctx context.Context, req *models.GetMaterialDTO) ([]*models.Material, error)
	Create(ctx context.Context, dto *models.MaterialDTO) error
	CreateSeveral(ctx context.Context, dto []*models.MaterialDTO) error
	Update(ctx context.Context, dto *models.MaterialDTO) error
	Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error
}

func (s *MaterialsService) GetAll(ctx context.Context, req *models.GetMaterialDTO) ([]*models.Material, error) {
	materials, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get material. error: %w", err)
	}
	return materials, err
}

func (s *MaterialsService) Create(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create material. error: %w", err)
	}
	return nil
}

func (s *MaterialsService) CreateSeveral(ctx context.Context, dto []*models.MaterialDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several materials. error: %w", err)
	}
	return nil
}

func (s *MaterialsService) Update(ctx context.Context, dto *models.MaterialDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update material. error: %w", err)
	}
	return nil
}

func (s *MaterialsService) Delete(ctx context.Context, dto *models.DeleteMaterialDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete material. error: %w", err)
	}
	return nil
}
