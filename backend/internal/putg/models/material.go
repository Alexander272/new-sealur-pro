package models

type Material struct {
	Id         string `json:"id"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Code       string `json:"code"`
	BaseCode   string `json:"baseCode"`
	Title      string `json:"title"`
}

type Materials struct {
	RotaryPlug             []*Material `json:"rotaryPlug"`
	InnerRing              []*Material `json:"innerRing"`
	OuterRing              []*Material `json:"outerRing"`
	RotaryPlugDefaultIndex int         `json:"rotaryPlugDefaultIndex"`
	InnerRingDefaultIndex  int         `json:"innerRingDefaultIndex"`
	OuterRingDefaultIndex  int         `json:"outerRingDefaultIndex"`
}

type GetMaterialsDTO struct {
	StandardId string `json:"standardId"`
}

type MaterialDTO struct {
	Id         string `json:"id"`
	StandardId string `json:"standardId"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Code       string `json:"code"`
}

type DeleteMaterialDTO struct {
	Id string `json:"id"`
}
