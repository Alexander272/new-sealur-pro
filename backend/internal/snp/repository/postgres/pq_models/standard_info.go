package pq_models

type StandardInfo struct {
	Id            string `db:"id"`
	DnTitle       string `db:"dn_title"`
	PnTitle       string `db:"pn_title"`
	HasD2         bool   `db:"has_d2"`
	StandardId    string `db:"standard_id"`
	StandardTitle string `db:"standard_title"`
	FlangeId      string `db:"flange_standard_id"`
	FlangeTitle   string `db:"flange_title"`
	FlangeCode    string `db:"flange_code"`
}
