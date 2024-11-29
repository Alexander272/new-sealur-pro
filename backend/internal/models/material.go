package models

type Material struct {
	Id       string `db:"id" json:"id"`
	Title    string `db:"title" json:"title"`
	Code     string `db:"code" json:"code"`
	ShortEn  string `db:"short_en" json:"shortEn,omitempty"`
	ShortRus string `db:"short_rus" json:"shortRus,omitempty"`
}

type GetMaterialDTO struct{}

type MaterialDTO struct {
	Id       string `db:"id" json:"id"`
	Title    string `db:"title" json:"title" binding:"required"`
	Code     string `db:"code" json:"code" binding:"required"`
	ShortEn  string `db:"short_en" json:"shortEn"`
	ShortRus string `db:"short_rus" json:"shortRus"`
}

type DeleteMaterialDTO struct {
	Id string `db:"id" json:"id" binding:"required"`
}
