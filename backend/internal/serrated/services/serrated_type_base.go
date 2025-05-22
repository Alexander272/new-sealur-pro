package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository"
)

type SerratedTypeBaseService struct {
	repo repository.SerratedTypeBase
}

func NewSerratedTypeBaseService(repo repository.SerratedTypeBase) *SerratedTypeBaseService {
	return &SerratedTypeBaseService{
		repo: repo,
	}
}

type SerratedTypeBase interface {
	Get(ctx context.Context, req *models.GetSerratedTypeBaseDTO) ([]*models.SerratedTypeBase, error)
	Create(ctx context.Context, dto *models.SerratedTypeBaseDTO) error
	Update(ctx context.Context, dto *models.SerratedTypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteSerratedTypeBaseDTO) error
}

func (s *SerratedTypeBaseService) Get(ctx context.Context, req *models.GetSerratedTypeBaseDTO) ([]*models.SerratedTypeBase, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base wave types. error: %w", err)
	}
	return data, nil
}

func (s *SerratedTypeBaseService) Create(ctx context.Context, dto *models.SerratedTypeBaseDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base wave type. error: %w", err)
	}
	return nil
}

func (s *SerratedTypeBaseService) Update(ctx context.Context, dto *models.SerratedTypeBaseDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base wave type. error: %w", err)
	}
	return nil
}

func (s *SerratedTypeBaseService) Delete(ctx context.Context, dto *models.DeleteSerratedTypeBaseDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base wave type. error: %w", err)
	}
	return nil
}
