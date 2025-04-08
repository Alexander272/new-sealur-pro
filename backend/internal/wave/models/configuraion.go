package models

type Configuration struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	HasStandard bool   `json:"hasStandard" db:"has_standard"`
	HasDrawing  bool   `json:"hasDrawing" db:"has_drawing"`
}

type GetConfigurationDTO struct{}

type ConfigurationDTO struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	HasStandard bool   `json:"hasStandard"`
	HasDrawing  bool   `json:"hasDrawing"`
	IsDefault   bool   `json:"isDefault"`
}

type DeleteConfigurationDTO struct {
	Id string `json:"id"`
}
