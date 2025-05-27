package models

type Construction struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasMaterial bool   `json:"hasMaterial" db:"has_material"`
}

type GetConstructionDTO struct {
	TypeId     string `json:"typeId" db:"type_id"`
	StandardId string `json:"standardId" db:"standard_id"`
}

type ConstructionDTO struct {
	Id         string `json:"id" db:"id"`
	BaseId     string `json:"baseId" db:"base_id"`
	StandardId string `json:"standardId" db:"standard_id"`
}

type DeleteConstructionDTO struct {
	Id string `json:"id" db:"id"`
}
