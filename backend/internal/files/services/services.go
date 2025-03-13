package services

import "github.com/Alexander272/new-sealur-pro/internal/files/repository"

type Services struct {
	Files
}

type Deps struct {
	Repos  *repository.Repository
	Bucket string
}

func NewServices(deps *Deps) *Services {
	files := NewFilesService(deps.Repos.Files, deps.Bucket)

	return &Services{
		Files: files,
	}
}
