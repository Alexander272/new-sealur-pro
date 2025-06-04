package models

type Construction struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasMaterial bool   `json:"hasMaterial" db:"has_material"`
}

type GetConstructionDTO struct{}

type ConstructionDTO struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasMaterial bool   `json:"hasMaterial" db:"has_material"`
}

type DeleteConstructionDTO struct {
	Id string `json:"id" db:"id"`
}
