package models

type GetBaseConstructionDTO struct{}

type BaseConstructionDTO struct {
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
	Description   string        `json:"description"`
	MinWidth      float64       `json:"minWidth"`
	JumperRange   []int64       `json:"jumperRange"`
	WidthRange    []*WidthRange `json:"widthRange"`
	MinSize       int64         `json:"minSize"`
}

type DeleteBaseConstructionDTO struct {
	Id string `json:"id"`
}
