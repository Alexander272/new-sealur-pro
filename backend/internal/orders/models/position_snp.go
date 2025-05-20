package models

import snp_models "github.com/Alexander272/new-sealur-pro/internal/snp/models"

type PositionSnp struct {
	Main     *PositionSnp_Main     `json:"main"`
	Size     *PositionSnp_Size     `json:"size"`
	Material *PositionSnp_Material `json:"material"`
	Design   *PositionSnp_Design   `json:"design"`
}

type PositionSnp_Main struct {
	Id              string                   `json:"id"`
	SnpStandardId   string                   `json:"snpStandardId"`
	SnpTypeId       string                   `json:"snpTypeId"`
	FlangeTypeId    string                   `json:"flangeTypeId"`
	FlangeTypeCode  string                   `json:"flangeTypeCode"`
	FlangeTypeTitle string                   `json:"flangeTypeTitle"`
	SnpStandard     *snp_models.StandardInfo `json:"snpStandard"`
	SnpType         *snp_models.SnpType      `json:"snpType"`
}

type PositionSnp_Size struct {
	Id      string `json:"id"`
	Dn      string `json:"dn"`
	DnAlt   int    `json:"dnAlt"`
	Pn      string `json:"pn"`
	PnAlt   string `json:"pnAlt"`
	D4      string `json:"d4"`
	D3      string `json:"d3"`
	D2      string `json:"d2"`
	D1      string `json:"d1"`
	H       string `json:"h"`
	HIndex  int    `json:"hIndex"`
	S2      string `json:"s2"`
	S3      string `json:"s3"`
	Another string `json:"another"`
}

type PositionSnp_Material struct {
	Filler    *snp_models.Filler   `json:"filler"`
	InnerRing *snp_models.Material `json:"innerRing"`
	OuterRing *snp_models.Material `json:"outerRing"`
	Frame     *snp_models.Material `json:"frame"`
}

type PositionSnp_Design struct {
	Jumper   *PositionSnp_Design_Jumper   `json:"jumper,omitempty"`
	Mounting *PositionSnp_Design_Mounting `json:"mounting"`
	HasHole  bool                         `json:"hasHole"`
	Drawing  string                       `json:"drawing"`
}
type PositionSnp_Design_Jumper struct {
	HasJumper bool   `json:"hasJumper"`
	Code      string `json:"code"`
	Width     string `json:"width"`
}
type PositionSnp_Design_Mounting struct {
	HasMounting bool   `json:"hasMounting"`
	Code        string `json:"code"`
}

type PositionSnpDTO struct {
	Id         string                   `json:"id"`
	PositionId string                   `json:"positionId"`
	Main       *PositionSnpDTO_Main     `json:"main"`
	Size       *PositionSnpDTO_Size     `json:"size"`
	Material   *PositionSnpDTO_Material `json:"material"`
	Design     *PositionSnpDTO_Design   `json:"design"`
}

type PositionSnpDTO_Main struct {
	SnpStandardId string `json:"snpStandardId"`
	SnpTypeId     string `json:"snpTypeId"`
	FlangeTypeId  string `json:"flangeTypeId"`
}

type PositionSnpDTO_Size struct {
	SizeId  string `json:"id"`
	HIndex  int    `json:"hIndex"`
	Another string `json:"another"`
	D4      string `json:"d4"`
	D3      string `json:"d3"`
	D2      string `json:"d2"`
	D1      string `json:"d1"`
}

type PositionSnpDTO_Material struct {
	FillerId    string `json:"fillerId"`
	FrameId     string `json:"frameId"`
	InnerRingId string `json:"innerRingId"`
	OuterRingId string `json:"outerRingId"`
}

type PositionSnpDTO_Design struct {
	Jumper   *PositionSnpDTO_Design_Jumper `json:"jumper"`
	Mounting string                        `json:"mounting"`
	HasHole  bool                          `json:"hasHole"`
	Drawing  string                        `json:"drawing"`
}
type PositionSnpDTO_Design_Jumper struct {
	Code  string `json:"code"`
	Width string `json:"width"`
}
type PositionSnpDTO_Design_Mounting struct {
	HasMounting bool   `json:"hasMounting"`
	Code        string `json:"code"`
}
