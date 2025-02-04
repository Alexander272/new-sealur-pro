package postgres

import (
	"github.com/jmoiron/sqlx"
)

type RegionRepo struct {
	db *sqlx.DB
}

func NewRegionRepo(db *sqlx.DB) *RegionRepo {
	return &RegionRepo{db: db}
}

type Region interface{}

// func (r *RegionRepo) GetManager(ctx context.Context)
