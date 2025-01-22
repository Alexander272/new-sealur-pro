package models

type WidthRange struct {
	MaxD3 float64 `json:"maxD3"`
	Width float64 `json:"width"`
}

type Construction struct {
	Id            string        `json:"id"`
	Title         string        `json:"title"`
	Code          string        `json:"code"`
	HasD4         bool          `json:"hasD4"`
	HasD3         bool          `json:"hasD3"`
	HasD2         bool          `json:"hasD2"`
	HasD1         bool          `json:"hasD1"`
	HasRotaryPlug bool          `json:"hasRotaryPlug"`
	HasInnerRing  bool          `json:"hasInnerRing"`
	HasOuterRing  bool          `json:"hasOuterRing"`
	BaseId        string        `json:"baseId"`
	Description   string        `json:"description"`
	MinWidth      float64       `json:"minWidth"`
	JumperRange   []int64       `json:"jumperRange"`
	WidthRange    []*WidthRange `json:"widthRange"`
	MinSize       int64         `json:"minSize"`
}

type GetConstructionDTO struct {
	FillerId     string `json:"fillerId"`
	FlangeTypeId string `json:"flangeTypeId"`
}

type ConstructionDTO struct {
	Id             string `json:"id"`
	ConstructionId string `json:"constructionId"`
	FillerId       string `json:"fillerId"`
	FlangeTypeId   string `json:"flangeTypeId"`
}

type DeleteConstructionDTO struct {
	Id string `json:"id"`
}
