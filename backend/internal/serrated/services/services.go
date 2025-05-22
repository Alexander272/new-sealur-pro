package services

import "github.com/Alexander272/new-sealur-pro/internal/serrated/repository"

type Services struct {
	StandardInfo
	FlangeType
	SerratedType
	SerratedTypeBase
	Construction
	Size
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	standardInfo := NewStandardInfoService(deps.Repos.StandardInfo)
	flangeType := NewFlangeTypeService(deps.Repos.FlangeType)
	serratedType := NewSerratedTypeService(deps.Repos.SerratedType)
	baseSerratedType := NewSerratedTypeBaseService(deps.Repos.SerratedTypeBase)
	construction := NewConstructionService(deps.Repos.Construction)
	size := NewSizeService(deps.Repos.Size)

	return &Services{
		StandardInfo:     standardInfo,
		FlangeType:       flangeType,
		SerratedType:     serratedType,
		SerratedTypeBase: baseSerratedType,
		Construction:     construction,
		Size:             size,
	}
}
