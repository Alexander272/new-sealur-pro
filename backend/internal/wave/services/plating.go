package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository"
)

type PlatingService struct {
	repo repository.Plating
}

func NewPlatingService(repo repository.Plating) *PlatingService {
	return &PlatingService{
		repo: repo,
	}
}

type Plating interface {
	Get(ctx context.Context, req *models.GetPlatingDTO) ([]*models.Plating, error)
	Create(ctx context.Context, dto *models.PlatingDTO) error
	Update(ctx context.Context, dto *models.PlatingDTO) error
	Delete(ctx context.Context, dto *models.DeletePlatingDTO) error
}

func (s *PlatingService) Get(ctx context.Context, req *models.GetPlatingDTO) ([]*models.Plating, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get platings. error: %w", err)
	}
	return data, nil
}

func (s *PlatingService) Create(ctx context.Context, dto *models.PlatingDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create plating. error: %w", err)
	}
	return nil
}

func (s *PlatingService) Update(ctx context.Context, dto *models.PlatingDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update plating. error: %w", err)
	}
	return nil
}

func (s *PlatingService) Delete(ctx context.Context, dto *models.DeletePlatingDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete plating. error: %w", err)
	}
	return nil
}
