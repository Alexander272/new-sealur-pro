package pq_models

import "github.com/lib/pq"

type WaveType struct {
	Id          string         `db:"id"`
	StandardId  string         `db:"standard_id"`
	BaseId      string         `db:"base_id"`
	Title       string         `db:"title"`
	Code        string         `db:"code"`
	Description string         `db:"description"`
	Priority    int            `db:"priority"`
	DnRange     pq.StringArray `db:"dn_range"`
}

type WaveTypeDTO struct {
	Id          string         `db:"id"`
	StandardId  string         `db:"standard_id"`
	Title       string         `db:"title"`
	Code        string         `db:"code"`
	Description string         `db:"description"`
	Priority    int            `db:"priority"`
	DnRange     pq.StringArray `db:"dn_range"`
}
