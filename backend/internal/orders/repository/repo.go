package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Position interface {
	postgres.Position
}
type PositionSnp interface {
	postgres.PositionSnp
}

type Repository struct {
	Position
	PositionSnp
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Position:    postgres.NewPositionRepo(db),
		PositionSnp: postgres.NewPositionSnpRepo(db),
	}
}
