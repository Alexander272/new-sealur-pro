package pq_models

import "github.com/lib/pq"

type WaveType struct {
	Id          string         `db:"id"`
	FlangeId    string         `db:"flange_id"`
	BaseId      string         `db:"base_id"`
	Title       string         `db:"title"`
	Code        string         `db:"code"`
	Description string         `db:"description"`
	Priority    int            `db:"priority"`
	DnRange     pq.StringArray `db:"dn_range"`
	HasD4       bool           `json:"hasD4" db:"has_d4"`
	HasD3       bool           `json:"hasD3" db:"has_d3"`
	HasD2       bool           `json:"hasD2" db:"has_d2"`
	HasD1       bool           `json:"hasD1" db:"has_d1"`
}

type WaveTypeDTO struct {
	Id          string         `db:"id"`
	FlangeId    string         `db:"flange_id"`
	BaseId      string         `db:"base_id"`
	Title       string         `db:"title"`
	Code        string         `db:"code"`
	Description string         `db:"description"`
	Priority    int            `db:"priority"`
	DnRange     pq.StringArray `db:"dn_range"`
}
