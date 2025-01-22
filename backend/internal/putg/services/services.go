package services

import "github.com/Alexander272/new-sealur-pro/internal/putg/repository"

type Services struct {
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
	Type
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	configuration := NewConfigurationService(deps.Repos.Configuration)
	baseConstruction := NewBaseConstructionService(deps.Repos.BaseConstruction)
	construction := NewConstructionService(deps.Repos.Construction)
	baseFiller := NewBaseFillerService(deps.Repos.BaseFiller)
	filler := NewFillerService(deps.Repos.Filler)
	flangeType := NewFlangeTypeService(deps.Repos.FlangeType)
	info := NewInfoService(deps.Repos.Info)
	material := NewMaterialService(deps.Repos.Material)
	size := NewSizeService(deps.Repos.Size)
	standardInfo := NewStandardInfoService(deps.Repos.StandardInfo)
	putgType := NewTypeService(deps.Repos.PutgType)

	return &Services{
		Configuration:    configuration,
		BaseConstruction: baseConstruction,
		Construction:     construction,
		BaseFiller:       baseFiller,
		Filler:           filler,
		FlangeType:       flangeType,
		Info:             info,
		Material:         material,
		Size:             size,
		StandardInfo:     standardInfo,
		Type:             putgType,
	}
}
