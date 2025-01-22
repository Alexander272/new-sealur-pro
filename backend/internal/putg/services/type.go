package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type TypeService struct {
	repo repository.PutgType
}

func NewTypeService(repo repository.PutgType) *TypeService {
	return &TypeService{repo: repo}
}

type Type interface {
	Get(ctx context.Context, req *models.GetTypeDTO) ([]*models.PutgType, error)
	Create(ctx context.Context, dto *models.PutgTypeDTO) error
	Update(ctx context.Context, dto *models.PutgTypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeDTO) error
}

func (s *TypeService) Get(ctx context.Context, req *models.GetTypeDTO) ([]*models.PutgType, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get types. error: %w", err)
	}
	return data, nil
}

func (s *TypeService) Create(ctx context.Context, dto *models.PutgTypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create type. error: %w", err)
	}
	return nil
}

func (s *TypeService) Update(ctx context.Context, dto *models.PutgTypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update type. error: %w", err)
	}
	return nil
}

func (s *TypeService) Delete(ctx context.Context, dto *models.DeleteTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete type. error: %w", err)
	}
	return nil
}
