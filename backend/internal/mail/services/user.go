package services

import (
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/mail/constants"
	"github.com/Alexander272/new-sealur-pro/internal/mail/models"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp"
)

type UserService struct {
	mailer smtp.Mailer
	emails config.EmailsConfig
}

func NewUserService(mailer smtp.Mailer, emails config.EmailsConfig) *UserService {
	return &UserService{
		mailer: mailer,
		emails: emails,
	}
}

type User interface {
	Confirm(dto *models.ConfirmDTO) error
	Recovery(dto *models.RecoveryDTO) error
}

func (s *UserService) Confirm(dto *models.ConfirmDTO) error {
	dto.Support = s.emails.Support
	mail := &smtp.SendDTO{
		Recipients: []string{dto.Email},
		Template:   constants.ConfirmTemplate,
		Data:       dto,
	}

	if err := s.mailer.Send(mail); err != nil {
		return fmt.Errorf("failed to send feedback. error: %w", err)
	}
	return nil
}

func (s *UserService) Recovery(dto *models.RecoveryDTO) error {
	dto.Support = s.emails.Support
	mail := &smtp.SendDTO{
		Recipients: []string{dto.Email},
		Template:   constants.RecoveryTemplate,
		Data:       dto,
	}

	if err := s.mailer.Send(mail); err != nil {
		return fmt.Errorf("failed to send feedback. error: %w", err)
	}
	return nil
}
