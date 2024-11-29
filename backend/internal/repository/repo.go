package repository

import (
	"github.com/Alexander272/new-sealur-pro/internal/repository/postgres"
	"github.com/Alexander272/new-sealur-pro/internal/repository/redis"
	memoryDB "github.com/go-redis/redis/v8"
	"github.com/jmoiron/sqlx"
)

type Session interface {
	redis.Session
}
type Limit interface {
	redis.Limit
}
type Confirm interface {
	redis.Confirm
}

type FlangeStandard interface {
	postgres.FlangeStandard
}
type Material interface {
	postgres.Material
}
type Mounting interface {
	postgres.Mounting
}
type Standard interface {
	postgres.Standard
}
type Temperature interface {
	postgres.Temperature
}

type Repository struct {
	Session
	Limit
	Confirm

	FlangeStandard
	Material
	Mounting
	Standard
	Temperature
}

func NewRepository(db *sqlx.DB, memDB *memoryDB.Client) *Repository {
	return &Repository{
		Session: redis.NewSessionRepo(memDB),
		Limit:   redis.NewLimitRepo(memDB),
		Confirm: redis.NewConfirmRepo(memDB),

		FlangeStandard: postgres.NewFlangeStandardRepo(db),
		Material:       postgres.NewMaterialRepo(db),
		Mounting:       postgres.NewMountingRepo(db),
		Standard:       postgres.NewStandardRepo(db),
		Temperature:    postgres.NewTemperatureRepo(db),
	}
}
