package pg_models

import "github.com/lib/pq"

type Size struct {
	Id    string         `db:"id"`
	Dn    string         `db:"dn"`
	DnAlt int            `db:"dn_alt"`
	Pn    string         `db:"pn"`
	PnAlt string         `db:"pn_alt"`
	D4    string         `db:"d4"`
	D3    string         `db:"d3"`
	D2    string         `db:"d2"`
	D1    string         `db:"d1"`
	H     pq.StringArray `db:"h"`
}

type SizeDTO struct {
	Id                 string         `db:"id"`
	FlangeTypeId       string         `db:"flange_type_id"`
	BaseConstructionId string         `db:"base_construction_id"`
	BaseFillerId       pq.StringArray `db:"base_fillers_id"`
	Count              int64          `db:"count"`
	Dn                 string         `db:"dn"`
	DnAlt              int            `db:"dn_alt"`
	Pn                 string         `db:"pn"`
	PnAlt              string         `db:"pn_alt"`
	D4                 string         `db:"d4"`
	D3                 string         `db:"d3"`
	D2                 string         `db:"d2"`
	D1                 string         `db:"d1"`
	H                  pq.StringArray `db:"h"`
}

// DEPRECATED
type OldSize struct {
	Id    string         `db:"id"`
	Dn    string         `db:"dn"`
	DnMm  string         `db:"dn_mm"`
	PnMpa pq.StringArray `db:"pn_mpa"`
	PnKg  pq.StringArray `db:"pn_kg"`
	D4    string         `db:"d4"`
	D3    string         `db:"d3"`
	D2    string         `db:"d2"`
	D1    string         `db:"d1"`
	H     pq.StringArray `db:"h"`
}

type OldSizeDTO struct {
	Id                 string         `db:"id"`
	FlangeTypeId       string         `db:"putg_flange_type_id"`
	BaseConstructionId string         `db:"base_construction_id"`
	BaseFillerId       pq.StringArray `db:"base_fillers_id"`
	Count              int64          `db:"count"`
	Dn                 string         `db:"dn"`
	DnMm               string         `db:"dn_mm"`
	PnMpa              pq.StringArray `db:"pn_mpa"`
	PnKg               pq.StringArray `db:"pn_kg"`
	D4                 string         `db:"d4"`
	D3                 string         `db:"d3"`
	D2                 string         `db:"d2"`
	D1                 string         `db:"d1"`
	H                  pq.StringArray `db:"h"`
}
