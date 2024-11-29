package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type FlangeTypeService struct {
	repo repository.FlangeType
}

func NewFlangeTypeService(repo repository.FlangeType) *FlangeTypeService {
	return &FlangeTypeService{
		repo: repo,
	}
}

type FlangeType interface {
	Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error)
	Create(ctx context.Context, dto *models.FlangeTypeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FlangeTypeDTO) error
	Update(ctx context.Context, dto *models.FlangeTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error
}

func (s *FlangeTypeService) Get(ctx context.Context, req *models.GetFlangeTypeDTO) ([]*models.FlangeType, error) {
	flanges, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get flange type snp. error: %w", err)
	}
	return flanges, err
}

func (s *FlangeTypeService) Create(ctx context.Context, dto *models.FlangeTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create flange type snp. error: %w", err)
	}
	return nil
}

func (s *FlangeTypeService) CreateSeveral(ctx context.Context, dto []*models.FlangeTypeDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several flange type snp. error: %w", err)
	}
	return nil
}

func (s *FlangeTypeService) Update(ctx context.Context, dto *models.FlangeTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update flange type snp. error: %w", err)
	}
	return nil
}

func (s *FlangeTypeService) Delete(ctx context.Context, dto *models.DeleteFlangeTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete flange type snp. error: %w", err)
	}
	return nil
}
