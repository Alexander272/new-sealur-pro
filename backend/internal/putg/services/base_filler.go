package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type BaseFillerService struct {
	repo repository.BaseFiller
}

func NewBaseFillerService(repo repository.BaseFiller) *BaseFillerService {
	return &BaseFillerService{repo: repo}
}

type BaseFiller interface {
	Get(ctx context.Context, req *models.GetBaseFillerDTO) ([]*models.BaseFiller, error)
	Create(ctx context.Context, dto *models.BaseFillerDTO) error
	Update(ctx context.Context, dto *models.BaseFillerDTO) error
	Delete(ctx context.Context, dto *models.DeleteBaseFillerDTO) error
}

func (s *BaseFillerService) Get(ctx context.Context, req *models.GetBaseFillerDTO) ([]*models.BaseFiller, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base filler. error: %w", err)
	}
	return data, nil
}

func (s *BaseFillerService) Create(ctx context.Context, dto *models.BaseFillerDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base filler. error: %w", err)
	}
	return nil
}

func (s *BaseFillerService) Update(ctx context.Context, dto *models.BaseFillerDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base filler. error: %w", err)
	}
	return nil
}

func (s *BaseFillerService) Delete(ctx context.Context, dto *models.DeleteBaseFillerDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base filler. error: %w", err)
	}
	return nil
}
