package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type TypeService struct {
	repo repository.Type
}

func NewTypeService(repo repository.Type) *TypeService {
	return &TypeService{
		repo: repo,
	}
}

type Type interface {
	GetBase(ctx context.Context, req *models.GetTypeDTO) ([]*models.SnpType, error)
	GroupByFlange(ctx context.Context, req *models.GetTypeDTO) ([]*models.FlangeWithType, error)
	Create(ctx context.Context, dto *models.TypeDTO) error
	CreateSeveral(ctx context.Context, dto []*models.TypeDTO) error
	Update(ctx context.Context, dto *models.TypeDTO) error
	Delete(ctx context.Context, dto *models.DeleteTypeDTO) error
}

func (s *TypeService) GetBase(ctx context.Context, req *models.GetTypeDTO) ([]*models.SnpType, error) {
	types, err := s.repo.GetBase(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp type. error: %w", err)
	}
	return types, err
}

func (s *TypeService) GroupByFlange(ctx context.Context, req *models.GetTypeDTO) ([]*models.FlangeWithType, error) {
	data, err := s.repo.GroupByFlange(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get flange with snp type. error: %w", err)
	}
	return data, err
}

func (s *TypeService) Create(ctx context.Context, dto *models.TypeDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create snp type. error: %w", err)
	}
	return nil
}

func (s *TypeService) CreateSeveral(ctx context.Context, dto []*models.TypeDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several snp types. error: %w", err)
	}
	return nil
}

func (s *TypeService) Update(ctx context.Context, dto *models.TypeDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update snp type. error: %w", err)
	}
	return nil
}

func (s *TypeService) Delete(ctx context.Context, dto *models.DeleteTypeDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete snp type. error: %w", err)
	}
	return nil
}
