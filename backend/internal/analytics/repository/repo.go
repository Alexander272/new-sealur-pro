package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/analytics/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Order interface {
	postgres.Order
}
type User interface {
	postgres.User
}

type Repository struct {
	Order
	User
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Order: postgres.NewOrderRepo(db),
		User:  postgres.NewUserRepo(db),
	}
}
