package services

import "github.com/Alexander272/new-sealur-pro/internal/snp/repository"

type Services struct {
	Filler
	FlangeType
	Materials
	Info
	Size
	StandardInfo
	Type
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	filler := NewFillerService(deps.Repos.Filler)
	flangeType := NewFlangeTypeService(deps.Repos.FlangeType)
	materials := NewMaterialsService(deps.Repos.Materials)
	info := NewInfoService(deps.Repos.Info)
	size := NewSizeService(deps.Repos.Size)
	standardInfo := NewStandardInfoService(deps.Repos.StandardInfo)
	typeService := NewTypeService(deps.Repos.Type)

	return &Services{
		Filler:       filler,
		FlangeType:   flangeType,
		Materials:    materials,
		Info:         info,
		Size:         size,
		StandardInfo: standardInfo,
		Type:         typeService,
	}
}
