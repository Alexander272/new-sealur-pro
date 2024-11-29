package models

type FlangeType struct {
	Id    string `db:"id" json:"id"`
	Title string `db:"title" json:"title"`
	Code  string `db:"code" json:"code"`
	// Description string `json:"description"`
}

type GetFlangeTypeDTO struct {
	StandardId string `json:"standardId"`
}

type FlangeTypeDTO struct {
	Id    string `json:"id"`
	Title string `json:"title"`
	Code  string `json:"code"`
	// Description string `json:"description"`
	StandardId string `json:"standardId"`
}

type DeleteFlangeTypeDTO struct {
	Id string `json:"id" binding:"required"`
}
