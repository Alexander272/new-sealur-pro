package models

type Configuration struct {
	Id          string `json:"id"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	HasStandard bool   `json:"hasStandard"`
	HasDrawing  bool   `json:"hasDrawing"`
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
