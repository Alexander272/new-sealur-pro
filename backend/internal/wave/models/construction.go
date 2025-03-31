package models

type Construction struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
}

type GetConstructionDTO struct {
	TypeId string `json:"typeId" db:"type_id"`
}

type ConstructionDTO struct {
	Id           string   `json:"id" db:"id"`
	Title        string   `json:"title" db:"title"`
	Code         string   `json:"code" db:"code"`
	Description  string   `json:"description" db:"description"`
	AllowedTypes []string `json:"allowedTypes" db:"allowed_types"`
}

type DeleteConstructionDTO struct {
	Id string `json:"id" db:"id"`
}
