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
type Construction interface {
	postgres.Construction
}
type Filler interface {
	postgres.Filler
}
type Material interface {
	postgres.Material
}

type Repository struct {
	StandardInfo
	FlangeType
	JacketedBaseType
	Construction
	Filler
	Material
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo:     postgres.NewStandardInfoRepo(db),
		FlangeType:       postgres.NewFlangeTypeRepo(db),
		JacketedBaseType: postgres.NewJacketedTypeBaseRepo(db),
		Construction:     postgres.NewConstructionRepo(db),
		Filler:           postgres.NewFillerRepo(db),
		Material:         postgres.NewMaterialRepo(db),
	}
}
