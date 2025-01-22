package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type SizeService struct {
	repo repository.Size
}

func NewSizeService(repo repository.Size) *SizeService {
	return &SizeService{repo: repo}
}

type Size interface {
	Get(ctx context.Context, req *models.GetGroupedSizeDTO) ([]*models.GroupedSize, error)
	Create(ctx context.Context, dto *models.SizeDTO) error
	Update(ctx context.Context, dto *models.SizeDTO) error
	Delete(ctx context.Context, dto *models.DeleteSizeDTO) error
}

func (s *SizeService) Get(ctx context.Context, req *models.GetGroupedSizeDTO) ([]*models.GroupedSize, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get sizes. error: %w", err)
	}
	return data, nil
}

func (s *SizeService) Create(ctx context.Context, dto *models.SizeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create size. error: %w", err)
	}
	return nil
}

func (s *SizeService) Update(ctx context.Context, dto *models.SizeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update size. error: %w", err)
	}
	return nil
}

func (s *SizeService) Delete(ctx context.Context, dto *models.DeleteSizeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete size. error: %w", err)
	}
	return nil
}
