package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/repository"
)

type TemperatureService struct {
	repo repository.Temperature
}

func NewTemperatureService(repo repository.Temperature) *TemperatureService {
	return &TemperatureService{
		repo: repo,
	}
}

type Temperature interface {
	GetAll(ctx context.Context, req *models.GetTemperatureDTO) ([]*models.Temperature, error)
	Create(ctx context.Context, dto *models.TemperatureDTO) error
	Update(ctx context.Context, dto *models.TemperatureDTO) error
	Delete(ctx context.Context, dto *models.DeleteTemperatureDTO) error
}

func (s *TemperatureService) GetAll(ctx context.Context, req *models.GetTemperatureDTO) ([]*models.Temperature, error) {
	temperatures, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get temperature. error: %w", err)
	}
	return temperatures, err
}

func (s *TemperatureService) Create(ctx context.Context, dto *models.TemperatureDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create temperature. error: %w", err)
	}
	return nil
}

func (s *TemperatureService) CreateSeveral(ctx context.Context, dto []*models.TemperatureDTO) error {
	if err := s.repo.CreateSeveral(ctx, dto); err != nil {
		return fmt.Errorf("failed to create several temperatures. error: %w", err)
	}
	return nil
}

func (s *TemperatureService) Update(ctx context.Context, dto *models.TemperatureDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update temperature. error: %w", err)
	}
	return nil
}

func (s *TemperatureService) Delete(ctx context.Context, dto *models.DeleteTemperatureDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete temperature. error: %w", err)
	}
	return nil
}
