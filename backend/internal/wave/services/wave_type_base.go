package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository"
)

type WaveTypeBaseService struct {
	repo repository.WaveTypeBase
}

func NewWaveTypeBaseService(repo repository.WaveTypeBase) *WaveTypeBaseService {
	return &WaveTypeBaseService{
		repo: repo,
	}
}

type WaveTypeBase interface {
	Get(ctx context.Context, req *models.GetWaveTypeBaseDTO) ([]*models.WaveTypeBase, error)
	Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error
	Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteWaveTypeBaseDTO) error
}

func (s *WaveTypeBaseService) Get(ctx context.Context, req *models.GetWaveTypeBaseDTO) ([]*models.WaveTypeBase, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base wave types. error: %w", err)
	}
	return data, nil
}

func (s *WaveTypeBaseService) Create(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base wave type. error: %w", err)
	}
	return nil
}

func (s *WaveTypeBaseService) Update(ctx context.Context, dto *models.WaveTypeBaseDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base wave type. error: %w", err)
	}
	return nil
}

func (s *WaveTypeBaseService) Delete(ctx context.Context, dto *models.DeleteWaveTypeBaseDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base wave type. error: %w", err)
	}
	return nil
}
