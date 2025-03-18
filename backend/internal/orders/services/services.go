package services

import (
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
)

type Services struct {
	PositionSnp
	Position
	Order
	Zip
	Export
}

type Deps struct {
	Repos *repository.Repository
	Files *files.Services
}

func NewServices(deps *Deps) *Services {
	snp := NewPositionSnpService(deps.Repos.PositionSnp, deps.Files.Files)
	putg := NewPositionPutgService(deps.Repos.PositionPutg, deps.Files.Files)
	position := NewPositionService(&PositionDeps{Repo: deps.Repos.Position, Snp: snp, Putg: putg, Files: deps.Files.Files})
	zip := NewZipService()
	export := NewExportService(&ExportDeps{Snp: snp, Putg: putg, Files: deps.Files.Files, Zip: zip})
	order := NewOrderService(deps.Repos.Order, position, export)

	return &Services{
		PositionSnp: snp,
		Position:    position,
		Order:       order,
		Zip:         zip,
		Export:      export,
	}
}
