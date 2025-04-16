package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Order interface {
	postgres.Order
}
type Position interface {
	postgres.Position
}
type PositionSnp interface {
	postgres.PositionSnp
}
type PositionPutg interface {
	postgres.PositionPutg
}
type PositionWave interface {
	postgres.PositionWave
}

type Repository struct {
	Order
	Position
	PositionSnp
	PositionPutg
	PositionWave
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Order:        postgres.NewOrderRepo(db),
		Position:     postgres.NewPositionRepo(db),
		PositionSnp:  postgres.NewPositionSnpRepo(db),
		PositionPutg: postgres.NewPositionPutgRepo(db),
		PositionWave: postgres.NewPositionWaveRepo(db),
	}
}
