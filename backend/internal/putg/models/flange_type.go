package models

type FlangeType struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Code  string `json:"code"`
}

type GetFlangeTypeDTO struct {
	StandardId string `json:"standardId"`
}

type FlangeTypeDTO struct {
	Id         string `json:"id"`
	Title      string `json:"title"`
	Code       string `json:"code"`
	StandardId string `json:"standardId"`
}

type DeleteFlangeTypeDTO struct {
	Id string `json:"id"`
}
