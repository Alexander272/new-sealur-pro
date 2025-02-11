package services

import (
	"context"
	"errors"
	"fmt"

	base "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type OrderService struct {
	repo     repository.Order
	position Position
}

func NewOrderService(repo repository.Order, position Position) *OrderService {
	return &OrderService{
		repo:     repo,
		position: position,
	}
}

type Order interface {
	GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error)
	GetById(ctx context.Context, req *models.GetOrderDTO) (*models.Order, error)
	Get(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.Order, error)
	Create(ctx context.Context, dto *models.OrderDTO) error
	Save(ctx context.Context, dto *models.SaveOrderDTO) error
	SetInfo(ctx context.Context, dto *models.SetInfoDTO) error
	SetStatus(ctx context.Context, dto *models.SetStatusDTO) error
	SetManager(ctx context.Context, dto *models.SetManagerDTO) error
}

func (s *OrderService) GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error) {
	data, err := s.repo.GetCurrent(ctx, req)
	if err != nil && !errors.Is(err, base.ErrNoRows) {
		return nil, fmt.Errorf("failed to get current order. error: %w", err)
	}
	if data == nil {
		dto := &models.OrderDTO{UserId: req.UserId}
		err := s.Create(ctx, dto)
		if err != nil {
			return nil, err
		}
		data = &models.Order{Id: dto.Id, UserId: req.UserId}
	} else {
		positions, err := s.position.Get(ctx, &models.GetPositionsDTO{OrderId: data.Id})
		if err != nil {
			return nil, err
		}
		data.Positions = positions
	}

	return data, nil
}

func (s *OrderService) GetById(ctx context.Context, req *models.GetOrderDTO) (*models.Order, error) {
	data, err := s.repo.GetById(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get order by id. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) Get(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.Order, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) Create(ctx context.Context, dto *models.OrderDTO) error {
	if err := s.repo.Create(ctx, dto); err != nil {
		return fmt.Errorf("failed to create order. error: %w", err)
	}
	return nil
}

func (s *OrderService) Save(ctx context.Context, dto *models.SaveOrderDTO) error {
	if err := s.repo.Save(ctx, dto); err != nil {
		return fmt.Errorf("failed to save order. error: %w", err)
	}

	//TODO send email to manager

	return nil
}

func (s *OrderService) SetInfo(ctx context.Context, dto *models.SetInfoDTO) error {
	if err := s.repo.SetInfo(ctx, dto); err != nil {
		return fmt.Errorf("failed to set info. error: %w", err)
	}
	return nil
}
func (s *OrderService) SetStatus(ctx context.Context, dto *models.SetStatusDTO) error {
	if err := s.repo.SetStatus(ctx, dto); err != nil {
		return fmt.Errorf("failed to set status. error: %w", err)
	}
	return nil
}
func (s *OrderService) SetManager(ctx context.Context, dto *models.SetManagerDTO) error {
	if err := s.repo.SetManager(ctx, dto); err != nil {
		return fmt.Errorf("failed to set manager. error: %w", err)
	}
	return nil
}
