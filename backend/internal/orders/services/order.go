package services

import (
	"context"
	"errors"
	"fmt"
	"time"

	mail_models "github.com/Alexander272/new-sealur-pro/internal/mail/models"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	base_models "github.com/Alexander272/new-sealur-pro/internal/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/models"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/export"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/position"
	base "github.com/Alexander272/new-sealur-pro/internal/services"
)

type OrderService struct {
	repo     repository.Order
	mail     *mail.Services
	user     base.User
	position position.Position
	export   export.Export
}

type OrderDeps struct {
	Repo     repository.Order
	Mail     *mail.Services
	User     base.User
	Position position.Position
	Export   export.Export
}

func NewOrderService(deps *OrderDeps) *OrderService {
	return &OrderService{
		repo:     deps.Repo,
		mail:     deps.Mail,
		user:     deps.User,
		position: deps.Position,
		export:   deps.Export,
	}
}

type Order interface {
	GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error)
	GetById(ctx context.Context, req *models.GetOrderDTO) (*models.Order, error)
	Get(ctx context.Context, req *models.GetOrdersByUserDTO) ([]*models.Order, error)
	GetAll(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.OrderWithCompany, error)
	GetByManager(ctx context.Context, req *models.GetOrdersByManagerDTO) ([]*models.OrderWithCompany, error)
	Download(ctx context.Context, req *models.GetOrderDTO) (*models.File, error)
	Copy(ctx context.Context, dto *models.CopyOrderDTO) error
	Create(ctx context.Context, dto *models.OrderDTO) error
	Save(ctx context.Context, dto *models.SaveOrderDTO) error
	SetInfo(ctx context.Context, dto *models.SetInfoDTO) error
	SetStatus(ctx context.Context, dto *models.SetStatusDTO) error
	SetManager(ctx context.Context, dto *models.SetManagerDTO) error
}

func (s *OrderService) GetCurrent(ctx context.Context, req *models.GetCurrentOrderDTO) (*models.Order, error) {
	data, err := s.repo.GetCurrent(ctx, req)
	if err != nil && !errors.Is(err, base_models.ErrNoRows) {
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

	positions, err := s.position.Get(ctx, &models.GetPositionsDTO{OrderId: data.Id})
	if err != nil {
		return nil, err
	}
	data.Positions = positions

	return data, nil
}

func (s *OrderService) Get(ctx context.Context, req *models.GetOrdersByUserDTO) ([]*models.Order, error) {
	data, err := s.repo.Get(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetAll(ctx context.Context, req *models.GetAllOrdersDTO) ([]*models.OrderWithCompany, error) {
	data, err := s.repo.GetAll(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get all orders. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) GetByManager(ctx context.Context, req *models.GetOrdersByManagerDTO) ([]*models.OrderWithCompany, error) {
	data, err := s.repo.GetByManager(ctx, req)
	if err != nil {
		return nil, fmt.Errorf("failed to get orders by manager. error: %w", err)
	}
	return data, nil
}

func (s *OrderService) Download(ctx context.Context, req *models.GetOrderDTO) (*models.File, error) {
	data, err := s.GetById(ctx, req)
	if err != nil {
		return nil, err
	}

	if err := s.SetStatus(ctx, &models.SetStatusDTO{Status: models.StatusWork, OrderId: req.Id}); err != nil {
		return nil, err
	}

	file, err := s.export.Prepare(ctx, data)
	if err != nil {
		return nil, fmt.Errorf("failed to download order. error: %w", err)
	}
	return file, nil
}

func (s *OrderService) Copy(ctx context.Context, dto *models.CopyOrderDTO) error {
	if err := s.position.CopySeveral(ctx, dto.Positions); err != nil {
		return fmt.Errorf("failed to copy order. error: %w", err)
	}
	return nil
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

	user, err := s.user.GetByIdWithManager(ctx, &base_models.GetUserByIdDTO{Id: dto.UserId})
	if err != nil {
		return err
	}

	mail := &mail_models.OrderDTO{
		Recipient: user.ManagerEmail,
		OrderId:   dto.Id,
		Name:      user.Name,
		Position:  user.Position,
		Company:   user.Company,
		Address:   user.Address,
		Email:     user.Email,
		Phone:     user.Phone,
	}
	if err := s.mail.Order.Send(mail); err != nil {
		return err
	}
	return nil
}

func (s *OrderService) SetInfo(ctx context.Context, dto *models.SetInfoDTO) error {
	if err := s.repo.SetInfo(ctx, dto); err != nil {
		return fmt.Errorf("failed to set info. error: %w", err)
	}
	return nil
}
func (s *OrderService) SetStatus(ctx context.Context, dto *models.SetStatusDTO) error {
	dto.Date = time.Now().Unix()
	if err := s.repo.SetStatus(ctx, dto); err != nil {
		return fmt.Errorf("failed to set status. error: %w", err)
	}
	return nil
}
func (s *OrderService) SetManager(ctx context.Context, dto *models.SetManagerDTO) error {
	user, err := s.user.GetByIdWithManager(ctx, &base_models.GetUserByIdDTO{Id: dto.UserId})
	if err != nil {
		return err
	}

	if err := s.repo.SetManager(ctx, dto); err != nil {
		return fmt.Errorf("failed to set manager. error: %w", err)
	}

	mail := &mail_models.RedirectDTO{
		Recipient: dto.ManagerEmail,
		OrderId:   dto.OrderId,
		Manager:   user.Manager,
		Name:      user.Name,
		Position:  user.Position,
		Company:   user.Company,
		Address:   user.Address,
		Email:     user.Email,
		Phone:     user.Phone,
	}
	if err := s.mail.Order.Redirect(mail); err != nil {
		return err
	}
	return nil
}
