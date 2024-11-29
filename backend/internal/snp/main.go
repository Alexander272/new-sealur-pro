package snp

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository"
	"github.com/Alexander272/new-sealur-pro/internal/snp/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/snp/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewSnpModule(db *sqlx.DB, conf *config.Config) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
