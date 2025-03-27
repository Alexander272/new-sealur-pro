package analytics

import (
	"github.com/Alexander272/new-sealur-pro/internal/analytics/repository"
	"github.com/Alexander272/new-sealur-pro/internal/analytics/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/analytics/transport/http"
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/jmoiron/sqlx"
)

func NewAnalyticsModule(db *sqlx.DB, conf *config.Config) *transport.Handler {
	repo := repository.NewRepository(db)
	services := services.NewServices(repo)
	handler := transport.NewHandler(services)

	return handler
}
