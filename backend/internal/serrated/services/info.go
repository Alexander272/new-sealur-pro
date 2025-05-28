package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/serrated/models"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository"
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
	Get(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error)
	Create(ctx context.Context, dto *models.InfoDTO) error
	Update(ctx context.Context, dto *models.InfoDTO) error
	Delete(ctx context.Context, dto *models.DeleteInfoDTO) error
}

func (s *InfoService) Get(ctx context.Context, req *models.GetInfoDTO) (*models.Info, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		// if errors.Is(err, base.ErrNoRows) {
		// 	return nil, err
		// }
		return nil, fmt.Errorf("failed to get serrated info. error: %w", err)
	}
	return data, nil
}

func (s *InfoService) Create(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create serrated info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Update(ctx context.Context, dto *models.InfoDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update serrated info. error: %w", err)
	}
	return nil
}

func (s *InfoService) Delete(ctx context.Context, dto *models.DeleteInfoDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete serrated info. error: %w", err)
	}
	return nil
}
