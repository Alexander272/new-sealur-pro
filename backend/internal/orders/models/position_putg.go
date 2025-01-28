package models

import (
	putg_models "github.com/Alexander272/new-sealur-pro/internal/putg/models"
)

type PositionPutg struct {
	Main     *PositionPutg_Main     `json:"main"`
	Size     *PositionPutg_Size     `json:"size"`
	Material *PositionPutg_Material `json:"material"`
	Design   *PositionPutg_Design   `json:"design"`
}

type PositionPutg_Main struct {
	Id            string                     `json:"id"`
	Standard      *putg_models.StandardInfo  `json:"standard"`
	FlangeType    *putg_models.FlangeType    `json:"flangeType"`
	Configuration *putg_models.Configuration `json:"configuration"`
}

type PositionPutg_Size struct {
	Id            string          `json:"id"`
	Dn            string          `json:"dn"`
	DnMm          string          `json:"dnMm"`
	Pn            *putg_models.Pn `json:"pn"`
	D4            string          `json:"d4"`
	D3            string          `json:"d3"`
	D2            string          `json:"d2"`
	D1            string          `json:"d1"`
	H             string          `json:"h"`
	Another       string          `json:"another"`
	UseDimensions bool            `json:"useDimensions"`
	HasRounding   bool            `json:"hasRounding"`
}

type PositionPutg_Material struct {
	Id           string                    `json:"id"`
	Filler       *putg_models.Filler       `json:"filler"`
	PutgType     *putg_models.PutgType     `json:"putgType"`
	Construction *putg_models.Construction `json:"construction"`
	RotaryPlug   *putg_models.Material     `json:"rotaryPlug,omitempty"`
	InnerRing    *putg_models.Material     `json:"innerRing,omitempty"`
	OuterRing    *putg_models.Material     `json:"outerRing,omitempty"`
}

type PositionPutg_Design struct {
	Id           string                        `json:"id"`
	Jumper       *PositionPutg_Design_Jumper   `json:"jumper,omitempty"`
	HasHole      bool                          `json:"hasHole"`
	HasCoating   bool                          `json:"hasCoating"`
	HasRemovable bool                          `json:"hasRemovable"`
	Mounting     *PositionPutg_Design_Mounting `json:"mounting,omitempty"`
	Drawing      string                        `json:"drawing"`
}
type PositionPutg_Design_Jumper struct {
	HasJumper bool   `json:"hasJumper"`
	Code      string `json:"code"`
	Width     string `json:"width"`
}
type PositionPutg_Design_Mounting struct {
	HasMounting bool   `json:"hasMounting"`
	Code        string `json:"code"`
}

type PositionPutgDTO struct {
	Main     *PositionPutgDTO_Main     `json:"main"`
	Size     *PositionPutgDTO_Size     `json:"size"`
	Material *PositionPutgDTO_Material `json:"material"`
	Design   *PositionPutgDTO_Design   `json:"design"`
}

type PositionPutgDTO_Main struct {
	PutgStandardId    string `json:"putgStandardId"`
	FlangeTypeId      string `json:"flangeTypeId"`
	ConfigurationId   string `json:"configurationId"`
	ConfigurationCode string `json:"configurationCode"`
}

type PositionPutgDTO_Size struct {
	Dn            string          `json:"dn"`
	DnMm          string          `json:"dnMm"`
	Pn            *putg_models.Pn `json:"pn"`
	D4            string          `json:"d4"`
	D3            string          `json:"d3"`
	D2            string          `json:"d2"`
	D1            string          `json:"d1"`
	H             string          `json:"h"`
	Another       string          `json:"another"`
	UseDimensions bool            `json:"useDimensions"`
	HasRounding   bool            `json:"hasRounding"`
}

type PositionPutgDTO_Material struct {
	Filler       *putg_models.Filler       `json:"filler"`
	PutgType     *putg_models.PutgType     `json:"putgType"`
	Construction *putg_models.Construction `json:"construction"`
	RotaryPlug   *putg_models.Material     `json:"rotaryPlug,omitempty"`
	InnerRing    *putg_models.Material     `json:"innerRing,omitempty"`
	OuterRing    *putg_models.Material     `json:"outerRing,omitempty"`
}

type PositionPutgDTO_Design struct {
	Jumper       *PositionPutg_Design_Jumper   `json:"jumper,omitempty"`
	HasHole      bool                          `json:"hasHole"`
	HasCoating   bool                          `json:"hasCoating"`
	HasRemovable bool                          `json:"hasRemovable"`
	Mounting     *PositionPutg_Design_Mounting `json:"mounting,omitempty"`
	Drawing      string                        `json:"drawing"`
}
