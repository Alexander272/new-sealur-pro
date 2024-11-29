package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type FillerService struct {
	repo repository.Filler
}

func NewFillerService(repo repository.Filler) *FillerService {
	return &FillerService{
		repo: repo,
	}
}

type Filler interface {
	GetAll(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error)
	Create(ctx context.Context, dto *models.FillerDTO) error
	CreateSeveral(ctx context.Context, dto []*models.FillerDTO) error
	Update(ctx context.Context, dto *models.FillerDTO) error
	Delete(ctx context.Context, dto *models.DeleteFillerDTO) error
}

func (s *FillerService) GetAll(ctx context.Context, req *models.GetFillerDTO) ([]*models.Filler, error) {
	fillers, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp filler new. error: %w", err)
	}
	return fillers, err
}

func (s *FillerService) Create(ctx context.Context, dto *models.FillerDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create snp filler. error: %w", err)
	}
	return nil
}

func (s *FillerService) CreateSeveral(ctx context.Context, dto []*models.FillerDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several snp fillers. error: %w", err)
	}
	return nil
}

func (s *FillerService) Update(ctx context.Context, dto *models.FillerDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update snp filler. error: %w", err)
	}
	return nil
}

func (s *FillerService) Delete(ctx context.Context, dto *models.DeleteFillerDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete snp filler. error: %w", err)
	}
	return nil
}
