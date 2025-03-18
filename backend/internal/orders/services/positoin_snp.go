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

type PositionSnpService struct {
	repo  repository.PositionSnp
	files services.Files
}

func NewPositionSnpService(repo repository.PositionSnp, files services.Files) *PositionSnpService {
	return &PositionSnpService{
		repo:  repo,
		files: files,
	}
}

type PositionSnp interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionSnp, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	CreateSeveral(ctx context.Context, dto []*models.PositionSnpDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
}

func (s *PositionSnpService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get snp positions by order. error: %w", err)
	}
	return data, nil
}

func (s *PositionSnpService) GetByPosition(ctx context.Context, positionId string) (*models.PositionSnp, error) {
	data, err := s.repo.GetByPosition(ctx, positionId)
	if err != nil {
		return nil, fmt.Errorf("failed to get position snp by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionSnpService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	drawing, err := s.repo.Copy(ctx, dto)
	if err != nil {
		return fmt.Errorf("failed to copy position snp. error: %w", err)
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

func (s *PositionSnpService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	if err := s.repo.CopySeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy several positions snp. error: %w", err)
	}
	return nil
}

func (s *PositionSnpService) Create(ctx context.Context, dto *models.PositionDTO) error {
	if dto.SnpData.Size.SizeId != "" {
		dto.SnpData.Size.D4 = ""
		dto.SnpData.Size.D3 = ""
		dto.SnpData.Size.D2 = ""
		dto.SnpData.Size.D1 = ""
	}

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
	if dto.SnpData.Size.SizeId != "" {
		dto.SnpData.Size.D4 = ""
		dto.SnpData.Size.D3 = ""
		dto.SnpData.Size.D2 = ""
		dto.SnpData.Size.D1 = ""
	}

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
