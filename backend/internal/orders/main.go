package orders

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/orders/transport/http"
	"github.com/jmoiron/sqlx"
)

func NewOrdersModule(db *sqlx.DB, conf *config.Config) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(&services.Deps{Repos: repo})
	handler := transport.NewHandler(services)

	return handler
}
