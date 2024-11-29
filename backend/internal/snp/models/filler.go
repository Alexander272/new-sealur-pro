package models

type Filler struct {
	Id            string   `json:"id"`
	Temperature   string   `json:"temperature"`
	BaseCode      string   `json:"baseCode"`
	Code          string   `json:"code"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Designation   string   `json:"designation"`
	DisabledTypes []string `json:"disabledTypes"`
}

type GetFillerDTO struct {
	StandardId string `json:"standardId,omitempty"`
}

type FillerDTO struct {
	Id            string   `json:"id"`
	StandardId    string   `json:"standardId"`
	TemperatureId string   `json:"temperatureId"`
	BaseCode      string   `json:"baseCode"`
	Code          string   `json:"code"`
	Title         string   `json:"title"`
	Description   string   `json:"description"`
	Designation   string   `json:"designation"`
	DisabledTypes []string `json:"disabledTypes"`
}

type DeleteFillerDTO struct {
	Id string `json:"id" binding:"required"`
}
