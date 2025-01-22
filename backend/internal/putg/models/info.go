package models

type Info struct {
	Id           string `json:"id"`
	FillerId     string `json:"fillerId"`
	HasJumper    bool   `json:"hasJumper"`
	HasHole      bool   `json:"hasHole"`
	HasRemovable bool   `json:"hasRemovable"`
	HasMounting  bool   `json:"hasMounting"`
	HasCoating   bool   `json:"hasCoating"`
}

type GetInfoByFillerDTO struct {
	FillerId string `json:"fillerId"`
}
type GetInfoByConstructionDTO struct {
	ConstructionId string `json:"constructionId"`
}

type InfoDTO struct {
	Id           string `json:"id"`
	HasJumper    bool   `json:"hasJumper"`
	HasHole      bool   `json:"hasHole"`
	HasRemovable bool   `json:"hasRemovable"`
	HasMounting  bool   `json:"hasMounting"`
	HasCoating   bool   `json:"hasCoating"`
	FillerId     string `json:"fillerId"`
}

type DeleteInfoDTO struct {
	Id string `json:"id"`
}
