package services

import (
	"context"
	"errors"
	"fmt"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type PositionService struct {
	repo repository.Position
	snp  PositionSnp
}

func NewPositionService(repo repository.Position, snp PositionSnp) *PositionService {
	return &PositionService{
		repo: repo,
		snp:  snp,
	}
}

type Position interface {
	Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error)
	GetById(ctx context.Context, id string) (*models.PositionDTO, error)
	GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error)
	Copy(ctx context.Context, dto *models.CopyPositionDTO) error
	Create(ctx context.Context, dto *models.PositionDTO) error
	Update(ctx context.Context, dto *models.PositionDTO) error
	Delete(ctx context.Context, dto *models.DeletePositionDTO) error
}

func (s *PositionService) Get(ctx context.Context, req *models.GetPositionsDTO) ([]*models.Position, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get positions. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) GetById(ctx context.Context, id string) (*models.PositionDTO, error) {
	data, err := s.repo.GetById(ctx, id)
	if err != nil {
		return nil, fmt.Errorf("failed to get position by id. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) GetIdByTitle(ctx context.Context, req *models.GetPositionByTitle) (string, error) {
	data, err := s.repo.GetIdByTitle(ctx, req)
	if err != nil && !errors.Is(err, base.ErrNoRows) {
		return "", fmt.Errorf("failed to get position id by title. error: %w", err)
	}
	return data, nil
}

func (s *PositionService) Copy(ctx context.Context, dto *models.CopyPositionDTO) error {
	pos, err := s.repo.GetById(ctx, dto.Id)
	if err != nil {
		return fmt.Errorf("failed to get position. error: %w", err)
	}

	candidate, err := s.GetIdByTitle(ctx, &models.GetPositionByTitle{Title: pos.Title, OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if candidate != "" {
		return base.ErrPositionExists
	}

	pos.Count = dto.Count
	pos.OrderId = dto.OrderId
	if dto.Amount != "" {
		pos.Amount = dto.Amount
	}
	// Поскольку я для проверки получаю позицию я могу просто создать новую заменив данные
	if err := s.repo.Create(ctx, pos); err != nil {
		return fmt.Errorf("failed to create position. error: %w", err)
	}

	// if err := s.repo.Copy(ctx, dto); err != nil {
	// 	return fmt.Errorf("failed to copy position. error: %w", err)
	// }

	if pos.Type == models.PositionTypeSnp {
		err = s.snp.Copy(ctx, dto)
	}
	if err != nil {
		return err
	}

	return nil
}

func (s *PositionService) Create(ctx context.Context, dto *models.PositionDTO) error {
	candidate, err := s.GetIdByTitle(ctx, &models.GetPositionByTitle{Title: dto.Title, OrderId: dto.OrderId})
	if err != nil {
		return err
	}
	if candidate != "" {
		return base.ErrPositionExists
	}

	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create position. error: %w", err)
	}

	if dto.Type == models.PositionTypeSnp {
		err = s.snp.Create(ctx, dto)
	}
	if err != nil {
		return err
	}
	return nil
}

func (s *PositionService) CreateSeveral(ctx context.Context, dto []*models.PositionDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create positions. error: %w", err)
	}
	return fmt.Errorf("not implemented")
}

func (s *PositionService) Update(ctx context.Context, dto *models.PositionDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update position. error: %w", err)
	}
	if dto.Type == models.PositionTypeSnp {
		if err := s.snp.Update(ctx, dto); err != nil {
			return err
		}
	}
	return nil
}

func (s *PositionService) Delete(ctx context.Context, dto *models.DeletePositionDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete position. error: %w", err)
	}
	return nil
}
