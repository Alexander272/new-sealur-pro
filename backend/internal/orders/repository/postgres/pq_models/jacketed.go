package pq_models

type BasePositionJacketed struct {
	Id               string `db:"id"`
	Title            string `db:"title"`
	Amount           string `db:"amount"`
	Type             string `db:"type"`
	Count            int64  `db:"count"`
	Info             string `db:"info"`
	TypeCode         string `db:"type_code"`
	ConstructionCode string `db:"construction_code"`
	FillerCode       string `db:"filler_code"`
	ShellId          string `db:"shell_id"`
	ShellCode        string `db:"shell_code"`
	D4               string `db:"d4"`
	D3               string `db:"d3"`
	D2               string `db:"d2"`
	D1               string `db:"d1"`
	H                string `db:"h"`
	Jumper           string `db:"jumper"`
	JumperWidth      string `db:"jumper_width"`
	Drawing          string `db:"drawing"`
}

type PositionJacketed struct {
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
	FillerId       string `db:"filler_id"`
	ShellId        string `db:"shell_id"`
	Jumper         string `db:"jumper"`
	JumperWidth    string `db:"jumper_width"`
	Drawing        string `db:"drawing"`
}

type PositionJacketedDTO struct {
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
	FillerId       string `db:"filler_id"`
	ShellId        string `db:"shell_id"`
	Jumper         string `db:"jumper"`
	JumperWidth    string `db:"jumper_width"`
	Drawing        string `db:"drawing"`
}
