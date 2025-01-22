package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type StandardInfoService struct {
	repo repository.StandardInfo
}

func NewStandardInfoService(repo repository.StandardInfo) *StandardInfoService {
	return &StandardInfoService{repo: repo}
}

type StandardInfo interface {
	Get(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error)
	Create(ctx context.Context, dto *models.StandardInfoDTO) error
	Update(ctx context.Context, dto *models.StandardInfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error
}

func (s *StandardInfoService) Get(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get standard info. error: %w", err)
	}
	return data, nil
}

func (s *StandardInfoService) Create(ctx context.Context, dto *models.StandardInfoDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create standard info. error: %w", err)
	}
	return nil
}

func (s *StandardInfoService) Update(ctx context.Context, dto *models.StandardInfoDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update standard info. error: %w", err)
	}
	return nil
}

func (s *StandardInfoService) Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete standard info. error: %w", err)
	}
	return nil
}
