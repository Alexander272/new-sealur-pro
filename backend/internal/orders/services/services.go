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
	position := NewPositionService(deps.Repos.Position, snp)
	order := NewOrderService(deps.Repos.Order, position)

	return &Services{
		PositionSnp: snp,
		Position:    position,
		Order:       order,
	}
}
