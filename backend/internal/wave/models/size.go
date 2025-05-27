package models

type Dn struct {
	Dn  string `json:"dn" db:"dn"`
	Alt int    `json:"alt" db:"dn_alt"`
}

type GetDnDTO struct {
	FlangeId string `json:"flangeId"`
}

type Size struct {
	Id          string   `json:"id" db:"id"`
	Dn          string   `json:"dn" db:"dn"`
	DnAlt       int      `json:"dnAlt" db:"dn_alt"`
	Pn          string   `json:"pn" db:"pn"`
	PnAlt       string   `json:"pnAlt" db:"pn_alt"`
	D4          string   `json:"d4" db:"d4"`
	D3          string   `json:"d3" db:"d3"`
	D2          string   `json:"d2" db:"d2"`
	D1          string   `json:"d1" db:"d1"`
	Thicknesses []string `json:"thicknesses" db:"h"`
}

type GetSizeDTO struct {
	TypeId string `json:"typeId" db:"type_id"`
	Dn     string `json:"dn" db:"dn"`
}

type SizeDTO struct {
	Id          string   `json:"id" db:"id"`
	TypeId      string   `json:"typeId" db:"type_id"`
	Count       int      `json:"count" db:"count"`
	Dn          string   `json:"dn" db:"dn"`
	DnAlt       int      `json:"dnAlt" db:"dn_alt"`
	Pn          string   `json:"pn" db:"pn"`
	PnAlt       string   `json:"pnAlt" db:"pn_alt"`
	D4          string   `json:"d4" db:"d4"`
	D3          string   `json:"d3" db:"d3"`
	D2          string   `json:"d2" db:"d2"`
	D1          string   `json:"d1" db:"d1"`
	Thicknesses []string `json:"thicknesses" db:"h"`
}

type DeleteSizeDTO struct {
	Id string `json:"id" db:"id"`
}
