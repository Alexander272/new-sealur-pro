package repository

import (
	"github.com/go-redis/redis/v8"
	"github.com/jmoiron/sqlx"
)

type Repository struct{}

func NewRepository(db *sqlx.DB, memDB *redis.Client) *Repository {
	return &Repository{}
}
