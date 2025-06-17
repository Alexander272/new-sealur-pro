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

type PositionJacketedService struct {
	repo  repository.PositionJacketed
	files services.Files
}

func NewPositionJacketedService(repo repository.PositionJacketed, files services.Files) *PositionJacketedService {
	return &PositionJacketedService{
		repo:  repo,
		files: files,
	}
}

type PositionJacketed interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetByPosition(ctx context.Context, positionId string) (*models.PositionJacketed, error)
	GetDrawing(ctx context.Context, positionId string) (string, error)
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error
}

func (s *PositionJacketedService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get jacketed positions. error: %w", err)
	}
	return data, nil
}

func (s *PositionJacketedService) GetByPosition(ctx context.Context, positionId string) (*models.PositionJacketed, error) {
	data, err := s.repo.GetByPosition(ctx, positionId)
	if err != nil {
		if errors.Is(err, base.ErrNoRows) {
			return nil, err
		}
		return nil, fmt.Errorf("failed to get jacketed position by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionJacketedService) GetDrawing(ctx context.Context, positionId string) (string, error) {
	data, err := s.repo.GetDrawing(ctx, positionId)
	if err != nil {
		if errors.Is(err, base.ErrNoRows) {
			return "", err
		}
		return "", fmt.Errorf("failed to get jacketed drawing by position id. error: %w", err)
	}
	return data, nil
}

func (s *PositionJacketedService) Create(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionJacketedDTO{
		PositionId: dto.Id,
		Main:       dto.JacketedData.Main,
		Size:       dto.JacketedData.Size,
		Material:   dto.JacketedData.Material,
		Design:     dto.JacketedData.Design,
	}

	if err := s.repo.Create(ctx, tmp); err != nil {
		return fmt.Errorf("failed to create jacketed position. error: %w", err)
	}
	return nil
}

func (s *PositionJacketedService) Update(ctx context.Context, dto *models.PositionDTO) error {
	tmp := &models.PositionJacketedDTO{
		PositionId: dto.Id,
		Main:       dto.JacketedData.Main,
		Size:       dto.JacketedData.Size,
		Material:   dto.JacketedData.Material,
		Design:     dto.JacketedData.Design,
	}

	if err := s.repo.Update(ctx, tmp); err != nil {
		return fmt.Errorf("failed to update jacketed position. error: %w", err)
	}
	return nil
}

func (s *PositionJacketedService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
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

func (s *PositionJacketedService) CopySeveral(ctx context.Context, dto []*models.CopyPositionDTO) error {
	if err := s.repo.CopySeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to copy several jacketed positions. error: %w", err)
	}
	return nil
}
