package pq_models

import "github.com/lib/pq"

type BasePositionSerrated struct {
	Id               string         `db:"id"`
	Title            string         `db:"title"`
	Amount           string         `db:"amount"`
	Type             string         `db:"type"`
	Count            int64          `db:"count"`
	Info             string         `db:"info"`
	TypeCode         string         `db:"type_code"`
	ConstructionCode string         `db:"construction_code"`
	PlatingCode      string         `db:"plating_code"`
	ArrMaterials     pq.StringArray `db:"arr_mat_code"`
	BaseId           string         `db:"base_id"`
	RotaryPlugId     string         `db:"rotary_plug_id"`
	D4               string         `db:"d4"`
	D3               string         `db:"d3"`
	D2               string         `db:"d2"`
	D1               string         `db:"d1"`
	H                string         `db:"h"`
	Jumper           string         `db:"jumper"`
	JumperWidth      string         `db:"jumper_width"`
	HasHole          bool           `db:"has_hole"`
	HasCoating       bool           `db:"has_coating"`
	WithRetainer     bool           `db:"with_retainer"`
	Drawing          string         `db:"drawing"`
}

type PositionSerrated struct {
	Id             string `db:"id"`
	PositionId     string `db:"position_id"`
	StandardId     string `db:"standard_id"`
	FlangeTypeId   string `db:"flange_type_id"`
	TypeId         string `db:"type_id"`
	ConstructionId string `db:"construction_id"`
	SizeId         string `db:"size_id"`
	Dn             string `db:"dn"`
	DnAlt          int64  `db:"dn_alt"`
	Pn             string `db:"pn"`
	PnAlt          string `db:"pn_alt"`
	D4             string `db:"d4"`
	D3             string `db:"d3"`
	D2             string `db:"d2"`
	D1             string `db:"d1"`
	H              string `db:"h"`
	PlatingId      string `db:"plating_id"`
	BaseId         string `db:"base_id"`
	RotaryPlugId   string `db:"rotary_plug_id"`
	Jumper         string `db:"jumper"`
	JumperWidth    string `db:"jumper_width"`
	HasHole        bool   `db:"has_hole"`
	HasCoating     bool   `db:"has_coating"`
	WithRetainer   bool   `db:"with_retainer"`
	Drawing        string `db:"drawing"`
}

type PositionSerratedDTO struct {
	Id             string `db:"id"`
	PositionId     string `db:"position_id"`
	StandardId     string `db:"standard_id"`
	FlangeTypeId   string `db:"flange_type_id"`
	TypeId         string `db:"type_id"`
	ConstructionId string `db:"construction_id"`
	SizeId         string `db:"size_id"`
	D4             string `db:"d4"`
	D3             string `db:"d3"`
	D2             string `db:"d2"`
	D1             string `db:"d1"`
	H              string `db:"h"`
	PlatingId      string `db:"plating_id"`
	BaseId         string `db:"base_id"`
	RotaryPlugId   string `db:"rotary_plug_id"`
	Jumper         string `db:"jumper"`
	JumperWidth    string `db:"jumper_width"`
	HasHole        bool   `db:"has_hole"`
	HasCoating     bool   `db:"has_coating"`
	WithRetainer   bool   `db:"with_retainer"`
	Drawing        string `db:"drawing"`
}
