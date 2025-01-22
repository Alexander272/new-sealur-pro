package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type FlangeTypeService struct {
	repo repository.FlangeType
}

func NewFlangeTypeService(repo repository.FlangeType) *FlangeTypeService {
	return &FlangeTypeService{repo: repo}
}

type FlangeType interface {
	Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error)
	Create(ctx context.Context, dto *models.FlangeTypeDTO) error
	Update(ctx context.Context, dto *models.FlangeTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error
}

func (s *FlangeTypeService) Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get flange types. error: %w", err)
	}
	return data, nil
}

func (s *FlangeTypeService) Create(ctx context.Context, dto *models.FlangeTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create flange type. error: %w", err)
	}
	return nil
}

func (s *FlangeTypeService) Update(ctx context.Context, dto *models.FlangeTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update flange type. error: %w", err)
	}
	return nil
}

func (s *FlangeTypeService) Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete flange type. error: %w", err)
	}
	return nil
}
