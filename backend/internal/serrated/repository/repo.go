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
type SerratedType interface {
	postgres.SerratedType
}
type SerratedTypeBase interface {
	postgres.SerratedTypeBase
}
type Construction interface {
	postgres.Construction
}
type Size interface {
	postgres.Size
}
type Plating interface {
	postgres.Plating
}
type Material interface {
	postgres.Material
}
type Info interface {
	postgres.Info
}

type Repository struct {
	StandardInfo
	FlangeType
	SerratedType
	SerratedTypeBase
	Construction
	Size
	Plating
	Material
	Info
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo:     postgres.NewStandardInfoRepo(db),
		FlangeType:       postgres.NewFlangeTypeRepo(db),
		SerratedType:     postgres.NewTypeRepo(db),
		SerratedTypeBase: postgres.NewSerratedTypeBaseRepo(db),
		Construction:     postgres.NewConstructionRepo(db),
		Size:             postgres.NewSizeRepo(db),
		Plating:          postgres.NewPlatingRepo(db),
		Material:         postgres.NewMaterialRepo(db),
		Info:             postgres.NewInfoRepo(db),
	}
}
