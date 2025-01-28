package pq_models

import "github.com/lib/pq"

// type PositionSnp struct {
// 	Id         string `db:"id"`
// 	PositionId string `db:"position_id"`

// 	SnpStandardId   string `db:"snp_standard_id"`
// 	SnpTypeId       string `db:"snp_type_id"`
// 	FlangeTypeCode  string `db:"flange_type_code"`
// 	FlangeTypeTitle string `db:"flange_type_title"`

// 	Dn      string `db:"dn"`
// 	DnMm    string `db:"dn_mm"`
// 	PnMpa   string `db:"pn_mpa"`
// 	PnKg    string `db:"pn_kg"`
// 	D4      string `db:"d4"`
// 	D3      string `db:"d3"`
// 	D2      string `db:"d2"`
// 	D1      string `db:"d1"`
// 	H       string `db:"h"`
// 	S2      string `db:"s2"`
// 	S3      string `db:"s3"`
// 	Another string `db:"another"`

// 	FillerId       string `db:"filler_id"`
// 	FrameId        string `db:"frame_id"`
// 	InnerRingId    string `db:"inner_ring_id"`
// 	OuterRingId    string `db:"outer_ring_id"`
// 	FillerCode     string `db:"filler_code"`
// 	FrameCode      string `db:"frame_code"`
// 	InnerRingCode  string `db:"inner_ring_code"`
// 	OuterRingCode  string `db:"outer_ring_code"`
// 	FrameTitle     string `db:"frame_title"`
// 	InnerRingTitle string `db:"inner_ring_title"`
// 	OuterRingTitle string `db:"outer_ring_title"`

// 	HasJumper    bool   `db:"has_jumper"`
// 	JumperCode   string `db:"jumper_code"`
// 	JumperWidth  string `db:"jumper_width"`
// 	HasHole      bool   `db:"has_hole"`
// 	HasMounting  bool   `db:"has_mounting"`
// 	MountingCode string `db:"mounting_code"`
// 	Drawing      string `db:"drawing"`
// }

type PositionSnp struct {
	Id            string         `db:"id"`
	PositionId    string         `db:"position_id"`
	SnpStandardId string         `db:"snp_standard_id"`
	SnpTypeId     string         `db:"snp_type_id"`
	FlangeTypeId  string         `db:"flange_type_id"`
	SizeId        string         `db:"size_id"`
	PnIndex       int            `db:"pn_index"`
	HIndex        int            `db:"h_index"`
	Another       string         `db:"another"`
	D4            string         `db:"d4"`
	D3            string         `db:"d3"`
	D2            string         `db:"d2"`
	D1            string         `db:"d1"`
	H             string         `db:"h"`
	FillerId      string         `db:"filler_id"`
	FillerCode    string         `db:"filler_code"`
	ArrMaterials  pq.StringArray `db:"arr_mat_code"`
	FrameId       string         `db:"frame_id"`
	InnerRingId   string         `db:"inner_ring_id"`
	OuterRingId   string         `db:"outer_ring_id"`
	Jumper        string         `db:"jumper"`
	JumperWidth   string         `db:"jumper_width"`
	HasHole       bool           `db:"has_hole"`
	Mounting      string         `db:"mounting"`
	Drawing       string         `db:"drawing"`
}

type PositionSnpDTO struct {
	Id            string `db:"id"`
	PositionId    string `db:"position_id"`
	SnpStandardId string `db:"snp_standard_id"`
	SnpTypeId     string `db:"snp_type_id"`
	FlangeTypeId  string `db:"flange_type_id"`
	SizeId        string `db:"size_id"`
	PnIndex       int    `db:"pn_index"`
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
