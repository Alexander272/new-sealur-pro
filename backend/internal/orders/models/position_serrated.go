package models

import serrated_models "github.com/Alexander272/new-sealur-pro/internal/serrated/models"

type PositionSerrated struct {
	Main     *PositionSerrated_Main     `json:"main"`
	Size     *PositionSerrated_Size     `json:"size"`
	Material *PositionSerrated_Material `json:"material"`
	Design   *PositionSerrated_Design   `json:"design"`
}

type PositionSerrated_Main struct {
	Standard     *serrated_models.StandardInfo `json:"standard"`
	FlangeType   *serrated_models.FlangeType   `json:"flangeType"`
	SerratedType *serrated_models.SerratedType `json:"type"`
	Construction *serrated_models.Construction `json:"construction"`
}

type PositionSerrated_Size struct {
	Id    string `json:"id"`
	Dn    string `json:"dn"`
	DnAlt int64  `json:"dnAlt"`
	Pn    string `json:"pn"`
	PnAlt string `json:"pnAlt"`
	D4    string `json:"d4"`
	D3    string `json:"d3"`
	D2    string `json:"d2"`
	D1    string `json:"d1"`
	H     string `json:"h"`
}

type PositionSerrated_Material struct {
	Plating    *serrated_models.Plating  `json:"plating"`
	Base       *serrated_models.Material `json:"base"`
	RotaryPlug *serrated_models.Material `json:"rotaryPlug"`
}

type PositionSerrated_Design struct {
	Jumper       *PositionSerrated_Jumper `json:"jumper,omitempty"`
	HasHole      bool                     `json:"hasHole"`
	HasCoating   bool                     `json:"hasCoating"`
	WithRetainer bool                     `json:"withRetainer"`
	Drawing      string                   `json:"drawing"`
}
type PositionSerrated_Jumper struct {
	HasJumper bool   `json:"hasJumper"`
	Code      string `json:"code"`
	Width     string `json:"width"`
}

type PositionSerratedDTO struct {
	Id         string                        `json:"id"`
	PositionId string                        `json:"positionId"`
	Main       *PositionSerratedDTO_Main     `json:"main"`
	Size       *PositionSerratedDTO_Size     `json:"size"`
	Material   *PositionSerratedDTO_Material `json:"material"`
	Design     *PositionSerratedDTO_Design   `json:"design"`
}

type PositionSerratedDTO_Main struct {
	StandardId     string `json:"standardId"`
	FlangeTypeId   string `json:"flangeTypeId"`
	SerratedTypeId string `json:"serratedTypeId"`
	ConstructionId string `json:"constructionId"`
}

type PositionSerratedDTO_Size struct {
	Id string `json:"id"`
	D4 string `json:"d4"`
	D3 string `json:"d3"`
	D2 string `json:"d2"`
	D1 string `json:"d1"`
	H  string `json:"h"`
}

type PositionSerratedDTO_Material struct {
	PlatingId    string `json:"platingId"`
	BaseId       string `json:"baseId"`
	RotaryPlugId string `json:"rotaryPlugId"`
}

type PositionSerratedDTO_Design struct {
	Jumper       *PositionSerratedDTO_Jumper `json:"jumper,omitempty"`
	HasHole      bool                        `json:"hasHole"`
	HasCoating   bool                        `json:"hasCoating"`
	WithRetainer bool                        `json:"withRetainer"`
	Drawing      string                      `json:"drawing"`
}
type PositionSerratedDTO_Jumper struct {
	Code  string `json:"code"`
	Width string `json:"width"`
}
