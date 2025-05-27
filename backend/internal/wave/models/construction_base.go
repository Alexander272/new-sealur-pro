package models

// type Construction struct {
// 	Id          string `json:"id" db:"id"`
// 	Title       string `json:"title" db:"title"`
// 	Code        string `json:"code" db:"code"`
// 	Description string `json:"description" db:"description"`
// 	HasMaterial bool   `json:"hasMaterial" db:"has_material"`
// }

type GetBaseConstructionDTO struct {
	TypeId string `json:"typeId" db:"type_id"`
}

type BaseConstructionDTO struct {
	Id           string   `json:"id" db:"id"`
	Title        string   `json:"title" db:"title"`
	Code         string   `json:"code" db:"code"`
	Description  string   `json:"description" db:"description"`
	AllowedTypes []string `json:"allowedTypes" db:"allowed_types"`
	HasMaterial  bool     `json:"hasMaterial" db:"has_material"`
}

type DeleteBaseConstructionDTO struct {
	Id string `json:"id" db:"id"`
}
