package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/files/pkg/storage"
	"github.com/Alexander272/new-sealur-pro/internal/files/repository/minio"
)

type Files interface {
	minio.Files
}

type Repository struct {
	Files
}

func NewRepository(storage storage.Provider) *Repository {
	return &Repository{
		Files: minio.NewFilesRepo(storage),
	}
}
