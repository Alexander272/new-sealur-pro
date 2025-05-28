package pq_models

import "github.com/lib/pq"

type Size struct {
	Id          string         `json:"id" db:"id"`
	Dn          string         `json:"dn" db:"dn"`
	DnAlt       int            `json:"dnAlt" db:"dn_alt"`
	Pn          string         `json:"pn" db:"pn"`
	PnAlt       string         `json:"pnAlt" db:"pn_alt"`
	D4          string         `json:"d4" db:"d4"`
	D3          string         `json:"d3" db:"d3"`
	D2          string         `json:"d2" db:"d2"`
	D1          string         `json:"d1" db:"d1"`
	Thicknesses pq.StringArray `json:"thicknesses" db:"h"`
}
