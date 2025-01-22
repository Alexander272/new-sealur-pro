package models

type PutgType struct {
	Id           string  `db:"id" json:"id"`
	Title        string  `db:"title" json:"title"`
	Code         string  `db:"code" json:"code"`
	MinThickness float64 `db:"min_thickness" json:"minThickness"`
	MaxThickness float64 `db:"max_thickness" json:"maxThickness"`
	Description  string  `db:"description" json:"description"`
	TypeCode     string  `db:"type_code" json:"typeCode"`
}

type GetTypeDTO struct {
	BaseId string `json:"baseId"`
}

type PutgTypeDTO struct {
	Id           string  `db:"id" json:"id"`
	Title        string  `db:"title" json:"title"`
	Code         string  `db:"code" json:"code"`
	FillerId     string  `db:"filler_id" json:"fillerId"`
	MinThickness float64 `db:"min_thickness" json:"minThickness"`
	MaxThickness float64 `db:"max_thickness" json:"maxThickness"`
	Description  string  `db:"description" json:"description"`
	TypeCode     string  `db:"type_code" json:"typeCode"`
}

type DeleteTypeDTO struct {
	Id string `json:"id"`
}
