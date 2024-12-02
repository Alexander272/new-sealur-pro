package models

type Info struct {
	Id           string `db:"id" json:"id"`
	HasInnerRing bool   `db:"has_inner_ring" json:"hasInnerRing"`
	HasFrame     bool   `db:"has_frame" json:"hasFrame"`
	HasOuterRing bool   `db:"has_outer_ring" json:"hasOuterRing"`
	HasHole      bool   `db:"has_hole" json:"hasHole"`
	HasJumper    bool   `db:"has_jumper" json:"hasJumper"`
	HasMounting  bool   `db:"has_mounting" json:"hasMounting"`
}

type GetInfoDTO struct {
	TypeId string `json:"typeId"`
}

type InfoDTO struct {
	Id           string `json:"id"`
	TypeId       string `json:"typeId"`
	StandardId   string `json:"standardId"`
	HasInnerRing bool   `json:"hasInnerRing"`
	HasFrame     bool   `json:"hasFrame"`
	HasOuterRing bool   `json:"hasOuterRing"`
	HasHole      bool   `json:"hasHole"`
	HasJumper    bool   `json:"hasJumper"`
	HasMounting  bool   `json:"hasMounting"`
}

type DeleteInfoDTO struct {
	Id string `json:"id" binding:"required"`
}
