package pq_models

import "github.com/lib/pq"

type ConstructionDTO struct {
	Id           string         `db:"id"`
	Title        string         `db:"title"`
	Code         string         `db:"code"`
	Description  string         `db:"description"`
	AllowedTypes pq.StringArray `db:"allowed_types"`
	HasMaterial  bool           `db:"has_material"`
}
