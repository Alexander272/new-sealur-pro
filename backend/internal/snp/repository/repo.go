package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/snp/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Filler interface {
	postgres.Filler
}
type FlangeType interface {
	postgres.FlangeType
}
type Info interface {
	postgres.Info
}
type Materials interface {
	postgres.Material
}
type Size interface {
	postgres.Size
}
type StandardInfo interface {
	postgres.StandardInfo
}
type Type interface {
	postgres.SnpType
}

type Repository struct {
	Filler
	FlangeType
	Info
	Materials
	Size
	StandardInfo
	Type
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Filler:       postgres.NewFillerRepo(db),
		FlangeType:   postgres.NewFlangeTypeRepo(db),
		Info:         postgres.NewInfoRepo(db),
		Materials:    postgres.NewMaterialRepo(db),
		Size:         postgres.NewSizeRepo(db),
		StandardInfo: postgres.NewStandardInfoRepo(db),
		Type:         postgres.NewTypeRepo(db),
	}
}
