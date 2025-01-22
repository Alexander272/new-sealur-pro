package models

type BaseFiller struct {
	Id          string `json:"id"`
	Temperature string `json:"temperature"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	Description string `json:"description"`
	Designation string `json:"designation"`
}

type GetBaseFillerDTO struct{}

type BaseFillerDTO struct {
	Id            string `json:"id"`
	TemperatureId string `json:"temperatureId"`
	Title         string `json:"title"`
	Code          string `json:"code"`
	Description   string `json:"description"`
	Designation   string `json:"designation"`
}

type DeleteBaseFillerDTO struct {
	Id string `json:"id"`
}
