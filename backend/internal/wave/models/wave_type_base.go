package models

type WaveTypeBase struct {
	Id          string   `json:"id" db:"id"`
	Title       string   `json:"title" db:"title"`
	Code        string   `json:"code" db:"code"`
	Description string   `json:"description" db:"description"`
	Priority    int      `json:"priority" db:"priority"`
	DnRange     []string `json:"dnRange" db:"dn_range"`
}

type GetWaveTypeBaseDTO struct{}

type WaveTypeBaseDTO struct {
	Id          string   `json:"id" db:"id"`
	Title       string   `json:"title" db:"title"`
	Code        string   `json:"code" db:"code"`
	Description string   `json:"description" db:"description"`
	Priority    int      `json:"priority" db:"priority"`
	DnRange     []string `json:"dnRange" db:"dn_range"`
}

type DeleteWaveTypeBaseDTO struct {
	Id string `json:"id" db:"id"`
}
