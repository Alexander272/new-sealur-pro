package models

type Info struct {
	Id           string `json:"id" db:"id"`
	StandardId   string `json:"standardId" db:"standard_id"`
	HasJumper    bool   `json:"hasJumper" db:"has_jumper"`
	HasHole      bool   `json:"hasHole" db:"has_hole"`
	HasCoating   bool   `json:"hasCoating" db:"has_coating"`
	WithRetainer bool   `json:"withRetainer" db:"with_retainer"`
}

type GetInfoDTO struct {
	StandardId string `json:"standardId" db:"standard_id"`
}

type InfoDTO struct {
	Id           string `json:"id"`
	StandardId   string `json:"standardId"`
	HasJumper    bool   `json:"hasJumper"`
	HasHole      bool   `json:"hasHole"`
	HasCoating   bool   `json:"hasCoating"`
	WithRetainer bool   `json:"withRetainer"`
}

type DeleteInfoDTO struct {
	Id string `json:"id"`
}
