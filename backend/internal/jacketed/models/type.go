package models

type JacketedType struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasD4       bool   `json:"hasD4" db:"has_d4"`
	HasD3       bool   `json:"hasD3" db:"has_d3"`
	HasD2       bool   `json:"hasD2" db:"has_d2"`
	HasD1       bool   `json:"hasD1" db:"has_d1"`
}

type GetJacketedTypeDTO struct {
	FillerId string `json:"fillerId" db:"filler_id"`
}

type JacketedTypeDTO struct {
	Id          string `json:"id" db:"id"`
	FillerId    string `json:"fillerId" db:"filler_id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasD4       bool   `json:"hasD4" db:"has_d4"`
	HasD3       bool   `json:"hasD3" db:"has_d3"`
	HasD2       bool   `json:"hasD2" db:"has_d2"`
	HasD1       bool   `json:"hasD1" db:"has_d1"`
}

type DeleteJacketedTypeDTO struct {
	Id string `json:"id" db:"id"`
}
