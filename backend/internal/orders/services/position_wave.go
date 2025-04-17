package services

import (
	"context"
	"fmt"
	"net/url"

	file_models "github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type PositionWaveService struct {
	repo  repository.PositionWave
	files services.Files
}

func NewPositionWaveService(repo repository.PositionWave, files services.Files) *PositionWaveService {
	return &PositionWaveService{
		repo:  repo,
		files: files,
	}
}

type PositionWave interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionWave, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
}

func (s *PositionWaveService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get wave positions by order. error: %w", err)
	}
	return data, nil
}

func (s *PositionWaveService) GetByPosition(ctx context.Context, positionId string) (*models.PositionWave, error) {
	data, err := s.repo.GetByPosition(ctx, positionId)
	if err != nil {
		return nil, fmt.Errorf("failed to get position wave by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionWaveService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	drawing, err := s.repo.Copy(ctx, dto)
	if err != nil {
		return fmt.Errorf("failed to copy position putg. error: %w", err)
	}

	if drawing == "" {
		return nil
	}

	u, err := url.Parse(drawing)
	if err != nil {
		return fmt.Errorf("failed to parse url. error: %w", err)
	}

	q, err := url.ParseQuery(u.RawQuery)
	if err != nil {
		return fmt.Errorf("failed to parse query. error: %w", err)
	}

	name := q.Get("name")
	file := &file_models.CopyFileDTO{
		Name:    fmt.Sprintf("%s/%s", dto.FromOrderId, name),
		NewName: fmt.Sprintf("%s/%s", dto.OrderId, name),
	}
	if err := s.files.Copy(ctx, file); err != nil {
		return fmt.Errorf("failed to copy file. error: %w", err)
	}
	return nil
}

func (s *PositionWaveService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	if err := s.repo.CopySeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy several positions putg. error: %w", err)
	}
	return nil
}

func (s *PositionWaveService) Create(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionWaveDTO{
		PositionId: dto.Id,
		Main:       dto.WaveData.Main,
		Size:       dto.WaveData.Size,
		Material:   dto.WaveData.Material,
		Design:     dto.WaveData.Design,
	}
	if err := s.repo.Create(ctx, tmp); err != nil {
		return fmt.Errorf("failed to create position putg. error: %w", err)
	}
	return nil
}

func (s *PositionWaveService) Update(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionWaveDTO{
		PositionId: dto.Id,
		Main:       dto.WaveData.Main,
		Size:       dto.WaveData.Size,
		Material:   dto.WaveData.Material,
		Design:     dto.WaveData.Design,
	}
	if err := s.repo.Update(ctx, tmp); err != nil {
		return fmt.Errorf("failed to update position putg. error: %w", err)
	}
	return nil
}
