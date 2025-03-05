package services

import "github.com/Alexander272/new-sealur-pro/internal/orders/repository"

type Services struct {
	PositionSnp
	Position
	Order
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	snp := NewPositionSnpService(deps.Repos.PositionSnp)
	putg := NewPositionPutgService(deps.Repos.PositionPutg)
	position := NewPositionService(&PositionDeps{Repo: deps.Repos.Position, Snp: snp, Putg: putg})
	order := NewOrderService(deps.Repos.Order, position)

	return &Services{
		PositionSnp: snp,
		Position:    position,
		Order:       order,
	}
}
