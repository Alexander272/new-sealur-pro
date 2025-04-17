package pq_models

import "github.com/lib/pq"

type BasePositionSnp struct {
	Id           string         `db:"id"`
	Title        string         `db:"title"`
	Amount       string         `db:"amount"`
	Type         string         `db:"type"`
	Count        int64          `db:"count"`
	Info         string         `db:"info"`
	FillerCode   string         `db:"filler_code"`
	ArrMaterials pq.StringArray `db:"arr_mat_code"`
	FrameId      string         `db:"frame_id"`
	InnerRingId  string         `db:"inner_ring_id"`
	OuterRingId  string         `db:"outer_ring_id"`
	D4           string         `db:"d4"`
	D3           string         `db:"d3"`
	D2           string         `db:"d2"`
	D1           string         `db:"d1"`
	H            string         `db:"h"`
	Another      string         `db:"another"`
	Jumper       string         `db:"jumper"`
	JumperWidth  string         `db:"jumper_width"`
	HasHole      bool           `db:"has_hole"`
	Mounting     string         `db:"mounting"`
	Drawing      string         `db:"drawing"`
}

type PositionSnp struct {
	Id              string         `db:"id"`
	PositionId      string         `db:"position_id"`
	SnpStandardId   string         `db:"snp_standard_id"`
	SnpTypeId       string         `db:"snp_type_id"`
	FlangeTypeId    string         `db:"flange_type_id"`
	FlangeTypeCode  string         `db:"flange_type_code"`
	FlangeTypeTitle string         `db:"flange_type_title"`
	SizeId          string         `db:"size_id"`
	HIndex          int            `db:"h_index"`
	Another         string         `db:"another"`
	Dn              string         `db:"dn"`
	DnAlt           int            `db:"dn_alt"`
	Pn              string         `db:"pn"`
	PnAlt           string         `db:"pn_alt"`
	D4              string         `db:"d4"`
	D3              string         `db:"d3"`
	D2              string         `db:"d2"`
	D1              string         `db:"d1"`
	H               string         `db:"h"`
	S2              string         `db:"s2"`
	S3              string         `db:"s3"`
	FillerId        string         `db:"filler_id"`
	FillerCode      string         `db:"filler_code"`
	ArrMaterials    pq.StringArray `db:"arr_mat_code"`
	FrameId         string         `db:"frame_id"`
	InnerRingId     string         `db:"inner_ring_id"`
	OuterRingId     string         `db:"outer_ring_id"`
	Jumper          string         `db:"jumper"`
	JumperWidth     string         `db:"jumper_width"`
	HasHole         bool           `db:"has_hole"`
	Mounting        string         `db:"mounting"`
	Drawing         string         `db:"drawing"`
}

type PositionSnpDTO struct {
	Id            string `db:"id"`
	PositionId    string `db:"position_id"`
	SnpStandardId string `db:"snp_standard_id"`
	SnpTypeId     string `db:"snp_type_id"`
	FlangeTypeId  string `db:"flange_type_id"`
	SizeId        string `db:"size_id"`
	HIndex        int    `db:"h_index"`
	D4            string `db:"d4"`
	D3            string `db:"d3"`
	D2            string `db:"d2"`
	D1            string `db:"d1"`
	Another       string `db:"another"`
	FillerId      string `db:"filler_id"`
	FrameId       string `db:"frame_id"`
	InnerRingId   string `db:"inner_ring_id"`
	OuterRingId   string `db:"outer_ring_id"`
	Jumper        string `db:"jumper"`
	JumperWidth   string `db:"jumper_width"`
	HasHole       bool   `db:"has_hole"`
	Mounting      string `db:"mounting"`
	Drawing       string `db:"drawing"`
}
