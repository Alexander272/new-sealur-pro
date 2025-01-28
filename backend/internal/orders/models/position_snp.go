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
	FlangeTypeCode  string                   `json:"flangeTypeCode"`
	FlangeTypeTitle string                   `json:"flangeTypeTitle"`
	SnpStandard     *snp_models.StandardInfo `json:"snpStandard"`
	SnpType         *snp_models.SnpType      `json:"snpType"`
}

type PositionSnp_Size struct {
	Id      string         `json:"id"`
	Dn      string         `json:"dn"`
	DnMm    string         `json:"dnMm"`
	Pn      *snp_models.Pn `json:"pn"`
	D4      string         `json:"d4"`
	D3      string         `json:"d3"`
	D2      string         `json:"d2"`
	D1      string         `json:"d1"`
	H       string         `json:"h"`
	S2      string         `json:"s2"`
	S3      string         `json:"s3"`
	Another string         `json:"another"`
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
	SizeId  string `json:"sizeId"`
	PnIndex int    `json:"pnIndex"`
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
	HasHole  bool                          `json:"hasHole"`
	Mounting string                        `json:"mounting"`
	Drawing  string                        `json:"drawing"`
}
type PositionSnpDTO_Design_Jumper struct {
	Code  string `json:"code"`
	Width string `json:"width"`
}

// type PositionSnpDTO_Main struct {
// 	Id              string `json:"id" db:"id"`
// 	SnpStandardId   string `json:"snpStandardId" db:"snp_standard_id"`
// 	SnpTypeId       string `json:"snpTypeId" db:"snp_type_id"`
// 	FlangeTypeCode  string `json:"flangeTypeCode" db:"flange_type_code"`
// 	FlangeTypeTitle string `json:"flangeTypeTitle" db:"flange_type_title"`
// }

// type PositionSnpDTO_Size struct {
// 	Id string `json:"id" db:"id"`
// 	//TODO может можно использовать id размера и индексы на элементы представленные массивами
// 	Dn      string         `json:"dn" db:"dn"`
// 	DnMm    string         `json:"dnMm" db:"dn_mm"`
// 	Pn      *snp_models.Pn `json:"pn" db:"pn"`
// 	D4      string         `json:"d4" db:"d4"`
// 	D3      string         `json:"d3" db:"d3"`
// 	D2      string         `json:"d2" db:"d2"`
// 	D1      string         `json:"d1" db:"d1"`
// 	H       string         `json:"h" db:"h"`
// 	S2      string         `json:"s2" db:"s2"`
// 	S3      string         `json:"s3" db:"s3"`
// 	Another string         `json:"another" db:"another"`
// }

// type PositionSnpDTO_Material struct {
// 	Id        string               `json:"id" db:"id"`
// 	Filler    *snp_models.Material `json:"filler"`
// 	InnerRing *snp_models.Material `json:"innerRing"`
// 	OuterRing *snp_models.Material `json:"outerRing"`
// 	Frame     *snp_models.Material `json:"frame"`
// }

// type PositionSnpDTO_Design struct {
// 	Id           string                          `json:"id"`
// 	Jumper       *PositionSnpDTO_Design_Jumper   `json:"jumper,omitempty"`
// 	HasHole      bool                            `json:"hasHole"`
// 	HasCoating   bool                            `json:"hasCoating"`
// 	HasRemovable bool                            `json:"hasRemovable"`
// 	Mounting     *PositionSnpDTO_Design_Mounting `json:"mounting,omitempty"`
// 	Drawing      string                          `json:"drawing"`
// }
// type PositionSnpDTO_Design_Jumper struct {
// 	HasJumper bool   `json:"hasJumper"`
// 	Code      string `json:"code"`
// 	Width     string `json:"width"`
// }
// type PositionSnpDTO_Design_Mounting struct {
// 	HasMounting bool   `json:"hasMounting"`
// 	Code        string `json:"code"`
// }
