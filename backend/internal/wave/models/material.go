package models

type Material struct {
	Id         string `json:"id"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Code       string `json:"code"`
	BaseCode   string `json:"baseCode"`
	Title      string `json:"title"`
	Short      string `json:"short"`
}

type Materials struct {
	RotaryPlug             []*Material `json:"rotaryPlug"`
	Base                   []*Material `json:"base"`
	RotaryPlugDefaultIndex int         `json:"rotaryPlugDefaultIndex"`
	BaseDefaultIndex       int         `json:"baseDefaultIndex"`
}

type GetMaterialsDTO struct{}

type GetMaterialsByTypeDTO struct {
	Type string `json:"type" db:"type"`
}

type MaterialDTO struct {
	Id         string `json:"id" db:"id"`
	MaterialId string `json:"materialId" db:"material_id"`
	Type       string `json:"type" db:"type"`
	Code       string `json:"code" db:"code"`
	IsDefault  bool   `json:"isDefault" db:"is_default"`
}

type DeleteMaterialDTO struct {
	Id string `json:"id" db:"id"`
}
