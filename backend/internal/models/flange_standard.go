package models

type FlangeStandard struct {
	Id    string `db:"id" json:"id"`
	Title string `db:"title" json:"title"`
	Code  string `db:"code" json:"code"`
}

type GetFlangeStandardDTO struct{}

type FlangeStandardDTO struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title" binding:"required"`
	Code  string `json:"code" db:"code" binding:"required"`
}

type DeleteFlangeStandardDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
