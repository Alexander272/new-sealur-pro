package pq_models

import "github.com/lib/pq"

type NewSize struct {
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
	S2    pq.StringArray `db:"s2"`
	S3    pq.StringArray `db:"s3"`
}

type Size struct {
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
	S2    pq.StringArray `db:"s2"`
	S3    pq.StringArray `db:"s3"`
}
