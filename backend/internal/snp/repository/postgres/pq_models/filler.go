package pq_models

import "github.com/lib/pq"

type Filler struct {
	Id            string         `db:"id"`
	Temperature   string         `db:"temperature"`
	BaseCode      string         `db:"base_code"`
	Code          string         `db:"code"`
	Title         string         `db:"title"`
	Description   string         `db:"description"`
	Designation   string         `db:"designation"`
	DisabledTypes pq.StringArray `db:"disabled_types"`
}
