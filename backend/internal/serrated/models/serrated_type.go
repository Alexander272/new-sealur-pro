package models

type SerratedType struct {
	Id          string `json:"id" db:"id"`
	FlangeId    string `json:"flangeId" db:"flange_id"`
	BaseId      string `json:"baseId" db:"base_id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasD4       bool   `json:"hasD4" db:"has_d4"`
	HasD3       bool   `json:"hasD3" db:"has_d3"`
	HasD2       bool   `json:"hasD2" db:"has_d2"`
	HasD1       bool   `json:"hasD1" db:"has_d1"`
}

type GetSerratedTypesDTO struct {
	FlangeId string `json:"flangeId"`
}

type SerratedTypeDTO struct {
	Id       string `json:"id" db:"id"`
	FlangeId string `json:"flangeId" db:"flange_id"`
	BaseId   string `json:"baseId" db:"base_id"`
}

type DeleteSerratedTypeDTO struct {
	Id string `json:"id" db:"id"`
}
