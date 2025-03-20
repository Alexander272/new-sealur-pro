package smtp

import (
	"bytes"
	"fmt"
	"time"

	htmlTemplate "html/template"
	textTemplate "text/template"

	"github.com/Alexander272/new-sealur-pro/internal/mail/constants"
	"github.com/Alexander272/new-sealur-pro/internal/mail/pkg/smtp/funcs"
	"github.com/Alexander272/new-sealur-pro/internal/mail/templates"
	"github.com/Alexander272/new-sealur-pro/pkg/error_bot"
	"github.com/tdewolff/minify/v2"
	"github.com/tdewolff/minify/v2/css"
	"github.com/tdewolff/minify/v2/html"
	"github.com/wneessen/go-mail"
)

type SmtpMailer struct {
	client *mail.Client
	sender string
}

type Deps struct {
	Host   string
	Port   int
	User   string
	Pass   string
	Sender string
}

func NewMailer(deps *Deps) (*SmtpMailer, error) {
	client, err := mail.NewClient(deps.Host,
		mail.WithPort(deps.Port),
		mail.WithTimeout(constants.Timeout),
		mail.WithSMTPAuth(mail.SMTPAuthLogin),
		mail.WithUsername(deps.User),
		mail.WithPassword(deps.Pass),
		// mail.WithHELO("pro.sealur.ru"),
	)
	if err != nil {
		return nil, fmt.Errorf("failed to create mail client. error: %w", err)
	}

	mailer := &SmtpMailer{
		client: client,
		sender: deps.Sender,
	}
	return mailer, nil
}

type Mailer interface {
	Send(dto *SendDTO) error
	AsyncSend(dto *SendDTO)
}

func (s *SmtpMailer) Send(dto *SendDTO) error {
	msg := mail.NewMsg()

	if err := msg.To(dto.Recipients...); err != nil {
		return fmt.Errorf("failed to set recipients. error: %w", err)
	}

	if err := msg.From(s.sender); err != nil {
		return fmt.Errorf("failed to set sender. error: %w", err)
	}
	if dto.ReplyTo != "" {
		if err := msg.ReplyTo(dto.ReplyTo); err != nil {
			return fmt.Errorf("failed to set reply to. error: %w", err)
		}
	}
	// msg.Subject(dto.Subject)

	ts, err := textTemplate.New("").Funcs(funcs.TemplateFuncs).ParseFS(templates.Templates, dto.Template)
	if err != nil {
		return fmt.Errorf("failed to create text template set. error: %w", err)
	}

	subject := new(bytes.Buffer)
	if err := ts.ExecuteTemplate(subject, "subject", dto.Data); err != nil {
		return fmt.Errorf("failed to execute subject template. error: %w", err)
	}

	msg.Subject(subject.String())

	if ts.Lookup("plainBody") != nil {
		plainBody := new(bytes.Buffer)
		err = ts.ExecuteTemplate(plainBody, "plainBody", dto.Data)
		if err != nil {
			return fmt.Errorf("failed to execute plain template. error: %w", err)
		}
		msg.SetBodyString(mail.TypeTextPlain, plainBody.String())
	}

	if ts.Lookup("htmlBody") != nil {
		patterns := []string{"partials/header.tmpl", "partials/footer.tmpl", "partials/head.tmpl", "partials/support.tmpl", dto.Template}
		ts, err := htmlTemplate.New("").Funcs(funcs.TemplateFuncs).ParseFS(templates.Templates, patterns...)
		if err != nil {
			return fmt.Errorf("failed to create html template set. error: %w", err)
		}

		htmlBody := new(bytes.Buffer)
		err = ts.ExecuteTemplate(htmlBody, "htmlBody", dto.Data)
		if err != nil {
			return fmt.Errorf("failed to execute html template. error: %w", err)
		}

		m := minify.New()
		m.AddFunc("text/css", css.Minify)
		m.AddFunc("text/html", html.Minify)
		body, err := m.String("text/html", htmlBody.String())
		if err != nil {
			return fmt.Errorf("failed to minify html. error: %w", err)
		}

		msg.AddAlternativeString(mail.TypeTextHTML, body)
	}

	// for _, a := range dto.Attachments {
	// 	msg.AttachFile(a.Name)

	// 	// if err := msg.AttachReader(a.Name, a.Blob); err != nil {
	// 	// 	return fmt.Errorf("failed to attach file. error: %w", err)
	// 	// }
	// }

	for i := 1; i <= 3; i++ {
		err = s.client.DialAndSend(msg)

		if nil == err {
			return nil
		}

		if i != 3 {
			time.Sleep(2 * time.Second)
		}
	}
	return err
}

func (s *SmtpMailer) AsyncSend(dto *SendDTO) {
	go func() {
		if err := s.Send(dto); err != nil {
			error_bot.Send(nil, err.Error(), dto)
		}
	}()
}
