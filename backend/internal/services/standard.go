package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type StandardService struct {
	repo repository.Standard
}

func NewStandardService(repo repository.Standard) *StandardService {
	return &StandardService{
		repo: repo,
	}
}

type Standard interface {
	GetAll(ctx context.Context, req *models.GetStandardDTO) ([]*models.Standard, error)
	GetDefault(ctx context.Context) (*models.Standard, error)
	Update(ctx context.Context, dto *models.StandardDTO) error
	Create(ctx context.Context, dto *models.StandardDTO) error
	CreateSeveral(ctx context.Context, dto []*models.StandardDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardDTO) error
}

func (s *StandardService) GetAll(ctx context.Context, req *models.GetStandardDTO) ([]*models.Standard, error) {
	standards, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get standard. error: %w", err)
	}
	return standards, err
}

func (s *StandardService) GetDefault(ctx context.Context) (*models.Standard, error) {
	standard, err := s.repo.GetDefault(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get default standard. error: %w", err)
	}
	return standard, err
}

func (s *StandardService) Create(ctx context.Context, dto *models.StandardDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create standard. error: %w", err)
	}
	return nil
}

func (s *StandardService) CreateSeveral(ctx context.Context, dto []*models.StandardDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several standard standards. error: %w", err)
	}
	return nil
}

func (s *StandardService) Update(ctx context.Context, dto *models.StandardDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update standard standard. error: %w", err)
	}
	return nil
}

func (s *StandardService) Delete(ctx context.Context, dto *models.DeleteStandardDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete standard standard. error: %w", err)
	}
	return nil
}
