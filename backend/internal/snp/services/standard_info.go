package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type StandardInfoService struct {
	repo repository.StandardInfo
}

func NewStandardInfoService(repo repository.StandardInfo) *StandardInfoService {
	return &StandardInfoService{
		repo: repo,
	}
}

type StandardInfo interface {
	GetAll(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error)
	GetDefault(ctx context.Context) (*models.StandardInfo, error)
	Create(ctx context.Context, dto *models.StandardInfoDTO) error
	CreateSeveral(ctx context.Context, dto []*models.StandardInfoDTO) error
	Update(ctx context.Context, dto *models.StandardInfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error
}

func (s *StandardInfoService) GetAll(ctx context.Context, req *models.GetStandardInfoDTO) ([]*models.StandardInfo, error) {
	standards, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp standard. error: %w", err)
	}
	return standards, nil
}

func (s *StandardInfoService) GetDefault(ctx context.Context) (*models.StandardInfo, error) {
	standard, err := s.repo.GetDefault(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to get default snp standard. error: %w", err)
	}
	return standard, nil
}

func (s *StandardInfoService) Create(ctx context.Context, dto *models.StandardInfoDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create snp standard. error: %w", err)
	}
	return nil
}

func (s *StandardInfoService) CreateSeveral(ctx context.Context, dto []*models.StandardInfoDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several snp standards. error: %w", err)
	}
	return nil
}

func (s *StandardInfoService) Update(ctx context.Context, dto *models.StandardInfoDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update snp standard. error: %w", err)
	}
	return nil
}

func (s *StandardInfoService) Delete(ctx context.Context, dto *models.DeleteStandardInfoDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete snp standard. error: %w", err)
	}
	return nil
}
