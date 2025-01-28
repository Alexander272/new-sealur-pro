package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type PositionSnpService struct {
	repo repository.PositionSnp
}

func NewPositionSnpService(repo repository.PositionSnp) *PositionSnpService {
	return &PositionSnpService{repo: repo}
}

type PositionSnp interface {
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
}

func (s *PositionSnpService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	//TODO надо еще что-то сделать с чертежами
	if err := s.repo.Copy(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy position snp. error: %w", err)
	}
	return nil
}

func (s *PositionSnpService) Create(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionSnpDTO{
		PositionId: dto.Id,
		Main:       dto.SnpData.Main,
		Size:       dto.SnpData.Size,
		Material:   dto.SnpData.Material,
		Design:     dto.SnpData.Design,
	}
	if err := s.repo.Create(ctx, tmp); err != nil {
		return fmt.Errorf("failed to create position snp. error: %w", err)
	}
	return nil
}

func (s *PositionSnpService) CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create positions snp. error: %w", err)
	}
	return nil
}

func (s *PositionSnpService) Update(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionSnpDTO{
		PositionId: dto.Id,
		Main:       dto.SnpData.Main,
		Size:       dto.SnpData.Size,
		Material:   dto.SnpData.Material,
		Design:     dto.SnpData.Design,
	}
	if err := s.repo.Update(ctx, tmp); err != nil {
		return fmt.Errorf("failed to update position snp. error: %w", err)
	}
	return nil
}
