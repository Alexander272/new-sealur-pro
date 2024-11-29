package models

type Standard struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
}

type GetStandardDTO struct {
}

type StandardDTO struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title" binding:"required"`
}

type DeleteStandardDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
