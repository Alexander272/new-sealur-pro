package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/jacketed/models"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/repository"
)

type JacketedBaseTypeService struct {
	repo repository.JacketedBaseType
}

func NewJacketedBaseTypeService(repo repository.JacketedBaseType) *JacketedBaseTypeService {
	return &JacketedBaseTypeService{
		repo: repo,
	}
}

type JacketedBaseType interface {
	Get(ctx context.Context, req *models.GetTypeBaseDTO) ([]*models.TypeBase, error)
	Create(ctx context.Context, dto *models.TypeBaseDTO) error
	Update(ctx context.Context, dto *models.TypeBaseDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeBaseDTO) error
}

func (s *JacketedBaseTypeService) Get(ctx context.Context, req *models.GetTypeBaseDTO) ([]*models.TypeBase, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get base types. error: %w", err)
	}
	return data, nil
}

func (s *JacketedBaseTypeService) Create(ctx context.Context, dto *models.TypeBaseDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create base type. error: %w", err)
	}
	return nil
}

func (s *JacketedBaseTypeService) Update(ctx context.Context, dto *models.TypeBaseDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update base type. error: %w", err)
	}
	return nil
}

func (s *JacketedBaseTypeService) Delete(ctx context.Context, dto *models.DeleteTypeBaseDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete base type. error: %w", err)
	}
	return nil
}
