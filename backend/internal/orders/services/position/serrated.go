package position

import (
	"context"
	"errors"
	"fmt"
	"net/url"

	file_models "github.com/Alexander272/new-sealur-pro/internal/files/models"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type PositionSerratedService struct {
	repo  repository.PositionSerrated
	files services.Files
}

func NewPositionSerratedService(repo repository.PositionSerrated, files services.Files) *PositionSerratedService {
	return &PositionSerratedService{
		repo:  repo,
		files: files,
	}
}

type PositionSerrated interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionSerrated, error)
	GetDrawing(ctx context.Context, positionId string) (string, error)
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (s *PositionSerratedService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get serrated positions by order. error: %w", err)
	}
	return data, nil
}

func (s *PositionSerratedService) GetByPosition(ctx context.Context, positionId string) (*models.PositionSerrated, error) {
	data, err := s.repo.GetByPosition(ctx, positionId)
	if err != nil {
		if errors.Is(err, base.ErrNoRows) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get serrated position by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionSerratedService) GetDrawing(ctx context.Context, positionId string) (string, error) {
	drawing, err := s.repo.GetDrawing(ctx, positionId)
	if err != nil {
		if errors.Is(err, base.ErrNoRows) {
			return "", err
		}
		return "", fmt.Errorf("failed to get serrated drawing by position id. error: %w", err)
	}
	return drawing, nil
}

func (s *PositionSerratedService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	drawing, err := s.repo.Copy(ctx, dto)
	if err != nil {
		return fmt.Errorf("failed to copy serrated position. error: %w", err)
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

func (s *PositionSerratedService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	if err := s.repo.CopySeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy several serrated positions. error: %w", err)
	}
	return nil
}

func (s *PositionSerratedService) Create(ctx context.Context, dto *models.PositionDTO) error {
	if dto.SerratedData.Design.Jumper == nil {
		dto.SerratedData.Design.Jumper = &models.PositionSerratedDTO_Jumper{}
	}

	tmp := &models.PositionSerratedDTO{
		PositionId: dto.Id,
		Main:       dto.SerratedData.Main,
		Size:       dto.SerratedData.Size,
		Material:   dto.SerratedData.Material,
		Design:     dto.SerratedData.Design,
	}

	if err := s.repo.Create(ctx, tmp); err != nil {
		return fmt.Errorf("failed to create serrated position. error: %w", err)
	}
	return nil
}

func (s *PositionSerratedService) Update(ctx context.Context, dto *models.PositionDTO) error {
	if dto.SerratedData.Design.Jumper == nil {
		dto.SerratedData.Design.Jumper = &models.PositionSerratedDTO_Jumper{}
	}

	tmp := &models.PositionSerratedDTO{
		PositionId: dto.Id,
		Main:       dto.SerratedData.Main,
		Size:       dto.SerratedData.Size,
		Material:   dto.SerratedData.Material,
		Design:     dto.SerratedData.Design,
	}
	if err := s.repo.Update(ctx, tmp); err != nil {
		return fmt.Errorf("failed to update serrated position. error: %w", err)
	}
	return nil
}
