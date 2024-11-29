package models

type Info struct {
	Id           string `db:"id" json:"id"`
	HasInnerRing bool   `db:"hasInnerRing" json:"hasInnerRing"`
	HasFrame     bool   `db:"hasFrame" json:"hasFrame"`
	HasOuterRing bool   `db:"hasOuterRing" json:"hasOuterRing"`
	HasHole      bool   `db:"hasHole" json:"hasHole"`
	HasJumper    bool   `db:"hasJumper" json:"hasJumper"`
	HasMounting  bool   `db:"hasMounting" json:"hasMounting"`
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
