package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type FlangeStandardService struct {
	repo repository.FlangeStandard
}

func NewFlangeStandardService(repo repository.FlangeStandard) *FlangeStandardService {
	return &FlangeStandardService{
		repo: repo,
	}
}

type FlangeStandard interface {
	GetAll(ctx context.Context, req *models.GetFlangeStandardDTO) ([]*models.FlangeStandard, error)
	Create(ctx context.Context, dto *models.FlangeStandardDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FlangeStandardDTO) error
	Update(ctx context.Context, dto *models.FlangeStandardDTO) error
	Delete(ctx context.Context, dto *models.DeleteFlangeStandardDTO) error
}

func (s *FlangeStandardService) GetAll(ctx context.Context, req *models.GetFlangeStandardDTO) ([]*models.FlangeStandard, error) {
	flanges, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get flange standard. error: %w", err)
	}
	return flanges, err
}

func (s *FlangeStandardService) Create(ctx context.Context, dto *models.FlangeStandardDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create flange standard. error: %w", err)
	}
	return nil
}

func (s *FlangeStandardService) CreateSeveral(ctx context.Context, dto []*models.FlangeStandardDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several flange standards. error: %w", err)
	}
	return nil
}

func (s *FlangeStandardService) Update(ctx context.Context, dto *models.FlangeStandardDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update flange standard. error: %w", err)
	}
	return nil
}

func (s *FlangeStandardService) Delete(ctx context.Context, dto *models.DeleteFlangeStandardDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete flange standard. error: %w", err)
	}
	return nil
}
