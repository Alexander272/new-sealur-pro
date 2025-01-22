package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/putg/models"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
)

type ConfigurationService struct {
	repo repository.Configuration
}

func NewConfigurationService(repo repository.Configuration) *ConfigurationService {
	return &ConfigurationService{repo: repo}
}

type Configuration interface {
	Get(ctx context.Context, req *models.GetConfigurationDTO) ([]*models.Configuration, error)
	Create(ctx context.Context, dto *models.ConfigurationDTO) error
	Update(ctx context.Context, dto *models.ConfigurationDTO) error
	Delete(ctx context.Context, dto *models.DeleteConfigurationDTO) error
}

func (s *ConfigurationService) Get(ctx context.Context, req *models.GetConfigurationDTO) ([]*models.Configuration, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get configurations. error: %w", err)
	}
	return data, nil
}

func (s *ConfigurationService) Create(ctx context.Context, dto *models.ConfigurationDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create configuration. error: %w", err)
	}
	return nil
}

func (s *ConfigurationService) Update(ctx context.Context, dto *models.ConfigurationDTO) error {
	if err := s.repo.Update(ctx, dto); err != nil {
		return fmt.Errorf("failed to update configuration. error: %w", err)
	}
	return nil
}

func (s *ConfigurationService) Delete(ctx context.Context, dto *models.DeleteConfigurationDTO) error {
	if err := s.repo.Delete(ctx, dto); err != nil {
		return fmt.Errorf("failed to delete configuration. error: %w", err)
	}
	return nil
}
