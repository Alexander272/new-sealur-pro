package models

type WaveType struct {
	Id          string   `json:"id" db:"id"`
	FlangeId    string   `json:"flangeId" db:"flange_id"`
	BaseId      string   `json:"baseId" db:"base_id"`
	Title       string   `json:"title" db:"title"`
	Code        string   `json:"code" db:"code"`
	BaseCode    string   `json:"baseCode" db:"base_code"`
	Description string   `json:"description" db:"description"`
	Priority    int      `json:"priority" db:"priority"`
	DnRange     []string `json:"dnRange" db:"dn_range"`
	WidthRange  []int64  `json:"widthRange" db:"width_range"`
	HasD4       bool     `json:"hasD4" db:"has_d4"`
	HasD3       bool     `json:"hasD3" db:"has_d3"`
	HasD2       bool     `json:"hasD2" db:"has_d2"`
	HasD1       bool     `json:"hasD1" db:"has_d1"`
}

type GetWaveTypesDTO struct {
	FlangeId string `json:"flangeId"`
}

type WaveTypeDTO struct {
	Id       string   `json:"id" db:"id"`
	FlangeId string   `json:"flangeId" db:"flange_id"`
	BaseId   string   `json:"baseId" db:"base_id"`
	Code     string   `json:"code" db:"code"`
	Priority int      `json:"priority" db:"priority"`
	DnRange  []string `json:"dnRange" db:"dn_range"`
}

type DeleteWaveTypeDTO struct {
	Id string `json:"id" db:"id"`
}
