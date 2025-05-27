package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/wave/repository/postgres"
	"github.com/jmoiron/sqlx"
)

type StandardInfo interface {
	postgres.StandardInfo
}
type FlangeType interface {
	postgres.FlangeType
}
type WaveType interface {
	postgres.WaveType
}
type WaveTypeBase interface {
	postgres.WaveTypeBase
}
type BaseConstruction interface {
	postgres.BaseConstruction
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
type Configuration interface {
	postgres.Configuration
}
type Info interface {
	postgres.Info
}

type Repository struct {
	StandardInfo
	FlangeType
	WaveTypeBase
	WaveType
	BaseConstruction
	Construction
	Size
	Plating
	Material
	Configuration
	Info
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo:     postgres.NewStandardInfoRepo(db),
		FlangeType:       postgres.NewFlangeTypeRepo(db),
		WaveTypeBase:     postgres.NewWaveTypeBaseRepo(db),
		WaveType:         postgres.NewTypeRepo(db),
		BaseConstruction: postgres.NewBaseConstructionRepo(db),
		Construction:     postgres.NewConstructionRepo(db),
		Size:             postgres.NewSizeRepo(db),
		Plating:          postgres.NewPlatingRepo(db),
		Material:         postgres.NewMaterialRepo(db),
		Configuration:    postgres.NewConfigurationRepo(db),
		Info:             postgres.NewInfoRepo(db),
	}
}
