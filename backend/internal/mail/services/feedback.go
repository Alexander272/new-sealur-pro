package services

import (
	"fmt"

	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/mail/constants"
	"github.com/Alexander272/new-sealur-pro/internal/mail/models"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp"
)

type FeedbackService struct {
	mailer smtp.Mailer
	emails config.EmailsConfig
}

func NewFeedbackService(mailer smtp.Mailer, emails config.EmailsConfig) *FeedbackService {
	return &FeedbackService{
		mailer: mailer,
		emails: emails,
	}
}

type Feedback interface {
	Send(dto *models.FeedbackDTO) error
}

func (s *FeedbackService) Send(dto *models.FeedbackDTO) error {
	mail := &smtp.SendDTO{
		Recipients: []string{s.emails.Feedback},
		ReplyTo:    dto.Email,
		Template:   constants.FeedbackTemplate,
		Data:       dto,
		// Subject:    dto.Subject,
	}

	if err := s.mailer.Send(mail); err != nil {
		return fmt.Errorf("failed to send feedback. error: %w", err)
	}
	return nil
}
