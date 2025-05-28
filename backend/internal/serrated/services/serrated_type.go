package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository"
)

type SerratedTypeService struct {
	repo repository.SerratedType
}

func NewSerratedTypeService(repo repository.SerratedType) *SerratedTypeService {
	return &SerratedTypeService{
		repo: repo,
	}
}

type SerratedType interface {
	Get(ctx context.Context, req *models.GetSerratedTypesDTO) ([]*models.SerratedType, error)
	Create(ctx context.Context, dto *models.SerratedTypeDTO) error
	Update(ctx context.Context, dto *models.SerratedTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSerratedTypeDTO) error
}

func (s *SerratedTypeService) Get(ctx context.Context, req *models.GetSerratedTypesDTO) ([]*models.SerratedType, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get serrated types. error: %w", err)
	}
	return data, nil
}

func (s *SerratedTypeService) Create(ctx context.Context, dto *models.SerratedTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create serrated type. error: %w", err)
	}
	return nil
}

func (s *SerratedTypeService) Update(ctx context.Context, dto *models.SerratedTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update serrated type. error: %w", err)
	}
	return nil
}

func (s *SerratedTypeService) Delete(ctx context.Context, dto *models.DeleteSerratedTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete serrated type. error: %w", err)
	}
	return nil
}
