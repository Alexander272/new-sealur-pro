package services

import (
	"context"
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/analytics/models"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/repository"
)

type OrderService struct {
	repo repository.Order
}

func NewOrderService(repo repository.Order) *OrderService {
	return &OrderService{
		repo: repo,
	}
}

type Order interface {
	GetOrdersStats(ctx context.Context, req *models.GetOrdersStatsDTO) (*models.OrdersStats, error)
	GetGroupedOrdersStats(ctx context.Context, req *models.Period) ([]*models.GroupedOrdersStats, error)
	GetOrdersCount(ctx context.Context, req *models.GetOrdersCountDTO) ([]*models.OrderCount, error)
}

func (s *OrderService) GetOrdersStats(ctx context.Context, req *models.GetOrdersStatsDTO) (*models.OrdersStats, error) {
	data, err := s.repo.GetOrdersStats(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders statistics. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetGroupedOrdersStats(ctx context.Context, req *models.Period) ([]*models.GroupedOrdersStats, error) {
	data, err := s.repo.GetGroupedOrdersStats(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders statistics. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetOrdersCount(ctx context.Context, req *models.GetOrdersCountDTO) ([]*models.OrderCount, error) {
	data, err := s.repo.GetOrdersCount(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders count. error: %w", err)
	}
	return data, nil
}
