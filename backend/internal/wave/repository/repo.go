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
type Construction interface {
	postgres.Construction
}

type Repository struct {
	StandardInfo
	FlangeType
	WaveTypeBase
	WaveType
	Construction
}

func NewRepository(db *sqlx.DB) *Repository {
	return &Repository{
		StandardInfo: postgres.NewStandardInfoRepo(db),
		FlangeType:   postgres.NewFlangeTypeRepo(db),
		WaveTypeBase: postgres.NewWaveTypeBaseRepo(db),
		WaveType:     postgres.NewTypeRepo(db),
		Construction: postgres.NewConstructionRepo(db),
	}
}
