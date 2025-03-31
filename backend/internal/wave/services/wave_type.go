package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/wave/models"
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository"
)

type WaveTypeService struct {
	repo repository.WaveType
}

func NewWaveTypeService(repo repository.WaveType) *WaveTypeService {
	return &WaveTypeService{
		repo: repo,
	}
}

type WaveType interface {
	Get(ctx context.Context, req *models.GetWaveTypesDTO) ([]*models.WaveType, error)
	Create(ctx context.Context, dto *models.WaveTypeDTO) error
	Update(ctx context.Context, dto *models.WaveTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteWaveTypeDTO) error
}

func (s *WaveTypeService) Get(ctx context.Context, req *models.GetWaveTypesDTO) ([]*models.WaveType, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get wave types. error: %w", err)
	}
	return data, nil
}

func (s *WaveTypeService) Create(ctx context.Context, dto *models.WaveTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create wave type. error: %w", err)
	}
	return nil
}

func (s *WaveTypeService) Update(ctx context.Context, dto *models.WaveTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update wave type. error: %w", err)
	}
	return nil
}

func (s *WaveTypeService) Delete(ctx context.Context, dto *models.DeleteWaveTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete wave type. error: %w", err)
	}
	return nil
}
