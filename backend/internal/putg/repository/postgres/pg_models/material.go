package pg_models

type Material struct {
	Id         string `db:"id"`
	MaterialId string `db:"material_id"`
	Type       string `db:"type"`
	IsDefault  bool   `db:"is_default"`
	Code       string `db:"code"`
	IsStandard bool   `db:"is_standard"`
	BaseCode   string `db:"base_code"`
	Title      string `db:"title"`
}
