package services

import "github.com/Alexander272/new-sealur-pro/internal/files/repository"

type Services struct {
	Files
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	files := NewFilesService(deps.Repos.Files)

	return &Services{
		Files: files,
	}
}
