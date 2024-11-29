package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/snp/models"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
)

type InfoService struct {
	repo repository.Info
}

func NewInfoService(repo repository.Info) *InfoService {
	return &InfoService{
		repo: repo,
	}
}

type Info interface {
	GetByType(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (s *InfoService) GetByType(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error) {
	snp, err := s.repo.GetByType(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp info. error: %w", err)
	}
	return snp, err
}

func (s *InfoService) Create(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create snp info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Update(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update snp info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete snp info. error: %w", err)
	}
	return nil
}
