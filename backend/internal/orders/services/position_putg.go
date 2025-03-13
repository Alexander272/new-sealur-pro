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

type PositionPutgService struct {
	repo  repository.PositionPutg
	files services.Files
}

func NewPositionPutgService(repo repository.PositionPutg, files services.Files) *PositionPutgService {
	return &PositionPutgService{
		repo:  repo,
		files: files,
	}
}

type PositionPutg interface {
	GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
}

func (s *PositionPutgService) GetByPosition(ctx context.Context, positionId string) (*models.PositionPutg, error) {
	data, err := s.repo.GetByPosition(ctx, positionId)
	if err != nil {
		return nil, fmt.Errorf("failed to get position putg by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionPutgService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
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

func (s *PositionPutgService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	if err := s.repo.CopySeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy several positions putg. error: %w", err)
	}
	return nil
}

func (s *PositionPutgService) Create(ctx context.Context, dto *models.PositionDTO) error {
	if dto.PutgData.Size.SizeId != "" {
		dto.PutgData.Size.D4 = ""
		dto.PutgData.Size.D3 = ""
		dto.PutgData.Size.D2 = ""
		dto.PutgData.Size.D1 = ""
	}

	tmp := &models.PositionPutgDTO{
		PositionId: dto.Id,
		Main:       dto.PutgData.Main,
		Size:       dto.PutgData.Size,
		Material:   dto.PutgData.Material,
		Design:     dto.PutgData.Design,
	}
	if err := s.repo.Create(ctx, tmp); err != nil {
		return fmt.Errorf("failed to create position putg. error: %w", err)
	}
	return nil
}

func (s *PositionPutgService) Update(ctx context.Context, dto *models.PositionDTO) error {
	if dto.PutgData.Size.SizeId != "" {
		dto.PutgData.Size.D4 = ""
		dto.PutgData.Size.D3 = ""
		dto.PutgData.Size.D2 = ""
		dto.PutgData.Size.D1 = ""
	}

	tmp := &models.PositionPutgDTO{
		PositionId: dto.Id,
		Main:       dto.PutgData.Main,
		Size:       dto.PutgData.Size,
		Material:   dto.PutgData.Material,
		Design:     dto.PutgData.Design,
	}
	if err := s.repo.Update(ctx, tmp); err != nil {
		return fmt.Errorf("failed to update position putg. error: %w", err)
	}
	return nil
}
