package models

type Material struct {
	Id         string `json:"id"`
	MaterialId string `json:"materialId"`
	Type       string `json:"type"`
	IsDefault  bool   `json:"isDefault"`
	Thickness  string `json:"thickness"`
	Code       string `json:"code"`
	BaseCode   string `json:"baseCode"`
	Title      string `json:"title"`
	Short      string `json:"short"`
}

type Materials struct {
	Shell             []*Material `json:"shell"`
	ShellDefaultIndex int         `json:"shellDefaultIndex"`
}

type GetMaterialsDTO struct {
	StandardId string `json:"standardId"`
}

type MaterialDTO struct {
	Id         string `json:"id" db:"id"`
	StandardId string `json:"standardId" db:"standard_id"`
	MaterialId string `json:"materialId" db:"material_id"`
	Type       string `json:"type" db:"type"`
	Code       string `json:"code" db:"code"`
	IsDefault  bool   `json:"isDefault" db:"is_default"`
	Thickness  string `json:"thickness" db:"thickness"`
}

type DeleteMaterialDTO struct {
	Id string `json:"id" db:"id"`
}
