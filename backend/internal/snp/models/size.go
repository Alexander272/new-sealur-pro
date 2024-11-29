package models

type GroupedSize struct {
	Id    string  `json:"id"`
	Dn    string  `json:"dn"`
	DnMm  string  `json:"dnMm"`
	D2    string  `json:"d2"`
	Sizes []*Size `json:"sizes"`
}

type Size struct {
	Pn []*Pn    `json:"pn"`
	D4 string   `json:"d4"`
	D3 string   `json:"d3"`
	D2 string   `json:"d2"`
	D1 string   `json:"d1"`
	H  []string `json:"h"`
	S2 []string `json:"s2"`
	S3 []string `json:"s3"`
}

type Pn struct {
	Mpa string `json:"mpa"`
	Kg  string `json:"kg"`
}

type GetGroupedSize struct {
	TypeId string `json:"typeId"`
	HasD2  bool   `json:"hasD2"`
}

type SizeDTO struct {
	Id        string   `json:"id"`
	SnpTypeId string   `json:"snpTypeId"`
	Count     int64    `json:"count"`
	Dn        string   `json:"dn"`
	DnMm      string   `json:"dnMm"`
	Pn        []*Pn    `json:"pn"`
	D4        string   `json:"d4"`
	D3        string   `json:"d3"`
	D2        string   `json:"d2"`
	D1        string   `json:"d1"`
	H         []string `json:"h"`
	S2        []string `json:"s2"`
	S3        []string `json:"s3"`
}

type DeleteSizeDTO struct {
	Id string `json:"id" binding:"required"`
}
