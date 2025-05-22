package services

import "github.com/Alexander272/new-sealur-pro/internal/serrated/repository"

type Services struct {
	StandardInfo
	FlangeType
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	standardInfo := NewStandardInfoService(deps.Repos.StandardInfo)
	flangeType := NewFlangeTypeService(deps.Repos.FlangeType)

	return &Services{
		StandardInfo: standardInfo,
		FlangeType:   flangeType,
	}
}
