package services

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp"
)

type Services struct {
	Feedback
	User
	Order
}

type Deps struct {
	Mailer smtp.Mailer
	Emails config.EmailsConfig
	Links  config.LinksConfig
}

func NewServices(deps *Deps) *Services {
	feedback := NewFeedbackService(deps.Mailer, deps.Emails)
	user := NewUserService(deps.Mailer, deps.Emails)
	order := NewOrderService(deps.Mailer, deps.Links)

	return &Services{
		Feedback: feedback,
		User:     user,
		Order:    order,
	}
}
