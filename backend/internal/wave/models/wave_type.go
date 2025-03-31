package models

type WaveType struct {
	Id          string   `json:"id" db:"id"`
	StandardId  string   `json:"standardId" db:"standard_id"`
	BaseId      string   `json:"baseId" db:"base_id"`
	Title       string   `json:"title" db:"title"`
	Code        string   `json:"code" db:"code"`
	Description string   `json:"description" db:"description"`
	Priority    int      `json:"priority" db:"priority"`
	DnRange     []string `json:"dnRange" db:"dn_range"`
}

type GetWaveTypesDTO struct {
	StandardId string `json:"standardId"`
}

type WaveTypeDTO struct {
	Id         string `json:"id" db:"id"`
	StandardId string `json:"standardId" db:"standard_id"`
	BaseId     string `json:"baseId" db:"base_id"`
	Priority   int    `json:"priority" db:"priority"`
}

type DeleteWaveTypeDTO struct {
	Id string `json:"id" db:"id"`
}
