package files

import (
	"github.com/Alexander272/new-sealur-pro/internal/config"
	"github.com/Alexander272/new-sealur-pro/internal/files/pkg/storage"
	"github.com/Alexander272/new-sealur-pro/internal/files/repository"
	"github.com/Alexander272/new-sealur-pro/internal/files/services"
	transport "github.com/Alexander272/new-sealur-pro/internal/files/transport/http"
	"github.com/Alexander272/new-sealur-pro/pkg/logger"
	"github.com/jmoiron/sqlx"
)

func NewFilesModule(db *sqlx.DB, conf *config.Config) *transport.Handler {
	store, err := storage.NewClient(conf.MinIO)
	if err != nil {
		logger.Error("failed to create minio client.", logger.ErrAttr(err))
		return nil
	}

	repo := repository.NewRepository(store)
	services := services.NewServices(&services.Deps{Repos: repo, Bucket: conf.MinIO.Bucket})
	handler := transport.NewHandler(services, conf.MinIO)

	return handler
}
