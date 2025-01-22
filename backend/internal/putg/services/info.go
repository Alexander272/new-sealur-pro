package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type InfoService struct {
	repo repository.Info
}

func NewInfoService(repo repository.Info) *InfoService {
	return &InfoService{repo: repo}
}

type Info interface {
	GetByFiller(ctx context.Context, req *models.GetInfoByFillerDTO) (*models.Info, error)
	GetByConstruction(ctx context.Context, req *models.GetInfoByConstructionDTO) ([]*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (s *InfoService) GetByFiller(ctx context.Context, req *models.GetInfoByFillerDTO) (*models.Info, error) {
	data, err := s.repo.GetByFiller(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get info by filler. error: %w", err)
	}
	return data, nil
}

func (s *InfoService) GetByConstruction(ctx context.Context, req *models.GetInfoByConstructionDTO) ([]*models.Info, error) {
	data, err := s.repo.GetByConstruction(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get info by construction. error: %w", err)
	}
	return data, nil
}

func (s *InfoService) Create(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Update(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete info. error: %w", err)
	}
	return nil
}
