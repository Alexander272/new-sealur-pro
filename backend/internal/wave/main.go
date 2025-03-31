package wave

import (
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository"
	"github.com/Alexander272/new-sealur-pro/internal/wave/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/wave/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewWaveModule(db *sqlx.DB) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
