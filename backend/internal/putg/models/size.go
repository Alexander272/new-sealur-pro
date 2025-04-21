package models

type GetDnDTO struct {
	FlangeTypeId       string `json:"flangeTypeId"`
	BaseConstructionId string `json:"baseConstructionId"`
	BaseFillerId       string `json:"baseFillerId"`
}

type GetSizeDTO struct {
	FlangeTypeId       string `json:"flangeTypeId"`
	BaseConstructionId string `json:"baseConstructionId"`
	BaseFillerId       string `json:"baseFillerId"`
	Dn                 string `json:"dn"`
}

type Dn struct {
	Dn  string `json:"dn" db:"dn"`
	Alt int    `json:"alt" db:"dn_alt"`
}

type Size struct {
	Id    string   `json:"id"`
	Dn    string   `json:"dn"`
	DnAlt int      `json:"dnAlt"`
	Pn    string   `json:"pn"`
	PnAlt string   `json:"pnAlt"`
	D4    string   `json:"d4"`
	D3    string   `json:"d3"`
	D2    string   `json:"d2"`
	D1    string   `json:"d1"`
	H     []string `json:"h"`
}

type GroupedSize struct {
	Id    string      `json:"id"`
	Dn    string      `json:"dn"`
	DnMm  string      `json:"dnMm"`
	Sizes []*SizeItem `json:"sizes"`
}

type SizeItem struct {
	Id string   `json:"id"`
	Pn []*Pn    `json:"pn"`
	D4 string   `json:"d4"`
	D3 string   `json:"d3"`
	D2 string   `json:"d2"`
	D1 string   `json:"d1"`
	H  []string `json:"h"`
}

type Pn struct {
	Mpa string `json:"mpa"`
	Kg  string `json:"kg"`
}

type GetGroupedSizeDTO struct {
	FlangeTypeId       string `json:"flangeTypeId"`
	BaseConstructionId string `json:"baseConstructionId"`
	BaseFillerId       string `json:"baseFillerId"`
}

type SizeDTO struct {
	Id                 string   `json:"id"`
	FlangeTypeId       string   `json:"flangeTypeId"`
	BaseConstructionId string   `json:"baseConstructionId"`
	BaseFillerId       []string `json:"baseFillerId"`
	Count              int64    `json:"count"`
	Dn                 string   `json:"dn"`
	DnAlt              int      `json:"dnAlt"`
	Pn                 string   `json:"pn"`
	PnAlt              string   `json:"pnAlt"`
	D4                 string   `json:"d4"`
	D3                 string   `json:"d3"`
	D2                 string   `json:"d2"`
	D1                 string   `json:"d1"`
	H                  []string `json:"h"`
}

type DeleteSizeDTO struct {
	Id string `json:"id" binding:"required"`
}
