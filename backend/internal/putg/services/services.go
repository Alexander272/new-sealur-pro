package services

import "github.com/Alexander272/new-sealur-pro/internal/putg/repository"

type Services struct{}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	return &Services{}
}
