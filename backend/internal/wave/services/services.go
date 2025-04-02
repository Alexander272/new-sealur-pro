package services

import "github.com/Alexander272/new-sealur-pro/internal/wave/repository"

type Services struct {
	StandardInfo
	FlangeType
	WaveTypeBase
	WaveType
	Construction
	Size
}

type Deps struct {
	Repos *repository.Repository
}

func NewServices(deps *Deps) *Services {
	standardInfo := NewStandardInfoService(deps.Repos.StandardInfo)
	flangeType := NewFlangeTypeService(deps.Repos.FlangeType)
	baseWaveType := NewWaveTypeBaseService(deps.Repos.WaveTypeBase)
	waveType := NewWaveTypeService(deps.Repos.WaveType)
	construction := NewConstructionService(deps.Repos.Construction)
	sizes := NewSizeService(deps.Repos.Size)

	return &Services{
		StandardInfo: standardInfo,
		FlangeType:   flangeType,
		WaveTypeBase: baseWaveType,
		WaveType:     waveType,
		Construction: construction,
		Size:         sizes,
	}
}
