package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type FillerService struct {
	repo repository.Filler
}

func NewFillerService(repo repository.Filler) *FillerService {
	return &FillerService{repo: repo}
}

type Filler interface {
	Get(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error)
	Create(ctx context.Context, dto *models.FillerDTO) error
	Update(ctx context.Context, dto *models.FillerDTO) error
	Delete(ctx context.Context, dto *models.DeleteFillerDTO) error
}

func (s *FillerService) Get(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get fillers. error: %w", err)
	}
	return data, nil
}

func (s *FillerService) Create(ctx context.Context, dto *models.FillerDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create filler. error: %w", err)
	}
	return nil
}

func (s *FillerService) Update(ctx context.Context, dto *models.FillerDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update filler. error: %w", err)
	}
	return nil
}

func (s *FillerService) Delete(ctx context.Context, dto *models.DeleteFillerDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete filler. error: %w", err)
	}
	return nil
}
