package models

type Info struct {
	Id           string `json:"id" db:"id"`
	FillerId     string `json:"fillerId" db:"filler_id"`
	HasJumper    bool   `json:"hasJumper" db:"has_jumper"`
	HasHole      bool   `json:"hasHole" db:"has_hole"`
	HasRemovable bool   `json:"hasRemovable" db:"has_removable"`
	HasMounting  bool   `json:"hasMounting" db:"has_mounting"`
	HasCoating   bool   `json:"hasCoating" db:"has_coating"`
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
