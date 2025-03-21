package services

import (
	"context"

	mail_models "github.com/Alexander272/new-sealur-pro/internal/mail/models"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/models"
)

type FeedbackService struct {
	mail *mail.Services
}

func NewFeedbackService(mail *mail.Services) *FeedbackService {
	return &FeedbackService{
		mail: mail,
	}
}

type Feedback interface {
	Send(ctx context.Context, dto *models.Feedback) error
}

func (s *FeedbackService) Send(ctx context.Context, dto *models.Feedback) error {
	mail := &mail_models.FeedbackDTO{
		Email:   dto.Email,
		Name:    dto.Name,
		Message: dto.Message,
		Subject: dto.Subject,
	}
	if err := s.mail.Feedback.Send(mail); err != nil {
		return err
	}
	return nil
}
