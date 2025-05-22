package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/serrated/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type StandardInfo interface {
	postgres.StandardInfo
}
type FlangeType interface {
	postgres.FlangeType
}

type Repository struct {
	StandardInfo
	FlangeType
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo: postgres.NewStandardInfoRepo(db),
		FlangeType:   postgres.NewFlangeTypeRepo(db),
	}
}
