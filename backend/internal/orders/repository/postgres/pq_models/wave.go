package pq_models

type PositionWave struct {
	Id              string `db:"id"`
	PositionId      string `db:"position_id"`
	ConfigurationId string `db:"configuration_id"`
	StandardId      string `db:"standard_id"`
	FlangeTypeId    string `db:"flange_type_id"`
	TypeId          string `db:"type_id"`
	ConstructionId  string `db:"construction_id"`
	SizeId          string `db:"size_id"`
	Dn              string `db:"dn"`
	DnAlt           int64  `db:"dn_alt"`
	PnMpa           string `db:"pn_mpa"`
	PnKg            string `db:"pn_kg"`
	D4              string `db:"d4"`
	D3              string `db:"d3"`
	D2              string `db:"d2"`
	D1              string `db:"d1"`
	H               string `db:"h"`
	UseDimensions   bool   `db:"use_dimensions"`
	HasRounding     bool   `db:"has_rounding"`
	PlatingId       string `db:"plating_id"`
	BaseId          string `db:"base_id"`
	RotaryPlugId    string `db:"rotary_plug_id"`
	Jumper          string `db:"jumper"`
	JumperWidth     string `db:"jumper_width"`
	Mounting        string `db:"mounting"`
	HasHole         bool   `db:"has_hole"`
	HasCoating      bool   `db:"has_coating"`
	WithRetainer    bool   `db:"with_retainer"`
	Drawing         string `db:"drawing"`
}

type PositionWaveDTO struct {
	Id              string `db:"id"`
	PositionId      string `db:"position_id"`
	ConfigurationId string `db:"configuration_id"`
	StandardId      string `db:"standard_id"`
	FlangeTypeId    string `db:"flange_type_id"`
	TypeId          string `db:"type_id"`
	ConstructionId  string `db:"construction_id"`
	SizeId          string `db:"size_id"`
	D4              string `db:"d4"`
	D3              string `db:"d3"`
	D2              string `db:"d2"`
	D1              string `db:"d1"`
	H               string `db:"h"`
	UseDimensions   bool   `db:"use_dimensions"`
	HasRounding     bool   `db:"has_rounding"`
	PlatingId       string `db:"plating_id"`
	BaseId          string `db:"base_id"`
	RotaryPlugId    string `db:"rotary_plug_id"`
	Jumper          string `db:"jumper"`
	JumperWidth     string `db:"jumper_width"`
	Mounting        string `db:"mounting"`
	HasHole         bool   `db:"has_hole"`
	HasCoating      bool   `db:"has_coating"`
	WithRetainer    bool   `db:"with_retainer"`
	Drawing         string `db:"drawing"`
}
