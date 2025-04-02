package models

type WaveTypeBase struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasD4       bool   `json:"hasD4" db:"has_d4"`
	HasD3       bool   `json:"hasD3" db:"has_d3"`
	HasD2       bool   `json:"hasD2" db:"has_d2"`
	HasD1       bool   `json:"hasD1" db:"has_d1"`
	// Priority    int    `json:"priority" db:"priority"`
	// DnRange     []string `json:"dnRange" db:"dn_range"`
}

type GetWaveTypeBaseDTO struct{}

type WaveTypeBaseDTO struct {
	Id          string `json:"id" db:"id"`
	Title       string `json:"title" db:"title"`
	Code        string `json:"code" db:"code"`
	Description string `json:"description" db:"description"`
	HasD4       bool   `json:"hasD4" db:"has_d4"`
	HasD3       bool   `json:"hasD3" db:"has_d3"`
	HasD2       bool   `json:"hasD2" db:"has_d2"`
	HasD1       bool   `json:"hasD1" db:"has_d1"`
	// Priority    int    `json:"priority" db:"priority"`
	// DnRange     []string `json:"dnRange" db:"dn_range"`
}

type DeleteWaveTypeBaseDTO struct {
	Id string `json:"id" db:"id"`
}
