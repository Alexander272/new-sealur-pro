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
type JacketedType interface {
	postgres.JacketedType
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
type Size interface {
	postgres.Size
}

type Repository struct {
	StandardInfo
	FlangeType
	JacketedType
	Construction
	Filler
	Material
	Size
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo: postgres.NewStandardInfoRepo(db),
		FlangeType:   postgres.NewFlangeTypeRepo(db),
		JacketedType: postgres.NewJacketedTypeRepo(db),
		Construction: postgres.NewConstructionRepo(db),
		Filler:       postgres.NewFillerRepo(db),
		Material:     postgres.NewMaterialRepo(db),
		Size:         postgres.NewSizeRepo(db),
	}
}
