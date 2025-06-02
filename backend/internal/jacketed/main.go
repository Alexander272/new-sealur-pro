package jacketed

import (
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/repository"
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/jacketed/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewJacketedModule(db *sqlx.DB) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
