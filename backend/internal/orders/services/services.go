package services

import (
	files "github.com/Alexander272/new-sealur-pro/internal/files/services"
	mail "github.com/Alexander272/new-sealur-pro/internal/mail/services"
	"github.com/Alexander272/new-sealur-pro/internal/orders/repository"
	base "github.com/Alexander272/new-sealur-pro/internal/services"
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
	Mail  *mail.Services
	User  base.User
}

func NewServices(deps *Deps) *Services {
	snp := NewPositionSnpService(deps.Repos.PositionSnp, deps.Files.Files)
	putg := NewPositionPutgService(deps.Repos.PositionPutg, deps.Files.Files)
	position := NewPositionService(&PositionDeps{Repo: deps.Repos.Position, Snp: snp, Putg: putg, Files: deps.Files.Files})
	zip := NewZipService()
	export := NewExportService(&ExportDeps{Snp: snp, Putg: putg, Files: deps.Files.Files, Zip: zip})
	order := NewOrderService(&OrderDeps{Repo: deps.Repos.Order, Mail: deps.Mail, User: deps.User, Position: position, Export: export})

	return &Services{
		PositionSnp: snp,
		Position:    position,
		Order:       order,
		Zip:         zip,
		Export:      export,
	}
}
