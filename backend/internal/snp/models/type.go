package models

type SnpType struct {
	Id          string `db:"id" json:"id"`
	Title       string `db:"title" json:"title"`
	Code        string `db:"code" json:"code"`
	Description string `db:"description" json:"description"`
	HasD4       bool   `db:"hasD4" json:"hasD4"`
	HasD3       bool   `db:"hasD3" json:"hasD3"`
	HasD2       bool   `db:"hasD2" json:"hasD2"`
	HasD1       bool   `db:"hasD1" json:"hasD1"`
}

type BaseType struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	Description string `json:"description"`
}

type FlangeWithType struct {
	Id          string     `json:"id"`
	Title       string     `json:"title"`
	Code        string     `json:"code"`
	Description string     `json:"description"`
	Types       []*SnpType `json:"types"`
}

type GetTypeDTO struct {
	StandardId string `json:"standardId"`
}

type TypeDTO struct {
	Id           string `json:"id"`
	Title        string `json:"title"`
	FlangeTypeId string `json:"flangeTypeId"`
	Code         string `json:"code"`
	StandardId   string `json:"standardId"`
	Description  string `json:"description"`
	HasD4        bool   `json:"hasD4"`
	HasD3        bool   `json:"hasD3"`
	HasD2        bool   `json:"hasD2"`
	HasD1        bool   `json:"hasD1"`
}

type DeleteTypeDTO struct {
	Id string `json:"id"`
}
