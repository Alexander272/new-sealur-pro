package models

import wave_models "github.com/Alexander272/new-sealur-pro/internal/wave/models"

type PositionWave struct {
	Main     *PositionWave_Main     `json:"main"`
	Size     *PositionWave_Size     `json:"size"`
	Material *PositionWave_Material `json:"material"`
	Design   *PositionWave_Design   `json:"design"`
}

type PositionWave_Main struct {
	Configuration *wave_models.Configuration `json:"configuration"`
	Standard      *wave_models.StandardInfo  `json:"standard"`
	FlangeType    *wave_models.FlangeType    `json:"flangeType"`
	WaveType      *wave_models.WaveType      `json:"type"`
	Construction  *wave_models.Construction  `json:"construction"`
}

type PositionWave_Size struct {
	Id          string `json:"id"`
	Dn          string `json:"dn"`
	DnAlt       int64  `json:"dnAlt"`
	Pn          string `json:"pn"`
	PnAlt       string `json:"pnAlt"`
	D4          string `json:"d4"`
	D3          string `json:"d3"`
	D2          string `json:"d2"`
	D1          string `json:"d1"`
	H           string `json:"h"`
	HasRounding bool   `json:"hasRounding"`
}

type PositionWave_Material struct {
	Plating    *wave_models.Plating  `json:"plating"`
	Base       *wave_models.Material `json:"base"`
	RotaryPlug *wave_models.Material `json:"rotaryPlug"`
}

type PositionWave_Design struct {
	Jumper       *PositionWave_Jumper `json:"jumper,omitempty"`
	HasHole      bool                 `json:"hasHole"`
	HasCoating   bool                 `json:"hasCoating"`
	WithRetainer bool                 `json:"withRetainer"`
	Drawing      string               `json:"drawing"`
}
type PositionWave_Jumper struct {
	HasJumper bool   `json:"hasJumper"`
	Code      string `json:"code"`
	Width     string `json:"width"`
}

type PositionWaveDTO struct {
	Id         string                    `json:"id"`
	PositionId string                    `json:"positionId"`
	Main       *PositionWaveDTO_Main     `json:"main"`
	Size       *PositionWaveDTO_Size     `json:"size"`
	Material   *PositionWaveDTO_Material `json:"material"`
	Design     *PositionWaveDTO_Design   `json:"design"`
}

type PositionWaveDTO_Main struct {
	ConfigurationId string `json:"configurationId"`
	StandardId      string `json:"standardId"`
	FlangeTypeId    string `json:"flangeTypeId"`
	WaveTypeId      string `json:"waveTypeId"`
	ConstructionId  string `json:"constructionId"`
}

type PositionWaveDTO_Size struct {
	Id          string `json:"id"`
	D4          string `json:"d4"`
	D3          string `json:"d3"`
	D2          string `json:"d2"`
	D1          string `json:"d1"`
	H           string `json:"h"`
	HasRounding bool   `json:"hasRounding"`
	// UseDimensions bool   `json:"useDimensions"`
}

type PositionWaveDTO_Material struct {
	PlatingId    string `json:"platingId"`
	BaseId       string `json:"baseId"`
	RotaryPlugId string `json:"rotaryPlugId"`
}

type PositionWaveDTO_Design struct {
	Jumper       *PositionWaveDTO_Design_Jumper `json:"jumper,omitempty"`
	HasHole      bool                           `json:"hasHole"`
	HasCoating   bool                           `json:"hasCoating"`
	WithRetainer bool                           `json:"withRetainer"`
	Drawing      string                         `json:"drawing"`
}
type PositionWaveDTO_Design_Jumper struct {
	Code  string `json:"code"`
	Width string `json:"width"`
}
