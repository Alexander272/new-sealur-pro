package services

import (
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/export"
	"github.com/Alexander272/new-sealur-pro/internal/orders/services/position"
	base "github.com/Alexander272/new-sealur-pro/internal/services"
)

type Services struct {
	position.Position
	Order
	export.Zip
	export.Export
}

type Deps struct {
	Repos *repository.Repository
	Files *files.Services
	Mail  *mail.Services
	User  base.User
}

func NewServices(deps *Deps) *Services {
	snp := position.NewPositionSnpService(deps.Repos.PositionSnp, deps.Files.Files)
	putg := position.NewPositionPutgService(deps.Repos.PositionPutg, deps.Files.Files)
	wave := position.NewPositionWaveService(deps.Repos.PositionWave, deps.Files.Files)
	serrated := position.NewPositionSerratedService(deps.Repos.PositionSerrated, deps.Files.Files)
	jacketed := position.NewPositionJacketedService(deps.Repos.PositionJacketed, deps.Files.Files)
	position := position.NewPositionService(&position.PositionDeps{
		Repo: deps.Repos.Position,
		Snp:  snp, Putg: putg, Wave: wave, Serrated: serrated, Jacketed: jacketed,
		Files: deps.Files.Files,
	})
	zip := export.NewZipService()
	export := export.NewExportService(&export.ExportDeps{
		Snp: snp, Putg: putg, Wave: wave, Serrated: serrated,
		Files: deps.Files.Files, Zip: zip,
	})
	order := NewOrderService(&OrderDeps{Repo: deps.Repos.Order, Mail: deps.Mail, User: deps.User, Position: position, Export: export})

	return &Services{
		Position: position,
		Order:    order,
		Zip:      zip,
		Export:   export,
	}
}
