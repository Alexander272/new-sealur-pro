package pq_models

import "github.com/lib/pq"

type BasePositionPutg struct {
	Id                string         `db:"id"`
	Title             string         `db:"title"`
	Amount            string         `db:"amount"`
	Type              string         `db:"type"`
	Count             int64          `db:"count"`
	Info              string         `db:"info"`
	ConfigurationId   string         `db:"configuration_id"`
	ConfigurationCode string         `db:"configuration_code"`
	FillerCode        string         `db:"filler_code"`
	TypeCode          string         `db:"type_code"`
	ConstructionCode  string         `db:"construction_code"`
	ArrMaterials      pq.StringArray `db:"arr_mat_code"`
	RotaryPlugId      string         `db:"rotary_plug_id"`
	InnerRingId       string         `db:"inner_ring_id"`
	OuterRingId       string         `db:"outer_ring_id"`
	D4                string         `db:"d4"`
	D3                string         `db:"d3"`
	D2                string         `db:"d2"`
	D1                string         `db:"d1"`
	H                 string         `db:"h"`
	UseDimensions     bool           `db:"use_dimensions"`
	HasRounding       bool           `db:"has_rounding"`
	Jumper            string         `db:"jumper"`
	JumperWidth       string         `db:"jumper_width"`
	Mounting          string         `db:"mounting"`
	HasHole           bool           `db:"has_hole"`
	HasCoating        bool           `db:"has_coating"`
	HasRemovable      bool           `db:"has_removable"`
	Drawing           string         `db:"drawing"`
}

type PositionPutg struct {
	Id              string `db:"id"`
	PositionId      string `db:"position_id"`
	PutgStandardId  string `db:"putg_standard_id"`
	FlangeTypeId    string `db:"flange_type_id"`
	ConfigurationId string `db:"configuration_id"`
	SizeId          string `db:"size_id"`
	PnIndex         int    `db:"pn_index"`
	Dn              string `db:"dn"`
	DnMm            string `db:"dn_mm"`
	PnMpa           string `db:"pn_mpa"`
	PnKg            string `db:"pn_kg"`
	D4              string `db:"d4"`
	D3              string `db:"d3"`
	D2              string `db:"d2"`
	D1              string `db:"d1"`
	H               string `db:"h"`
	UseDimensions   bool   `db:"use_dimensions"`
	HasRounding     bool   `db:"has_rounding"`
	FillerId        string `db:"filler_id"`
	TypeId          string `db:"type_id"`
	ConstructionId  string `db:"construction_id"`
	RotaryPlugId    string `db:"rotary_plug_id"`
	InnerRingId     string `db:"inner_ring_id"`
	OuterRingId     string `db:"outer_ring_id"`
	Jumper          string `db:"jumper"`
	JumperWidth     string `db:"jumper_width"`
	Mounting        string `db:"mounting"`
	HasHole         bool   `db:"has_hole"`
	HasCoating      bool   `db:"has_coating"`
	HasRemovable    bool   `db:"has_removable"`
	Drawing         string `db:"drawing"`
}

type PositionPutgDTO struct {
	Id              string `db:"id"`
	PositionId      string `db:"position_id"`
	PutgStandardId  string `db:"putg_standard_id"`
	FlangeTypeId    string `db:"flange_type_id"`
	ConfigurationId string `db:"configuration_id"`
	SizeId          string `db:"size_id"`
	PnIndex         int    `db:"pn_index"`
	D4              string `db:"d4"`
	D3              string `db:"d3"`
	D2              string `db:"d2"`
	D1              string `db:"d1"`
	H               string `db:"h"`
	UseDimensions   bool   `db:"use_dimensions"`
	HasRounding     bool   `db:"has_rounding"`
	FillerId        string `db:"filler_id"`
	TypeId          string `db:"type_id"`
	ConstructionId  string `db:"construction_id"`
	RotaryPlugId    string `db:"rotary_plug_id"`
	InnerRingId     string `db:"inner_ring_id"`
	OuterRingId     string `db:"outer_ring_id"`
	Jumper          string `db:"jumper"`
	JumperWidth     string `db:"jumper_width"`
	Mounting        string `db:"mounting"`
	HasHole         bool   `db:"has_hole"`
	HasCoating      bool   `db:"has_coating"`
	HasRemovable    bool   `db:"has_removable"`
	Drawing         string `db:"drawing"`
}
