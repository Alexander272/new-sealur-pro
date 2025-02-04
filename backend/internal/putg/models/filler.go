package models

type Filler struct {
	Id          string `json:"id" db:"id"`
	BaseId      string `json:"baseId" db:"base_id"`
	Temperature string `json:"temperature" db:"temperature"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	Designation string `json:"designation" db:"designation"`
}

type GetFillerDTO struct {
	StandardId string `json:"standardId"`
}

type FillerDTO struct {
	Id         string `json:"id"`
	FillerId   string `json:"fillerId"`
	StandardId string `json:"standardId"`
}

type DeleteFillerDTO struct {
	Id string `json:"id"`
}
