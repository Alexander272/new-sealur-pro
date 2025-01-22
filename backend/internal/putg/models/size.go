package models

type GroupedSize struct {
	Id    string  `json:"id"`
	Dn    string  `json:"dn"`
	DnMm  string  `json:"dnMm"`
	Sizes []*Size `json:"sizes"`
}

type Size struct {
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
	DnMm               string   `json:"dnMm"`
	Pn                 []*Pn    `json:"pn"`
	D4                 string   `json:"d4"`
	D3                 string   `json:"d3"`
	D2                 string   `json:"d2"`
	D1                 string   `json:"d1"`
	H                  []string `json:"h"`
}

type DeleteSizeDTO struct {
	Id string `json:"id" binding:"required"`
}
