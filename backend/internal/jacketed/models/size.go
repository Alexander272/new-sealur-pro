package models

type Dn struct {
	Dn  string `json:"dn" db:"dn"`
	Alt int    `json:"alt" db:"dn_alt"`
}

type GetDnDTO struct {
	FlangeId string `json:"flangeId"`
}

type Size struct {
	Id    string `json:"id" db:"id"`
	Dn    string `json:"dn" db:"dn"`
	DnAlt int    `json:"dnAlt" db:"dn_alt"`
	Pn    string `json:"pn" db:"pn"`
	PnAlt string `json:"pnAlt" db:"pn_alt"`
	D4    string `json:"d4" db:"d4"`
	D3    string `json:"d3" db:"d3"`
	D2    string `json:"d2" db:"d2"`
	D1    string `json:"d1" db:"d1"`
}

type GetSizeDTO struct {
	FlangeId string `json:"flangeId" db:"flange_id"`
	Dn       string `json:"dn" db:"dn"`
}

type SizeDTO struct {
	Id       string `json:"id" db:"id"`
	FlangeId string `json:"flangeId" db:"flange_id"`
	Count    int    `json:"count" db:"count"`
	Dn       string `json:"dn" db:"dn"`
	DnAlt    int    `json:"dnAlt" db:"dn_alt"`
	Pn       string `json:"pn" db:"pn"`
	PnAlt    string `json:"pnAlt" db:"pn_alt"`
	D4       string `json:"d4" db:"d4"`
	D3       string `json:"d3" db:"d3"`
	D2       string `json:"d2" db:"d2"`
	D1       string `json:"d1" db:"d1"`
}

type DeleteSizeDTO struct {
	Id string `json:"id" db:"id"`
}
