package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/repository"
)

type JacketedTypeService struct {
	repo repository.JacketedType
}

func NewJacketedTypeService(repo repository.JacketedType) *JacketedTypeService {
	return &JacketedTypeService{
		repo: repo,
	}
}

type JacketedType interface {
	Get(ctx context.Context, req *models.GetJacketedTypeDTO) ([]*models.JacketedType, error)
	Create(ctx context.Context, dto *models.JacketedTypeDTO) error
	Update(ctx context.Context, dto *models.JacketedTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteJacketedTypeDTO) error
}

func (s *JacketedTypeService) Get(ctx context.Context, req *models.GetJacketedTypeDTO) ([]*models.JacketedType, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base types. error: %w", err)
	}
	return data, nil
}

func (s *JacketedTypeService) Create(ctx context.Context, dto *models.JacketedTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base type. error: %w", err)
	}
	return nil
}

func (s *JacketedTypeService) Update(ctx context.Context, dto *models.JacketedTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base type. error: %w", err)
	}
	return nil
}

func (s *JacketedTypeService) Delete(ctx context.Context, dto *models.DeleteJacketedTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base type. error: %w", err)
	}
	return nil
}
