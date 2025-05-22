package serrated

import (
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository"
	"github.com/Alexander272/new-sealur-pro/internal/serrated/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/serrated/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewSerratedModule(db *sqlx.DB) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
