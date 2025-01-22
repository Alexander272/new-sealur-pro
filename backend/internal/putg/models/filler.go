package models

type Filler struct {
	Id          string `json:"id"`
	BaseId      string `json:"baseId"`
	Temperature string `json:"temperature"`
	Title       string `json:"title"`
	Code        string `json:"code"`
	Description string `json:"description"`
	Designation string `json:"designation"`
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
