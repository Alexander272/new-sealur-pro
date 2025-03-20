package services

import (
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/mail/constants"
	"github.com/Alexander272/new-sealur-pro/internal/mail/models"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp"
)

type OrderService struct {
	mailer smtp.Mailer
	links  config.LinksConfig
}

func NewOrderService(mailer smtp.Mailer, links config.LinksConfig) *OrderService {
	return &OrderService{
		mailer: mailer,
		links:  links,
	}
}

type Order interface {
	Send(dto *models.OrderDTO) error
	Redirect(dto *models.RedirectDTO) error
}

func (s *OrderService) Send(dto *models.OrderDTO) error {
	dto.Link = fmt.Sprintf("%s/%s?action=save", s.links.Orders, dto.OrderId)
	mail := &smtp.SendDTO{
		Recipients: []string{dto.Recipient},
		Template:   constants.OrderTemplate,
		Data:       dto,
	}

	// if err := s.mailer.Send(mail); err != nil {
	// 	return fmt.Errorf("failed to send feedback. error: %w", err)
	// }
	s.mailer.AsyncSend(mail)
	return nil
}

func (s *OrderService) Redirect(dto *models.RedirectDTO) error {
	dto.Link = fmt.Sprintf("%s/%s?action=save", s.links.Orders, dto.OrderId)
	mail := &smtp.SendDTO{
		Recipients: []string{dto.Recipient},
		Template:   constants.RedirectOrderTemplate,
		Data:       dto,
	}

	if err := s.mailer.Send(mail); err != nil {
		return fmt.Errorf("failed to send redirect order. error: %w", err)
	}
	return nil
}
