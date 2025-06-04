package services

import "github.com/Alexander272/new-sealur-pro/internal/jacketed/repository"

type Services struct {
	StandardInfo
	FlangeType
	JacketedBaseType
	Construction
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	standard := NewStandardInfoService(deps.Repos.StandardInfo)
	flange := NewFlangeTypeService(deps.Repos.FlangeType)
	jacketBase := NewJacketedBaseTypeService(deps.Repos.JacketedBaseType)
	construction := NewConstructionService(deps.Repos.Construction)

	return &Services{
		StandardInfo:     standard,
		FlangeType:       flange,
		JacketedBaseType: jacketBase,
		Construction:     construction,
	}
}
