package mail

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp"
	"github.com/Alexander272/new-sealur-pro/internal/mail/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/mail/transport/http"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
)

func NewMailModule(conf *config.Config) *transport.Handler {
	deps := &smtp.Deps{
		Host:   conf.SMTP.Host,
		Port:   conf.SMTP.Port,
		User:   conf.SMTP.User,
		Pass:   conf.SMTP.Password,
		Sender: conf.SMTP.Sender,
	}
	mailer, err := smtp.NewMailer(deps)
	if err != nil {
		logger.Error("failed to create mailer.", logger.ErrAttr(err))
		return nil
	}

	services := services.NewServices(&services.Deps{Mailer: mailer, Emails: conf.Emails, Links: conf.Links})
	handler := transport.NewHandler(services)

	return handler
}
