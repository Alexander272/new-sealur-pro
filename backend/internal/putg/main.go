package putg

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository"
	"github.com/Alexander272/new-sealur-pro/internal/putg/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/putg/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewPutgModule(db *sqlx.DB, conf *config.Config) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
