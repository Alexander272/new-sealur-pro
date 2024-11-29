package models

import base "github.com/Alexander272/new-sealur-pro/internal/models"

type StandardInfo struct {
	Id             string               `db:"id" json:"id"`
	DnTitle        string               `db:"dn_title" json:"dnTitle"`
	PnTitle        string               `db:"pn_title" json:"pnTitle"`
	HasD2          bool                 `db:"has_d2" json:"hasD2"`
	Standard       *base.Standard       `json:"standard"`
	FlangeStandard *base.FlangeStandard `json:"flangeStandard"`
}

type GetStandardInfoDTO struct{}

type StandardInfoDTO struct {
	Id               string `json:"id" db:"id"`
	DnTitle          string `json:"dnTitle" db:"dn_title"`
	PnTitle          string `json:"pnTitle" db:"pn_title"`
	HasD2            bool   `json:"hasD2" db:"has_d2"`
	StandardId       string `json:"standardId" db:"standard_id"`
	FlangeStandardId string `json:"flangeStandardId" db:"flange_standard_id"`
}

type DeleteStandardInfoDTO struct {
	Id string `json:"id" db:"id" binding:"required"`
}
