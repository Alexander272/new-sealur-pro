package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/putg/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type Configuration interface {
	postgres.Configuration
}

type BaseConstruction interface {
	postgres.BaseConstruction
}
type Construction interface {
	postgres.Construction
}

type BaseFiller interface {
	postgres.BaseFiller
}
type Filler interface {
	postgres.Filler
}

type FlangeType interface {
	postgres.FlangeType
}

type Info interface {
	postgres.Info
}

type Material interface {
	postgres.Material
}

type Size interface {
	postgres.Size
}

type StandardInfo interface {
	postgres.StandardInfo
}

type PutgType interface {
	postgres.PutgType
}

type Repository struct {
	Configuration
	BaseConstruction
	Construction
	BaseFiller
	Filler
	FlangeType
	Info
	Material
	Size
	StandardInfo
	PutgType
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		Configuration:    postgres.NewConfigurationRepo(db),
		BaseConstruction: postgres.NewBaseConstructionRepo(db),
		Construction:     postgres.NewConstructionRepo(db),
		BaseFiller:       postgres.NewBaseFillerRepo(db),
		Filler:           postgres.NewFillerRepo(db),
		FlangeType:       postgres.NewFlangeTypeRepo(db),
		Info:             postgres.NewInfoRepo(db),
		Material:         postgres.NewMaterialRepo(db),
		Size:             postgres.NewSizeRepo(db),
		StandardInfo:     postgres.NewStandardInfoRepo(db),
		PutgType:         postgres.NewTypeRepo(db),
	}
}
