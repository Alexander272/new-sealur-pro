package models

type Temperature struct {
	Id    string `db:"id" json:"id"`
	Title string `db:"title" json:"title"`
}

type GetTemperatureDTO struct{}

type TemperatureDTO struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title" binding:"required"`
}

type DeleteTemperatureDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
