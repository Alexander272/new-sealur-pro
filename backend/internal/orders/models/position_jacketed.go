package models

import jacketed_models "github.com/Alexander272/new-sealur-pro/internal/jacketed/models"

type PositionJacketed struct {
	Main     *PositionJacketed_Main     `json:"main"`
	Size     *PositionJacketed_Size     `json:"size"`
	Material *PositionJacketed_Material `json:"material"`
	Design   *PositionJacketed_Design   `json:"design"`
}

type PositionJacketed_Main struct {
	Standard     *jacketed_models.StandardInfo `json:"standard"`
	FlangeType   *jacketed_models.FlangeType   `json:"flangeType"`
	JacketedType *jacketed_models.JacketedType `json:"type"`
	Construction *jacketed_models.Construction `json:"construction"`
}

type PositionJacketed_Size struct {
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

type PositionJacketed_Material struct {
	Filler *jacketed_models.Filler   `json:"filler"`
	Shell  *jacketed_models.Material `json:"shell"`
}

type PositionJacketed_Design struct {
	Jumper  *PositionJacketed_Jumper `json:"jumper,omitempty"`
	Drawing string                   `json:"drawing"`
}
type PositionJacketed_Jumper struct {
	HasJumper bool   `json:"hasJumper"`
	Code      string `json:"code"`
	Width     string `json:"width"`
}

type PositionJacketedDTO struct {
	Id         string                        `json:"id"`
	PositionId string                        `json:"positionId"`
	Main       *PositionJacketedDTO_Main     `json:"main"`
	Size       *PositionJacketedDTO_Size     `json:"size"`
	Material   *PositionJacketedDTO_Material `json:"material"`
	Design     *PositionJacketedDTO_Design   `json:"design"`
}

type PositionJacketedDTO_Main struct {
	StandardId     string `json:"standardId"`
	FlangeTypeId   string `json:"flangeTypeId"`
	JacketedTypeId string `json:"jacketedTypeId"`
	ConstructionId string `json:"constructionId"`
}

type PositionJacketedDTO_Size struct {
	Id string `json:"id"`
	D4 string `json:"d4"`
	D3 string `json:"d3"`
	D2 string `json:"d2"`
	D1 string `json:"d1"`
	H  string `json:"h"`
}

type PositionJacketedDTO_Material struct {
	FillerId string `json:"fillerId"`
	ShellId  string `json:"shellId"`
}

type PositionJacketedDTO_Design struct {
	Jumper  *PositionJacketedDTO_Jumper `json:"jumper,omitempty"`
	Drawing string                      `json:"drawing"`
}
type PositionJacketedDTO_Jumper struct {
	Code  string `json:"code"`
	Width string `json:"width"`
}
