package models

type Role struct {
	Id    string `json:"id" db:"id"`
	Title string `json:"title" db:"title"`
	Code  string `json:"code" db:"code"`
	Level int    `json:"level" db:"level"`
}

type GetRolesDTO struct{}
