package orders

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/orders/transport/http"
	"github.com/jmoiron/sqlx"
)

type Deps struct {
	DB    *sqlx.DB
	Conf  *config.Config
	Files *files.Services
	Mail  *mail.Services
}

func NewOrdersModule(deps *Deps) *transport.Handler {
	repo := repository.NewRepository(deps.DB)
	services := services.NewServices(&services.Deps{Repos: repo, Files: deps.Files})
	handler := transport.NewHandler(services)

	return handler
}
