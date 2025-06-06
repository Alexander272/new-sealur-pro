package models

type Filler struct {
	Id          string `json:"id" db:"id"`
	Temperature string `json:"temperature" db:"temperature"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	Designation string `json:"designation" db:"designation"`
}

type GetFillerDTO struct {
}

type FillerDTO struct {
	Id            string `json:"id" db:"id"`
	TemperatureId string `json:"temperatureId" db:"temperature_id"`
	Title         string `json:"title" db:"title"`
	Code          string `json:"code" db:"code"`
	Description   string `json:"description" db:"description"`
	Designation   string `json:"designation" db:"designation"`
}

type DeleteFillerDTO struct {
	Id string `json:"id" db:"id"`
}
