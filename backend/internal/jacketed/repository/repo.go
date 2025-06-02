package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/jacketed/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type StandardInfo interface {
	postgres.StandardInfo
}
type FlangeType interface {
	postgres.FlangeType
}
type JacketedBaseType interface {
	postgres.JacketedBaseType
}

type Repository struct {
	StandardInfo
	FlangeType
	JacketedBaseType
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo:     postgres.NewStandardInfoRepo(db),
		FlangeType:       postgres.NewFlangeTypeRepo(db),
		JacketedBaseType: postgres.NewJacketedTypeBaseRepo(db),
	}
}
