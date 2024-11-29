package models

type Materials struct {
	Frame                 []*Material `json:"frame"`
	InnerRing             []*Material `json:"innerRing"`
	OuterRing             []*Material `json:"outerRing"`
	FrameDefaultIndex     int         `json:"frameDefaultIndex"`
	InnerRingDefaultIndex int         `json:"innerRingDefaultIndex"`
	OuterRingDefaultIndex int         `json:"outerRingDefaultIndex"`
}

type Material struct {
	Id         string `json:"id"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Code       string `json:"code"`
	IsStandard bool   `json:"isStandard"`
	BaseCode   string `json:"baseCode"`
	Title      string `json:"title"`
}

type GetMaterialDTO struct {
	StandardId string `json:"standardId"`
}

type MaterialDTO struct {
	Id         string `json:"id"`
	StandardId string `json:"standardId"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Code       string `json:"code"`
	IsStandard bool   `json:"isStandard"`
}

type DeleteMaterialDTO struct {
	Id string `json:"id" binding:"required"`
}
