package models

type Mounting struct {
	Id    string `db:"id" json:"id"`
	Title string `db:"title" json:"title"`
}

type GetMountingDTO struct{}

type MountingDTO struct {
	Id    string `db:"id" json:"id"`
	Title string `db:"title" json:"title" binding:"required"`
}

type DeleteMountingDTO struct {
	Id string `db:"id" json:"id" binding:"required"`
}
